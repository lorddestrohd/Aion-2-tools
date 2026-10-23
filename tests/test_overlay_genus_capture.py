import sys
from types import SimpleNamespace

import pytest

from aion2calc import overlay


def test_capture_genus_hides_overlay_for_one_frame_then_runs_local_ocr(monkeypatch):
    backend = object.__new__(overlay._Windows)
    game = SimpleNamespace(bounds=(10, 20, 1000, 600), minimized=False)
    backend.game_window = lambda: game
    shown = []
    backend.user32 = SimpleNamespace(ShowWindow=lambda hwnd, command: shown.append((hwnd, command)))
    frame = SimpleNamespace(size=(1000, 600), rgb=bytes(1000 * 600 * 3))
    captured = []

    class Screen:
        def __enter__(self):
            return self

        def __exit__(self, *_):
            return False

        def grab(self, region):
            captured.append(region)
            return frame

    monkeypatch.setattr(overlay, "native_overlay", lambda: backend)
    monkeypatch.setattr(overlay.time, "sleep", lambda _seconds: None)
    monkeypatch.setitem(sys.modules, "mss", SimpleNamespace(mss=Screen))
    monkeypatch.setattr("aion2calc.app.genus_ocr.analyze",
                        lambda image, language: {"genus": "Cogni", "language": language,
                                                 "image_is_png": image.startswith(b"\x89PNG")})
    api = overlay._OverlayAPI()
    api._window = SimpleNamespace(native=SimpleNamespace(Handle=SimpleNamespace(ToInt64=lambda: 123)))
    api._on_ui = lambda callback: callback()

    assert api.capture_genus("en") == {
        "genus": "Cogni", "language": "en", "image_is_png": True,
    }
    assert captured == [{"left": 10, "top": 20, "width": 1000, "height": 600}]
    assert shown == [(123, 0), (123, 4)]


def test_capture_genus_requires_a_visible_game_window(monkeypatch):
    backend = object.__new__(overlay._Windows)
    backend.game_window = lambda: None
    monkeypatch.setattr(overlay, "native_overlay", lambda: backend)
    with pytest.raises(RuntimeError, match="Open AION 2"):
        overlay._OverlayAPI().capture_genus()


def test_genus_capture_url_opens_a_separate_native_window(monkeypatch, tmp_path):
    calls = {}
    class Event:
        def __init__(self):
            self.handlers = []

        def __iadd__(self, handler):
            self.handlers.append(handler)
            return self

    window = SimpleNamespace(events=SimpleNamespace(loaded=Event(), shown=Event()),
                             native=SimpleNamespace(Opacity=1.0, InvokeRequired=False))
    webview = SimpleNamespace(
        create_window=lambda title, url, **options: calls.update(title=title, url=url, options=options) or window,
        start=lambda **options: calls.update(start=options),
    )
    monkeypatch.setitem(sys.modules, "webview", webview)
    monkeypatch.setitem(sys.modules, "System", SimpleNamespace(Action=lambda callback: callback))
    monkeypatch.setattr(overlay, "_log_path", lambda: tmp_path / "overlay.log")
    monkeypatch.setattr(overlay, "_overlay_prefs", lambda: (_ for _ in ()).throw(AssertionError("combat prefs loaded")))
    monkeypatch.setattr(overlay.sys, "platform", "win32")

    url = "http://127.0.0.1:8765/genus-capture"
    assert overlay.main(["--url", url]) == 0
    assert calls["url"] == url and calls["title"] == "Aion 2 Calc — Genus Capture"
    assert calls["options"]["width"] == 440 and calls["options"]["height"] == 180
    assert calls["options"]["min_size"] == (350, 150)
    assert calls["options"]["resizable"] and calls["options"]["focus"]
    assert calls["options"]["frameless"] and not calls["options"]["easy_drag"]
    assert calls["options"]["background_color"] == "#1b202a"
    assert calls["start"] == {"gui": "edgechromium"}
    window.events.loaded.handlers[0]()
    window.events.shown.handlers[0]()
    window.events.shown.handlers[1]()
    assert window.native.Opacity == 0.72
    log = (tmp_path / "overlay.log").read_text(encoding="utf-8")
    assert "genus-capture: started" in log
    assert "genus-capture: window loaded" in log
    assert "genus-capture: window shown" in log


def test_close_genus_capture_destroys_its_native_window():
    destroyed = []
    api = overlay._OverlayAPI()
    api._window = SimpleNamespace(destroy=lambda: destroyed.append(True))
    api._on_ui = lambda callback: callback()

    assert api.close_genus_capture() is True
    assert destroyed == [True]


def test_resize_genus_capture_clamps_the_content_height():
    resized = []
    api = overlay._OverlayAPI()
    api._window = SimpleNamespace(resize=lambda width, height: resized.append((width, height)))
    api._on_ui = lambda callback: callback()

    assert api.resize_genus_capture(420) is True
    assert api.resize_genus_capture(900) is True
    assert resized == [(440, 420), (440, 760)]
    with pytest.raises(ValueError, match="must be an integer"):
        api.resize_genus_capture("420")


def test_genus_capture_opacity_matches_combat_overlay():
    native = SimpleNamespace(Opacity=1.0)
    api = overlay._OverlayAPI()
    api._window = SimpleNamespace(native=native)
    api._on_ui = lambda callback: callback()

    assert api.set_genus_capture_opacity() is True
    assert native.Opacity == 0.72


def test_genus_capture_startup_failure_is_logged_without_browser_fallback(monkeypatch, tmp_path):
    webview = SimpleNamespace(create_window=lambda *_args, **_kwargs: (_ for _ in ()).throw(RuntimeError("WebView2 failed")))
    monkeypatch.setitem(sys.modules, "webview", webview)
    monkeypatch.setattr(overlay, "_log_path", lambda: tmp_path / "overlay.log")
    opened = []
    monkeypatch.setattr(overlay.webbrowser, "open", lambda url: opened.append(url))
    url = "http://127.0.0.1:8765/genus-capture"

    assert overlay.main(["--url", url]) == 1
    assert not opened
    assert "genus-capture: startup failed: RuntimeError: WebView2 failed" in (
        tmp_path / "overlay.log").read_text(encoding="utf-8")
