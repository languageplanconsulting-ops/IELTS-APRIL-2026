#!/usr/bin/env python3
"""Extract Cambridge 17 listening audioscripts (sections 2 & 4) from the official PDF."""
from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader

DEFAULT_PDF = Path.home() / "Downloads" / "Cambridge 17_text.pdf"
OUT_PATH = Path(__file__).resolve().parent / "cambridge-17-listening-scripts.json"

SCRIPT_PAGE_START = 88
SCRIPT_PAGE_END = 111

# Chronological order in PDF appendix (include Part 1/3 skips between S2/S4 blocks)
SEGMENT_STARTS = [
    (2, 1, "Boat trip round Tasmania", r"My name['\u2019]?s Lou Miller"),
    (3, 1, "_skip_", r"DIANA:\s*So, Tim"),
    (4, 1, "Labyrinths", r"Labyrinths have existed"),
    (1, 0, "_skip_", r"Jane Fairbanks"),
    (2, 2, "Oniton Hall", r"Oniton Hall, one of the largest estates"),
    (3, 0, "_skip_", r"Did you make notes while you were watching the performances of Romeo"),
    (4, 2, "Impact of digital technology on the Icelandic language", r"Right, everyone, let['\u2019]?s make a start"),
    (1, 0, "_skip_", r"Jack, I['\u2019]?m thinking of taking the kids"),
    (2, 3, "Childcare Services", r"My name['\u2019]?s Mrs Carter"),
    (3, 0, "_skip_", r"HOLLY:\s*Hello Dr Green"),
    (4, 3, "Bird Migration Theory", r"Scientists believe that a majority of the earth['\u2019]?s bird population"),
    (1, 0, "_skip_", r"Easy Life Cleaning Services"),
    (2, 4, "Hotel Management", r"worked in the hotel industry"),
    (4, 4, "Maple syrup", r"another natural food product"),
]

OCR_FIXES = [
    (r"\bhe first\b", "the first"),
    (r"\bhad ed to\b", "had led to"),
    (r"\bwilling to ive\b", "willing to live"),
    (r"\bwhere hey nest\b", "where they nest"),
    (r"pops up\.\s*right in front", "pops up right in front"),
    (r"\bhe house\b", "the house"),
    (r"\bike the\b", "like the"),
    (r"\balwa\b", "always"),
    (r"\bt heir\b", "their"),
    (r"\babyrinth\b", "labyrinth"),
    (r"\bifyou\b", "if you"),
    (r"\battimes\b", "at times"),
    (r"\bl'd\b", "I'd"),
    (r"\bI['\u2019]m going to be your tour guide tod\b", "I'm going to be your tour guide today"),
]

BLEED_MARKERS = re.compile(
    r"Jane Fairbanks|Frank Pritchard|DIANA:\s*So, Tim|Jack, I['\u2019]?m thinking|"
    r"Easy Life Cleaning|Jacinta speaking|we come to Oniton|Good morning, and we come to",
    re.I,
)


def clean_raw(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"BS, HHSRERARRER[^\n]*\n?", "", text)
    text = re.sub(r"PIA?\s*\d+[^\n]*\n?", "", text)
    text = re.sub(r"Audioscripts\s*", "", text)
    text = re.sub(r"\|\s*", "I ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def polish_paragraph(text: str) -> str:
    for pattern, repl in OCR_FIXES:
        text = re.sub(pattern, repl, text, flags=re.I)
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+\d{2,3}\s*$", "", text)  # trailing page numbers
    return text


def is_garbage_paragraph(text: str) -> bool:
    if len(text) < 40:
        return True
    if BLEED_MARKERS.search(text) and len(text) < 500:
        return True
    # Shattered dialogue from PDF columns
    if text.count(":") >= 6 and re.search(r"[A-Z]{2,6}:\s*[A-Z]{2,6}:", text):
        return True
    if re.search(r"FRANK:.*JANE:.*FRANK:", text) and len(text) < 800:
        return True
    return False


def split_paragraphs(block: str) -> list[str]:
    block = re.sub(r"\bQ\d{1,2}\b", " ", block)
    lines = [ln.strip() for ln in block.split("\n")]
    paras: list[str] = []
    buf: list[str] = []
    for ln in lines:
        if not ln:
            if buf:
                paras.append(polish_paragraph(" ".join(buf)))
                buf = []
            continue
        if re.match(r"^PART\s+\d", ln, re.I):
            continue
        if re.match(r"^[A-Z]{1,3}:\s*$", ln):
            continue
        if len(ln) < 4 and ln.isupper():
            continue
        buf.append(ln)
    if buf:
        paras.append(polish_paragraph(" ".join(buf)))

    refined: list[str] = []
    for p in paras:
        if is_garbage_paragraph(p):
            continue
        if len(p) < 900:
            refined.append(p)
            continue
        parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])", p)
        chunk: list[str] = []
        length = 0
        for part in parts:
            if length + len(part) > 700 and chunk:
                merged = polish_paragraph(" ".join(chunk))
                if not is_garbage_paragraph(merged):
                    refined.append(merged)
                chunk = [part]
                length = len(part)
            else:
                chunk.append(part)
                length += len(part)
        if chunk:
            merged = polish_paragraph(" ".join(chunk))
            if not is_garbage_paragraph(merged):
                refined.append(merged)
    return [p for p in refined if len(p) > 35]


def main() -> None:
    reader = PdfReader(str(DEFAULT_PDF))
    pages = reader.pages[SCRIPT_PAGE_START : SCRIPT_PAGE_END + 1]
    full = clean_raw("\n".join((p.extract_text() or "") for p in pages))

    hits: list[tuple[int, int, int, str]] = []
    for section, test, title, pattern in SEGMENT_STARTS:
        m = re.search(pattern, full, re.I)
        if not m:
            raise SystemExit(f"Anchor not found: S{section} T{test} ({title}): {pattern}")
        hits.append((m.start(), section, test, title))
    hits.sort(key=lambda x: x[0])

    s2: dict[int, dict] = {}
    s4: dict[int, dict] = {}
    for i, (start, section, test, title) in enumerate(hits):
        if title.startswith("_"):
            continue
        end = hits[i + 1][0] if i + 1 < len(hits) else len(full)
        body = full[start:end]
        entry = {"test": test, "title": title, "scriptParagraphs": split_paragraphs(body)}
        if section == 2:
            s2[test] = entry
        elif section == 4:
            s4[test] = entry

    out = {
        "section2": [s2[i] for i in range(1, 5)],
        "section4": [s4[i] for i in range(1, 5)],
    }

    OUT_PATH.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    for sec in ("section2", "section4"):
        for t in out[sec]:
            print(f"  {sec} test {t['test']}: {len(t['scriptParagraphs'])} paragraphs")


if __name__ == "__main__":
    main()
