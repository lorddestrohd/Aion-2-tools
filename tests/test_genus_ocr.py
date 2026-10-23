import pytest

from aion2calc.app.genus_ocr import _crop_panel, parse_text


def test_parse_genus_effect_rows_and_level():
    text = """Cogni Insight
LV. 10 (MAX)
Analysis Effect
Back Attack 13
HP increase 1.1%
Accuracy Bonus 22
HP 39
Max Attack 14
Power Shard Damage Bonus 6
Accuracy Bonus 21
Back Defense 88
Back Attack Critical Hit 16
"""
    result = parse_text(text)
    assert result["genus"] == "Cogni"
    assert result["level"] == 10
    assert result["lines"] == [
        {"slot": 1, "stat": "Back Attack", "value": "13"},
        {"slot": 2, "stat": "HP increase", "value": "1.1%"},
        {"slot": 3, "stat": "Accuracy Bonus", "value": "22"},
        {"slot": 4, "stat": "HP", "value": "39"},
        {"slot": 5, "stat": "Max Attack", "value": "14"},
        {"slot": 6, "stat": "Power Shard Damage Bonus", "value": "6"},
        {"slot": 7, "stat": "Accuracy Bonus", "value": "21"},
        {"slot": 8, "stat": "Back Defense", "value": "88"},
        {"slot": 9, "stat": "Back Attack Critical Hit", "value": "16"},
    ]
    assert result["needs_review"] is False


def test_parse_keeps_unrecognized_value_in_its_slot_for_review():
    result = parse_text("Cogni Insight\nLV. 10\nAnalysis Effect\nBack Attack 13\n39\n")
    assert result["lines"] == [
        {"slot": 1, "stat": "Back Attack", "value": "13"},
        {"slot": 2, "stat": None, "value": "39", "unrecognized_stat": ""},
    ]
    assert result["needs_review"] is True


def test_unrecognized_stat_text_is_preserved_for_manual_selection():
    result = parse_text("Cogni Insight\nLV. 10\nAnalysis Effect\nUnlisted Stat 13\n")
    assert result["lines"] == [
        {"slot": 1, "stat": None, "value": "13", "unrecognized_stat": "Unlisted Stat"},
    ]
    assert result["needs_review"] is True


def test_parse_spanish_genus_labels_and_decimal_comma():
    text = """Cogni
Nivel 10
Efecto de análisis
Ataque trasero 13
Aumento de vida 1,1%
Bonificación de precisión 22
Vida 39
Ataque máximo 14
Bonificación de daño de fragmento de poder 6
Bonificación de precisión 21
Defensa trasera 88
Golpe crítico de ataque trasero 16
"""
    result = parse_text(text)
    assert result["level"] == 10
    assert result["lines"][1] == {"slot": 2, "stat": "HP increase", "value": "1.1%"}
    assert result["lines"][5] == {"slot": 6, "stat": "Power Shard Damage Bonus", "value": "6"}
    assert result["lines"][8] == {"slot": 9, "stat": "Back Attack Critical Hit", "value": "16"}
    assert result["needs_review"] is False


def test_crop_rejects_invalid_capture():
    with pytest.raises(ValueError, match="decoded"):
        _crop_panel(b"not an image")
