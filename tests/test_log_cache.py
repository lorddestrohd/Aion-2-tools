"""Automated logs-folder cleanup: keep the combat-logs folder under a user cap
(default 1 GB) by deleting the oldest recordings first, never the active one."""
import os

import pytest

from aion2calc.app import server, settings_backup
from aion2calc.combat import sessions
from aion2calc.paths import logs_dir


@pytest.fixture
def home(tmp_path, monkeypatch):
    monkeypatch.setenv("AION2CALC_HOME", str(tmp_path))
    return tmp_path


def _write(name: str, size: int, mtime: float):
    p = logs_dir() / name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(b"x" * size)
    os.utime(p, (mtime, mtime))
    return p


def test_default_cap_is_one_gigabyte(home):
    assert server.ui_settings()["meter_log_cache_mb"] == 1024


def test_cap_rides_the_settings_backup(home):
    assert settings_backup.import_settings({"meter_log_cache_mb": 512})["settings"]["meter_log_cache_mb"] == 512
    assert settings_backup.import_settings({"meter_log_cache_mb": 0})["settings"]["meter_log_cache_mb"] == 0
    with pytest.raises(ValueError):
        settings_backup.import_settings({"meter_log_cache_mb": -1})


def test_prune_deletes_oldest_first_until_under_cap(home):
    a = _write("session-a.a2log.json", 400, mtime=1000)   # oldest
    b = _write("session-b.a2log.json", 400, mtime=2000)
    c = _write("session-c.a2log.json", 400, mtime=3000)   # newest
    result = sessions.prune_logs(900)                      # cap fits one file + part of another → keep newest two
    assert not a.exists()                                  # oldest removed
    assert b.exists() and c.exists()                       # newer kept
    assert result["removed"] == 1
    assert result["total_bytes"] == 800


def test_prune_never_removes_the_active_file(home):
    old = _write("session-old.a2log.json", 800, mtime=1000)
    active = _write("session-active.a2log.json", 800, mtime=2000)
    # Cap below both; the active file is protected even though removing it is needed to fit.
    result = sessions.prune_logs(500, keep={"session-active.a2log.json"})
    assert not old.exists()
    assert active.exists()
    assert result["removed"] == 1


def test_zero_cap_disables_pruning(home):
    f = _write("session-x.a2log.json", 5000, mtime=1000)
    result = sessions.prune_logs(0)
    assert f.exists()
    assert result["removed"] == 0
