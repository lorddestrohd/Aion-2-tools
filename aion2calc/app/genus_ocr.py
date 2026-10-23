"""One-shot local screen capture and OCR for Pet Genus Insight."""
from __future__ import annotations

import asyncio
import difflib
import io
import re
import sys
import unicodedata

from PIL import Image, ImageOps

MAX_IMAGE_BYTES = 20 * 1024 * 1024
MAX_IMAGE_PIXELS = 40_000_000
GENERA = ("Cogni", "Fera", "Natura", "Varian", "Special")
ALIASES = {
    "aumento de vida": "HP increase",
    "aumento de hp": "HP increase",
    "vida": "HP",
    "ataque maximo": "Max Attack",
    "ataque máximo": "Max Attack",
    "ataque trasero": "Back Attack",
    "ataque por la espalda": "Back Attack",
    "defensa trasera": "Back Defense",
    "bonificacion de precision": "Accuracy Bonus",
    "danio de ataque de fragmento de poder": "Power Shard Damage Bonus",
    "bonificacion de dano de fragmento de poder": "Power Shard Damage Bonus",
    "bonificacion de dano del fragmento de poder": "Power Shard Damage Bonus",
    "golpe critico de ataque trasero": "Back Attack Critical Hit",
    "golpe critico de ataque por la espalda": "Back Attack Critical Hit",
}


def _properties() -> list[str]:
    from ..paths import read_json

    data = read_json("global", "genus_properties.json")
    found = set()
    for genus in data.get("genera", {}).values():
        for slot in genus.get("slots", {}).values():
            found.update(slot)
    return sorted(found, key=len, reverse=True)


def _normal(value: str) -> str:
    plain = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "", plain.casefold())


def _match_stat(text: str, properties: list[str]) -> str | None:
    candidate = re.sub(r"^[^A-Za-z0-9]+", "", text).strip()
    normalized = _normal(candidate)
    translated = _normal(candidate)
    for alias, canonical in ALIASES.items():
        if translated.startswith(_normal(alias)):
            return canonical
    exact = [name for name in properties if normalized.startswith(_normal(name))]
    if exact:
        return exact[0]
    # OCR may misread a single character in an otherwise recognizable stat label.
    label = re.sub(r"\s*[-+]?\d+(?:[.,]\d+)?\s*%?\s*$", "", candidate).strip()
    closest = difflib.get_close_matches(_normal(label), [_normal(p) for p in properties], n=1, cutoff=0.88)
    if closest:
        index = [_normal(p) for p in properties].index(closest[0])
        return properties[index]
    return None


def parse_text(text: str) -> dict:
    """Extract only explicit labels and values; keep uncertainty visible for review."""
    properties = _properties()
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    genus = next((name for name in GENERA if re.search(rf"\b{re.escape(name)}\b", text, re.I)), None)
    level_match = re.search(r"\b(?:lv\.?|level|nivel)\s*(\d{1,2})\b", text, re.I)
    level = int(level_match.group(1)) if level_match and int(level_match.group(1)) <= 10 else None
    parsed = []
    unmatched = []
    effect_header = next((i for i, line in enumerate(lines)
                          if any(word in _normal(line) for word in ("analysiseffect", "efectodeanalisis"))), -1)
    effect_lines = lines[effect_header + 1:] if effect_header >= 0 else lines
    for line in effect_lines:
        stat = _match_stat(line, properties)
        value_match = re.search(r"([-+]?\d+(?:[.,]\d+)?\s*%?)\s*$", line)
        number_only = re.fullmatch(r"[-+]?\d+(?:[.,]\d+)?\s*%?", line)
        if not stat and not number_only:
            continue
        if not value_match:
            unmatched.append(line)
            continue
        value = value_match.group(1).replace(",", ".").replace(" ", "")
        parsed.append({"slot": len(parsed) + 1, "stat": stat, "value": value})
    return {
        "genus": genus,
        "level": level,
        "lines": parsed[:9],
        "unmatched": unmatched[:9],
        "text": text.strip(),
        "needs_review": genus is None or level is None or not parsed or len(parsed) != 9
                        or any(not row["stat"] for row in parsed),
    }


def _crop_panel(raw: bytes) -> bytes:
    if not raw or len(raw) > MAX_IMAGE_BYTES:
        raise ValueError("Genus capture is empty or exceeds 20 MiB.")
    try:
        with Image.open(io.BytesIO(raw)) as image:
            if image.format != "PNG" or image.width > 30_000 or image.height > 30_000 \
                    or image.width * image.height > MAX_IMAGE_PIXELS:
                raise ValueError("Genus capture has an unsupported image format or size.")
            image = ImageOps.exif_transpose(image).convert("RGB")
            width, height = image.size
            # The Genus Insight list is anchored to the right edge of the Pets screen.
            panel = image.crop((int(width * .76), int(height * .12), width, int(height * .68)))
            if panel.width < 2 or panel.height < 2:
                raise ValueError("Captured game window is too small to read.")
            panel = panel.resize((panel.width * 2, panel.height * 2), Image.Resampling.LANCZOS)
            output = io.BytesIO()
            panel.save(output, format="PNG")
            return output.getvalue()
    except (OSError, Image.DecompressionBombError) as exc:
        raise ValueError("Genus capture could not be decoded.") from exc


async def _recognize(raw: bytes, language: str) -> tuple[str, str]:
    try:
        from winrt.windows.globalization import Language
        from winrt.windows.graphics.imaging import BitmapDecoder
        from winrt.windows.media.ocr import OcrEngine
        from winrt.windows.storage.streams import DataWriter, InMemoryRandomAccessStream
    except ImportError as exc:
        raise RuntimeError("Install the Genus OCR support with: python -m pip install -e \".[genus-ocr]\"") from exc

    languages = {
        item.language_tag.casefold(): item
        for item in OcrEngine.available_recognizer_languages
    }
    if language == "auto":
        choices = [tag for tag in ("en-us", "es-es", "es-mx", "en-gb") if tag in languages]
    else:
        preferred = "es-es" if language == "es" else "en-us"
        choices = [preferred] if preferred in languages else []
    if not choices:
        raise RuntimeError("Windows OCR language pack for English or Spanish is not installed.")

    stream = InMemoryRandomAccessStream()
    writer = DataWriter(stream)
    writer.write_bytes(raw)
    await writer.store_async()
    await writer.flush_async()
    writer.detach_stream()
    stream.seek(0)
    decoder = await BitmapDecoder.create_async(stream)
    bitmap = await decoder.get_software_bitmap_async()
    results = []
    for tag in choices:
        engine = OcrEngine.try_create_from_language(languages[tag])
        if engine is None:
            continue
        result = await engine.recognize_async(bitmap)
        words = []
        for line in result.lines:
            for word in line.words:
                bounds = word.bounding_rect
                words.append((bounds.y + bounds.height / 2, bounds.x, word.text))
        rows = []
        for y, x, word in sorted(words):
            row = next((row for row in rows if abs(row["y"] - y) <= 18), None)
            if row is None:
                row = {"y": y, "words": []}
                rows.append(row)
            row["words"].append((x, word))
        text = "\n".join(" ".join(word for _, word in sorted(row["words"])) for row in rows)
        parsed = parse_text(text)
        results.append((len(parsed["lines"]), text, tag))
    if not results:
        raise RuntimeError("Windows could not initialize an English or Spanish OCR engine.")
    count, text, tag = max(results, key=lambda result: (result[0], len(result[1])))
    return text, tag


def analyze(raw: bytes, language: str = "auto") -> dict:
    if sys.platform != "win32":
        raise RuntimeError("Genus screen OCR is available only on Windows.")
    if language not in {"auto", "en", "es"}:
        raise ValueError("Choose automatic, English, or Spanish OCR.")
    panel = _crop_panel(raw)
    text, detected_language = asyncio.run(_recognize(panel, language))
    result = parse_text(text)
    result["language"] = detected_language
    return result
