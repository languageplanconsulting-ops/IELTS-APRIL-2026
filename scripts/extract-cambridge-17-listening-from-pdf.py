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

# (section, test, title, start_pattern) — boundaries are the next segment's start in PDF order
SEGMENT_STARTS = [
    (2, 1, "Boat trip round Tasmania", r"My name['\u2019]?s Lou Miller"),
    (3, 1, "_part3_skip_", r"DIANA:\s*So, Tim"),  # boundary only
    (4, 1, "Labyrinths", r"Labyrinths have existed"),
    (2, 2, "Oniton Hall", r"Oniton Hall, one of the largest estates"),
    (4, 2, "Impact of digital technology on the Icelandic language", r"Right, everyone, let['\u2019]?s make a start"),
    (2, 3, "Childcare Services", r"My name['\u2019]?s Mrs Carter"),
    (4, 3, "Bird Migration Theory", r"Scientists believe that a majority of the earth['\u2019]?s bird population"),
    (2, 4, "Hotel Management", r"worked in the hotel industry"),
    (4, 4, "Maple syrup", r"maple syrup is a thick"),
]


def clean_raw(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"BS, HHSRERARRER[^\n]*\n?", "", text)
    text = re.sub(r"PIA?\s*\d+[^\n]*\n?", "", text)
    text = re.sub(r"Audioscripts\s*", "", text)
    text = re.sub(r"\|\s*", "I ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_paragraphs(block: str) -> list[str]:
    block = re.sub(r"\bQ\d{1,2}\b", " ", block)
    lines = [ln.strip() for ln in block.split("\n")]
    paras: list[str] = []
    buf: list[str] = []
    for ln in lines:
        if not ln:
            if buf:
                paras.append(" ".join(buf))
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
        paras.append(" ".join(buf))
    refined: list[str] = []
    for p in paras:
        if len(p) < 900:
            refined.append(p)
            continue
        parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])", p)
        chunk: list[str] = []
        length = 0
        for part in parts:
            if length + len(part) > 700 and chunk:
                refined.append(" ".join(chunk))
                chunk = [part]
                length = len(part)
            else:
                chunk.append(part)
                length += len(part)
        if chunk:
            refined.append(" ".join(chunk))
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
