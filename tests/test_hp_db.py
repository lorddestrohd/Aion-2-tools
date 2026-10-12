"""The client-side community effective-HP database: blends the server's confident,
per-build consensus into the live snapshot so an enemy's HP reads in damage units
(accurate packet fraction x accurate damage-unit maximum), falls back to a damage
estimate when no packet HP is seen, never touches players, caches to disk for startup,
and is keyed by build so a patch never mixes scales."""
import json

import pytest

from aion2calc.combat import hp_db


@pytest.fixture
def fresh(tmp_path, monkeypatch):
    monkeypatch.setenv("AION2CALC_HOME", str(tmp_path))
    # Reset the module's in-memory state so each test starts clean.
    monkeypatch.setattr(hp_db, "_tables", {})
    monkeypatch.setattr(hp_db, "_fetched_at", {})
    monkeypatch.setattr(hp_db, "_refresh_monotonic", {})
    monkeypatch.setattr(hp_db, "_loaded", False)
    return tmp_path


def _seed(build, npc, eff, samples=5):
    hp_db._tables[build] = {npc: {"effective_hp": eff, "samples": samples}}
    hp_db._loaded = True


def test_blends_packet_fraction_with_damage_unit_maximum(fresh):
    _seed("1.0.21", 56968, 6420.0)
    snap = {"current_target": {"mob_code": 56968, "damage": 3000, "hp_pct": 0.5}, "enemies": []}
    hp_db.enrich(snap, "1.0.21")
    t = snap["current_target"]
    assert t["effective_max_hp"] == 6420                 # damage-unit maximum from the community
    assert t["effective_current_hp"] == 3210             # 50% (accurate packet fraction) x 6420
    assert t["effective_hp_pct"] == 0.5
    assert t["effective_hp_samples"] == 5
    assert t["hp_pct"] == 0.5                             # packet fraction stays authoritative


def test_falls_back_to_damage_estimate_without_packet_hp(fresh):
    _seed("1.0.21", 56968, 6000.0)
    snap = {"current_target": {"mob_code": 56968, "damage": 4500, "hp_pct": None}}
    hp_db.enrich(snap, "1.0.21")
    t = snap["current_target"]
    assert t["effective_max_hp"] == 6000
    assert t["effective_current_hp"] == 1500             # 6000 - 4500 dealt
    assert t["effective_hp_pct"] == pytest.approx(0.25)
    assert t["hp_pct"] == pytest.approx(0.25)             # a bar appears even with no packet HP


def test_never_touches_players_or_unknown_mobs_or_other_builds(fresh):
    _seed("1.0.21", 56968, 6420.0)
    snap = {"current_target": {"mob_code": 56968, "damage": 100, "hp_pct": 0.9, "is_player": True},
            "enemies": [{"mob_code": 999, "damage": 100, "hp_pct": 0.5}]}   # unknown mob
    hp_db.enrich(snap, "1.0.21")
    assert "effective_max_hp" not in snap["current_target"]      # players never enriched
    assert "effective_max_hp" not in snap["enemies"][0]          # unknown mob untouched
    # A different build must not read this build's values.
    snap2 = {"current_target": {"mob_code": 56968, "damage": 100, "hp_pct": 0.5}}
    hp_db.enrich(snap2, "9.9.9")
    assert "effective_max_hp" not in snap2["current_target"]


def test_refresh_fetches_caches_to_disk_and_reloads(fresh, monkeypatch):
    served = {"build": "1.0.21", "enemies": {"56968": {"effective_hp": 6420, "samples": 4}}}

    class _Resp:
        def __enter__(self): return self
        def __exit__(self, *a): return False
        def read(self): return json.dumps(served).encode()
    monkeypatch.setattr(hp_db.share, "effective", lambda: {"url": "https://logs.example.com"})
    monkeypatch.setattr(hp_db.urllib.request, "urlopen", lambda req, timeout=None: _Resp())

    assert hp_db.refresh("1.0.21", force=True) == "ok:1"
    assert hp_db.effective_hp(56968, "1.0.21")["effective_hp"] == 6420

    # A fresh process (cleared memory) reconstructs the table from disk on first use.
    hp_db._tables, hp_db._fetched_at, hp_db._loaded = {}, {}, False
    assert hp_db.effective_hp(56968, "1.0.21")["effective_hp"] == 6420   # loaded from disk cache


def test_refresh_is_best_effort_on_network_error(fresh, monkeypatch):
    monkeypatch.setattr(hp_db.share, "effective", lambda: {"url": "https://logs.example.com"})
    def boom(req, timeout=None): raise OSError("down")
    monkeypatch.setattr(hp_db.urllib.request, "urlopen", boom)
    assert hp_db.refresh("1.0.21", force=True) == "error:OSError"        # never raises
    assert hp_db.refresh(None) == "no-build"
