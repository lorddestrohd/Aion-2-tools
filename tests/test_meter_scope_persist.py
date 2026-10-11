"""The live meter's "Players" scope choice (#mscope) must persist across app
restarts: app.js has to both restore it from localStorage on load and save it
on change, like the character-name and final-boss fields already do."""
import pathlib

APPJS = (pathlib.Path(__file__).resolve().parents[1] / "aion2calc" / "app" / "static" / "app.js").read_text(encoding="utf-8")


def test_scope_is_restored_from_local_storage_on_load():
    # Restore reads the saved key and only accepts the four valid scope values.
    assert 'localStorage.getItem("meter-scope")' in APPJS
    assert '["auto","party","self","all"].includes(s)' in APPJS


def test_scope_is_saved_on_change():
    assert 'localStorage.setItem("meter-scope", $("#mscope").value)' in APPJS
