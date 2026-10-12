"""Community enemy effective-HP database (client side): fetch the server's confident
per-build consensus, cache it locally, and blend it into the live meter so an enemy's
HP can be shown in the same units as your damage.

Two independent HP signals exist, each trustworthy for one thing only:

* **packet HP%** -- the game broadcasts an enemy's current/max HP to everyone in
  range, so ``current/max`` is an accurate *fraction remaining* even in a party. But
  the absolute values are on a much larger, different scale than damage, so the raw
  numbers never line up with a damage meter.
* **community effective HP** -- the total damage an enemy takes to die, pooled across
  many players and builds by the server (see ``enemy_hp.py`` there). It is an accurate
  *absolute maximum in damage units*, but only a maximum, not a live reading.

Blending them gives the best of both: multiply the accurate packet fraction by the
accurate damage-unit maximum to get a live current/max HP that is right in magnitude
*and* in percentage. When no packet HP is seen (some mobs never broadcast it), fall
back to a damage-based estimate (max minus the damage dealt so far).

Everything is keyed by game build so a balance patch never mixes HP scales, and only
the server's **confident** values are ever served, so an under-sampled enemy simply
keeps the old packet-only display until the community has learned it. The last fetch
is cached on disk, so the blend is available at startup before the first refresh --
this is the "reconstruct HP values from the database on launch" behaviour.
"""
from __future__ import annotations

import json
import threading
import time
import urllib.parse
import urllib.request

from ..paths import data_file, read_json, write_user_json
from . import share

_CACHE_FILE = ("community", "enemy_hp_cache.json")
_ENDPOINT = "/api/v1/enemy-hp"
#: Refresh the confident table at most this often (seconds); it changes slowly.
_REFRESH_EVERY = 1800.0
_lock = threading.Lock()
#: In-memory: build -> {npc_id(int): {"effective_hp": float, "samples": int}}.
_tables: dict[str, dict[int, dict]] = {}
_fetched_at: dict[str, float] = {}
_loaded = False


def _load_disk() -> None:
    """Prime the in-memory tables from the on-disk cache once, so the blend works at
    startup before any network fetch. Best-effort; a missing or corrupt cache is fine."""
    global _loaded
    if _loaded:
        return
    _loaded = True
    try:
        if not data_file(*_CACHE_FILE).exists():
            return
        doc = read_json(*_CACHE_FILE)
    except Exception:
        return
    for build, entry in (doc.get("builds") or {}).items():
        table = {}
        for npc, value in (entry.get("enemies") or {}).items():
            try:
                table[int(npc)] = {"effective_hp": float(value["effective_hp"]),
                                   "samples": int(value.get("samples") or 0)}
            except (TypeError, ValueError, KeyError):
                continue
        if table:
            _tables[str(build)] = table
            _fetched_at[str(build)] = float(entry.get("fetched_at") or 0)


def _save_disk() -> None:
    try:
        builds = {build: {"fetched_at": _fetched_at.get(build, 0),
                          "enemies": {str(npc): v for npc, v in table.items()}}
                  for build, table in _tables.items()}
        write_user_json({"builds": builds}, *_CACHE_FILE)
    except Exception:
        pass


def effective_hp(npc_id, build: str | None) -> dict | None:
    """The confident community effective-HP entry for an enemy on a build, or None.
    Returns ``{"effective_hp": float, "samples": int}``."""
    if not build:
        return None
    with _lock:
        _load_disk()
        try:
            return _tables.get(str(build), {}).get(int(npc_id))
        except (TypeError, ValueError):
            return None


def refresh(build: str | None, *, force: bool = False) -> str:
    """Fetch the server's confident effective-HP table for ``build`` and cache it (in
    memory and on disk). Throttled to :data:`_REFRESH_EVERY`. Best-effort: returns a
    short status string and never raises, so a meter never depends on the network."""
    try:
        if not build:
            return "no-build"
        with _lock:
            _load_disk()
            if not force and time.monotonic() - _refresh_monotonic.get(build, -1e9) < _REFRESH_EVERY:
                return "fresh"
        server = share.effective()
        base = str(server.get("url") or "").rstrip("/")
        if not base:
            return "no-server"
        url = base + _ENDPOINT + "?" + urllib.parse.urlencode({"build": build})
        req = urllib.request.Request(url, headers={"User-Agent": "aion2calc"})
        with urllib.request.urlopen(req, timeout=8) as response:
            doc = json.loads(response.read().decode("utf-8"))
        table = {}
        for npc, value in (doc.get("enemies") or {}).items():
            try:
                eff = float(value["effective_hp"])
            except (TypeError, ValueError, KeyError):
                continue
            if eff > 0:
                table[int(npc)] = {"effective_hp": eff, "samples": int(value.get("samples") or 0)}
        with _lock:
            _tables[str(build)] = table
            _fetched_at[str(build)] = time.time()
            _refresh_monotonic[build] = time.monotonic()
            _save_disk()
        return f"ok:{len(table)}"
    except Exception as exc:
        return "error:" + type(exc).__name__


#: Monotonic clock of the last successful/attempted refresh per build (throttle).
_refresh_monotonic: dict[str, float] = {}


def refresh_async(build: str | None) -> None:
    """Refresh on a daemon thread so startup and the live loop never block on the
    network. No-op when already fresh (the refresh itself is throttled)."""
    try:
        if not build:
            return
        if time.monotonic() - _refresh_monotonic.get(build, -1e9) < _REFRESH_EVERY:
            return
        threading.Thread(target=refresh, args=(build,), daemon=True,
                         name="aion2-enemy-hp-refresh").start()
    except Exception:
        pass


def _blend_target(target: dict, build: str | None) -> None:
    """Enrich one enemy/target dict in place with community effective-HP fields when a
    confident value is known for its mob. Never removes or worsens existing fields."""
    if not isinstance(target, dict) or target.get("is_player"):
        return
    entry = effective_hp(target.get("mob_code"), build)
    if not entry:
        return
    eff_max = entry["effective_hp"]
    packet_pct = target.get("hp_pct")
    if isinstance(packet_pct, (int, float)) and not isinstance(packet_pct, bool):
        # Accurate remaining fraction (broadcast) x accurate damage-unit maximum.
        fraction = max(0.0, min(1.0, float(packet_pct)))
    else:
        # No packet HP for this mob: estimate remaining from the damage dealt so far.
        dealt = target.get("damage")
        dealt = float(dealt) if isinstance(dealt, (int, float)) and not isinstance(dealt, bool) else 0.0
        fraction = max(0.0, min(1.0, 1.0 - dealt / eff_max)) if eff_max > 0 else None
    target["effective_max_hp"] = round(eff_max)
    target["effective_hp_samples"] = entry.get("samples", 0)
    if fraction is not None:
        target["effective_current_hp"] = round(eff_max * fraction)
        target["effective_hp_pct"] = fraction
        # Surface a real HP% even when the game never broadcast packet HP for this mob,
        # so the bar and readout appear; packet HP stays authoritative when present.
        if target.get("hp_pct") is None:
            target["hp_pct"] = fraction
        target.setdefault("hp_source", "community" if target.get("effective_current_hp") is not None else "packet")


def enrich(snap: dict, build: str | None) -> dict:
    """Blend the confident community effective-HP into a live snapshot, in place and
    returning it. Pure and fast (no network): uses only the cached table, so it is safe
    to call under the capture lock. Enriches the current target and every listed enemy;
    a no-op when nothing confident is cached for this build."""
    if not isinstance(snap, dict) or not build:
        return snap
    try:
        with _lock:
            _load_disk()
            has = bool(_tables.get(str(build)))
        if not has:
            return snap
        _blend_target(snap.get("current_target"), build)
        for enemy in (snap.get("enemies") or []):
            _blend_target(enemy, build)
    except Exception:
        pass
    return snap
