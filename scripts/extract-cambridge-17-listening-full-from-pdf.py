#!/usr/bin/env python3
"""Extract Cambridge 17 listening audioscripts (all 4 sections × 4 tests) + answer keys from the official PDF."""
from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader

DEFAULT_PDF = Path.home() / "Downloads" / "Cambridge 17_text.pdf"
SCRIPTS_OUT = Path(__file__).resolve().parent / "cambridge-17-listening-scripts.json"
KEYS_OUT = Path(__file__).resolve().parent / "cambridge-17-listening-answer-keys.json"

SCRIPT_PAGE_START = 88
SCRIPT_PAGE_END = 111

# Chronological order in audioscripts appendix: Test1 S1→S4, Test2 S1→S4, …
SEGMENT_STARTS = [
    (1, 1, "Buckworth Conservation Group", r"PETER:\s*Hello"),
    (2, 1, "Boat trip round Tasmania", r"My name['\u2019]?s Lou Miller"),
    (3, 1, "Work experience for veterinary science students", r"DIANA:\s*So, Tim"),
    (4, 1, "Labyrinths", r"Labyrinths have existed"),
    (1, 2, "Copying photos to digital format", r"Jane Fairbanks"),
    (2, 2, "Oniton Hall", r"Oniton Hall, one of the largest estates"),
    (3, 2, "Romeo and Juliet review", r"Did you make notes while you were watching the performances of Romeo"),
    (4, 2, "Impact of digital technology on the Icelandic language", r"Right, everyone, let['\u2019]?s make a start"),
    (1, 3, "Junior cycle camp", r"Jack, I['\u2019]?m thinking of taking the kids"),
    (2, 3, "Childcare Services", r"My name['\u2019]?s Mrs Carter"),
    (3, 3, "Holly's Work Placement Tutorial", r"HOLLY:\s*Hello Dr Green"),
    (4, 3, "Bird Migration Theory", r"Scientists believe that a majority of the earth['\u2019]?s bird population"),
    (1, 4, "Easy Life Cleaning Services", r"Easy Life Cleaning Services"),
    (2, 4, "Hotel Management", r"worked in the hotel industry"),
    (3, 4, "Sports science course", r"JEANNE:\s*Hi Thomas"),
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
    (r"\bl'm\b", "I'm"),
    (r"\|", "I"),
]

BLEED_MARKERS = re.compile(
    r"Jane Fairbanks|Frank Pritchard|DIANA:\s*So, Tim|Jack, I['\u2019]?m thinking|"
    r"Easy Life Cleaning|Jacinta speaking|we come to Oniton|Good morning, and we come to",
    re.I,
)


def clean_raw(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"BS, HHSRER[^\n]*\n?", "", text)
    text = re.sub(r"PIA?\s*\d+[^\n]*\n?", "", text)
    text = re.sub(r"Audioscripts\s*", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def polish_paragraph(text: str) -> str:
    for pattern, repl in OCR_FIXES:
        text = re.sub(pattern, repl, text, flags=re.I)
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+\d{2,3}\s*$", "", text)
    text = re.sub(r"\bQ\d{1,2}\b", " ", text)
    return text


def is_garbage_paragraph(text: str) -> bool:
    if len(text) < 40:
        return True
    if BLEED_MARKERS.search(text) and len(text) < 500:
        return True
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


def extract_scripts(full: str) -> dict:
    hits: list[tuple[int, int, int, str]] = []
    for section, test, title, pattern in SEGMENT_STARTS:
        m = re.search(pattern, full, re.I)
        if not m:
            raise SystemExit(f"Anchor not found: S{section} T{test} ({title}): {pattern}")
        hits.append((m.start(), section, test, title))
    hits.sort(key=lambda x: x[0])

    sections: dict[str, dict[int, dict]] = {
        "section1": {},
        "section2": {},
        "section3": {},
        "section4": {},
    }
    for i, (start, section, test, title) in enumerate(hits):
        end = hits[i + 1][0] if i + 1 < len(hits) else len(full)
        body = full[start:end]
        entry = {"test": test, "title": title, "scriptParagraphs": split_paragraphs(body)}
        sections[f"section{section}"][test] = entry

    return {
        key: [sections[key][i] for i in range(1, 5)]
        for key in ("section1", "section2", "section3", "section4")
    }


def parse_answer_keys(pdf: PdfReader) -> dict:
    """Parse listening answer keys from pages ~112–118."""
    text = "\n".join((p.extract_text() or "") for p in pdf.pages[110:119])
    text = clean_raw(text)

    tests: dict[int, dict[int, list[str]]] = {1: {}, 2: {}, 3: {}, 4: {}}
    current_test = 1

    part_blocks = re.split(r"Part\s+(\d+),\s*Questions\s+\d+[-–]\d+", text, flags=re.I)
    # part_blocks alternates: preamble, part_num, content, part_num, content...
    i = 1
    while i < len(part_blocks) - 1:
        part_num = int(part_blocks[i])
        content = part_blocks[i + 1]
        i += 2

        if re.search(r"TEST\s+2", content[:80], re.I):
            current_test = 2
            content = re.sub(r"TEST\s+2\s*", "", content, count=1, flags=re.I)
        elif re.search(r"TEST\s+3", content[:80], re.I):
            current_test = 3
            content = re.sub(r"TEST\s+3\s*", "", content, count=1, flags=re.I)
        elif re.search(r"TEST\s+4", content[:80], re.I):
            current_test = 4
            content = re.sub(r"TEST\s+4\s*", "", content, count=1, flags=re.I)

        answers = parse_part_answers(content, part_num)
        tests[current_test][part_num] = answers

    return {"tests": tests}


def parse_part_answers(content: str, part_num: int) -> list[str]:
    content = re.split(r"If you score", content, maxsplit=1, flags=re.I)[0]
    content = re.sub(r"Listening\s+Total|Marker|Signature", " ", content, flags=re.I)
    content = re.sub(r"IN EITHER ORDER", " ", content, flags=re.I)
    content = re.sub(r"[A-Z]{2,}\s+\d+\s+\d+", " ", content)
    content = re.sub(r"SCOON[^\n]*", " ", content)
    content = re.sub(r"puzzle|logic|Reading", " ", content)  # bleed from adjacent columns

    answers: list[str] = []

    if part_num == 1:
        # gap-fill word answers, one per line typically
        tokens = re.findall(
            r"(?<!\d)([A-Za-z][A-Za-z\s\-/'()]+\d*(?:\s*/\s*[A-Za-z0-9\s]+)?|[\d]+(?:\s*/\s*[\w\s]+)?)",
            content,
        )
        for tok in tokens:
            tok = tok.strip()
            if len(tok) < 2 or tok.lower() in ("listening", "part", "questions"):
                continue
            if re.match(r"^\d+$", tok) and int(tok) > 40:
                continue
            answers.append(re.sub(r"\s+", " ", tok))
            if len(answers) >= 10:
                break
        return answers[:10]

    # MC / matching: extract letter answers
    letter_runs = re.findall(r"\b([A-G])\b", content)
    if part_num == 2:
        # 10 answers: may include paired Q15&16
        return letter_runs[:10]

    if part_num == 3:
        return letter_runs[:10]

    if part_num == 4:
        word_answers = []
        for line in content.split("\n"):
            line = line.strip()
            if re.match(r"^[A-Za-z]", line) and len(line) < 40:
                word_answers.append(re.sub(r"\s+", " ", line))
        if len(word_answers) >= 8:
            return word_answers[:10]
        return letter_runs[:10]

    return answers


def main() -> None:
    reader = PdfReader(str(DEFAULT_PDF))
    pages = reader.pages[SCRIPT_PAGE_START : SCRIPT_PAGE_END + 1]
    full = clean_raw("\n".join((p.extract_text() or "") for p in pages))

    scripts = extract_scripts(full)
    SCRIPTS_OUT.write_text(json.dumps(scripts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {SCRIPTS_OUT}")
    for sec in ("section1", "section2", "section3", "section4"):
        for t in scripts[sec]:
            print(f"  {sec} test {t['test']}: {len(t['scriptParagraphs'])} paragraphs")

    keys = parse_answer_keys(reader)
    KEYS_OUT.write_text(json.dumps(keys, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {KEYS_OUT}")
    for test_num, parts in keys["tests"].items():
        for part_num, ans in parts.items():
            print(f"  Test {test_num} Part {part_num}: {len(ans)} answers -> {ans[:5]}...")


if __name__ == "__main__":
    main()
