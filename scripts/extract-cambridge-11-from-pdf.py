#!/usr/bin/env python3
"""Extract Cambridge IELTS 11 Academic reading passages and questions from the official PDF."""
from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("Install pypdf: python3 -m pip install pypdf", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PDF = Path.home() / "Documents/cambridge /Cambridge-Practice-Tests-for-IELTS-11.pdf"
PASS_DIR = Path(__file__).resolve().parent / "cambridge-11-passages"
QUES_DIR = Path(__file__).resolve().parent / "cambridge-11-questions"

# 0-based inclusive page indices
PASSAGE_PAGES: dict[str, tuple[int, int]] = {
    "t1p1": (18, 19),
    "t1p2": (21, 22),
    "t1p3": (25, 26),
    "t2p1": (41, 42),
    "t2p2": (46, 47),
    "t2p3": (49, 50),
    "t3p1": (65, 66),
    "t3p2": (69, 70),
    "t3p3": (73, 74),
    "t4p1": (87, 88),
    "t4p2": (91, 92),
    "t4p3": (97, 98),
}

QUESTION_PAGES: dict[str, list[int]] = {
    "t1p1": [20],
    "t1p2": [23, 24],
    "t1p3": [27, 28, 29],
    "t2p1": [43, 44],
    "t2p2": [45, 48],
    "t2p3": [51, 52, 53],
    "t3p1": [67, 68],
    "t3p2": [71, 72],
    "t3p3": [75, 76],
    "t4p1": [89, 90],
    "t4p2": [93, 94, 95],
    "t4p3": [96, 99],
}

PASSAGE_NUMBERS = {
    "t1p1": 1,
    "t1p2": 2,
    "t1p3": 3,
    "t2p1": 1,
    "t2p2": 2,
    "t2p3": 3,
    "t3p1": 1,
    "t3p2": 2,
    "t3p3": 3,
    "t4p1": 1,
    "t4p2": 2,
    "t4p3": 3,
}

NOISE_PATTERNS = [
    r"www\.irLanguage\.com[^\n]*",
    r"u�l>\.!I[^\n]*",
    r"0�1>\.!1[^\n]*",
    r"\.:,�l>\.!I[^\n]*",
    r"ffi irlanguagc[^\n]*",
    r"ti irLanguagc[^\n]*",
    r"\[R irLanguagc[^\n]*",
    r"u�IY-1[^\n]*",
    r"\.:,�l>\.!I[^\n]*",
    r"^\s*\d{1,2}\s*$",
    r"^Test\s*\d+\s*$",
    r"^Test\d+\s*",
    r"^Reading\s*$",
    r"^READING\s*$",
    r"^\s*p\.\s*\d+\s*$",
    r"^O p\.\s*\d+",
    r"^-\s*\d+\s*\|\s*p\.\s*\d+",
    r"^»\s*\|\s*p\.\s*\d+",
    r"^W\s*$",
    r"^©\s*$",
    r"^e\s*$",
    r"^['']?\s*$",
    r"^nr\s*$",
    r"^�[^\n]*$",
]


def fix_corrupted_question_ranges(text: str) -> str:
    t = text
    t = re.sub(r"Questions\s*&-(\d+)", r"Questions 5-\1", t)
    t = re.sub(r"Questions\s*[^\d\s]+(\d+)", r"Questions 5-\1", t)
    t = re.sub(r"\(Questions\s*[^\d\s]+(\d+)\)", r"(Questions 5-\1)", t)
    t = re.sub(r"boxes\s*[^\d\s]+(\d+)", r"boxes 5-\1", t)
    t = re.sub(r"boxes\s*(\d+)[^\d\s]+(\d+)", r"boxes \1-\2", t)
    t = re.sub(r"Questions\s*(\d+)--(\d+)", r"Questions \1-\2", t)
    t = re.sub(r"boxes\s*(\d+)--(\d+)", r"boxes \1-\2", t)
    t = re.sub(
        r"(Questions\s+(\d+)-(\d+)[\s\S]{0,400}?)In boxes 1-\3",
        r"\1In boxes \2-\3",
        t,
        flags=re.I,
    )
    return t


def clean_text(text: str) -> str:
    t = text.replace("\r", "")
    t = t.replace("co\"ect", "correct").replace("co\"ect", "correct")
    t = t.replace(""", "'").replace(""", "'").replace("–", "-").replace("—", "-")
    for pat in NOISE_PATTERNS:
        t = re.sub(pat, "", t, flags=re.MULTILINE | re.IGNORECASE)
    t = fix_corrupted_question_ranges(t)
    t = re.sub(r"(\d)\s*ooo\.", r"\1 …", t)
    t = re.sub(r"(\d)\s*\.{3,}", r"\1 …", t)
    t = re.sub(r"[ \t]+\n", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def join_paragraphs(body: str) -> str:
    lines = [ln.strip() for ln in body.split("\n") if ln.strip()]
    if not lines:
        return ""
    paragraphs: list[str] = []
    buffer: list[str] = []
    for line in lines:
        if re.match(r"^[A-H]$", line):
            if buffer:
                paragraphs.append(" ".join(buffer))
                buffer = []
            paragraphs.append(line)
            continue
        if re.match(r"^\*[^*]+\*$", line) or (line.startswith("'") and line.endswith("'")):
            if buffer:
                paragraphs.append(" ".join(buffer))
                buffer = []
            paragraphs.append(line.strip("'"))
            continue
        if re.match(r"^[A-H]\s+[A-Z'\"(]", line):
            if buffer:
                paragraphs.append(" ".join(buffer))
                buffer = []
            letter, rest = line[0], line[2:].strip()
            paragraphs.append(f"{letter}\n{rest}")
            continue
        buffer.append(line)
    if buffer:
        paragraphs.append(" ".join(buffer))
    return "\n\n".join(paragraphs)


def extract_passage(pages: list[str], key: str) -> tuple[str, str]:
    start, end = PASSAGE_PAGES[key]
    chunk = clean_text("\n".join(pages[start : end + 1]))
    chunk = re.sub(
        r"READING PASSAGE\s+\d+\s*You should spend about 20 minutes[^\n]*\nPassage\s+\d+\s+below\.?\s*",
        "",
        chunk,
        flags=re.I,
    )
    chunk = re.sub(r"READING PASSAGE\s+\d+\s*on the following pages\.?\s*", "", chunk, flags=re.I)
    lines = [ln.strip() for ln in chunk.split("\n") if ln.strip()]
    title = lines[0] if lines else "Passage"
    if title.startswith("'") and title.endswith("'"):
        title = title.strip("'")
    body = join_paragraphs("\n".join(lines[1:]))
    return title, body


def extract_questions(pages: list[str], key: str) -> str:
    indices = QUESTION_PAGES[key]
    text = clean_text("\n".join(pages[i] for i in indices if i < len(pages)))
    start = re.search(r"Questions\s+\d", text, re.I)
    if start:
        text = text[start.start() :]
    text = re.sub(r"Listening and Reading answer keys.*", "", text, flags=re.I | re.S)
    text = re.sub(r"WRITING\s+WRITING TASK.*", "", text, flags=re.I | re.S)
    return text.strip()


def main() -> None:
    pdf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PDF
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    reader = PdfReader(str(pdf_path))
    pages = [page.extract_text() or "" for page in reader.pages]

    PASS_DIR.mkdir(parents=True, exist_ok=True)
    QUES_DIR.mkdir(parents=True, exist_ok=True)

    for key in PASSAGE_PAGES:
        title, body = extract_passage(pages, key)
        (PASS_DIR / f"{key}.txt").write_text(f"{title}\n\n{body}\n", encoding="utf-8")
        questions = extract_questions(pages, key)
        (QUES_DIR / f"{key}.txt").write_text(questions + "\n", encoding="utf-8")
        print(f"Wrote {key}: {title[:60]} ({len(body)} chars body, {len(questions)} chars questions)")

    print(f"Done — 12 passages from {pdf_path.name}")


if __name__ == "__main__":
    main()
