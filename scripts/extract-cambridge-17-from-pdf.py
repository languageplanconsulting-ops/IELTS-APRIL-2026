#!/usr/bin/env python3
"""Extract Cambridge IELTS 17 Academic reading passages and questions from the official PDF."""
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
DEFAULT_PDF = Path.home() / "Downloads" / "Cambridge 17_text.pdf"
PASS_DIR = Path(__file__).resolve().parent / "cambridge-17-passages"
QUES_DIR = Path(__file__).resolve().parent / "cambridge-17-questions"

# 0-based inclusive page indices for question sections (from Cambridge 17 Academic PDF)
# 0-based page indices (exclusive end for passages = first question page)
QUESTION_PAGES: dict[str, list[int]] = {
    "t1p1": [10, 11],
    "t1p2": [14, 15],
    "t1p3": [18, 19],
    "t2p1": [31, 32],
    "t2p2": [35, 36],
    "t2p3": [39, 40, 41],
    "t3p1": [53, 54],
    "t3p2": [57, 58],
    "t3p3": [61, 62, 63, 64],
    "t4p1": [75, 76],
    "t4p2": [79, 80],
    "t4p3": [83, 84],
}

# 0-based page where passage body starts (title line)
PASSAGE_START_PAGE: dict[str, int] = {
    "t1p1": 8,
    "t1p2": 12,
    "t1p3": 16,
    "t2p1": 29,
    "t2p2": 33,
    "t2p3": 37,
    "t3p1": 51,
    "t3p2": 55,
    "t3p3": 59,
    "t4p1": 73,
    "t4p2": 77,
    "t4p3": 81,
}

NOISE_PATTERNS = [
    r"BS, HHSRERARRER\s*",
    r"BE, HHSRERDAADR\s*",
    r"BS, HSUBRORABSR\s*",
    r"BS, HSEBRORASR\s*",
    r"[‘'']?ila\s*\d+\s*\d*\s*",
    r"\b\d{1,2}\s*1718867188\b",
    r"O p\.\s*\d+",
    r"-\s*\d+\s*\|\s*p\.\s*\d+",
    r"»\s*\|\s*p\.\s*\d+",
    r"^\s*\d{1,2}\s*$",
    r"^Test\s+\d+\s*$",
    r"^\s*©\s*$",
    r"^\s*e\s*$",
    r"^\s*moou».*$",
    r"^W\s*$",
    r"^\s*p\.\s*\d+\s*$",
    r"^\s*-\s*\d+\s*$",
    r"ttt(he|his|the)",
    r"©\s*O\s*",
    r"^\s*e\s+The\s+",
]


def clean_text(text: str) -> str:
    t = text.replace("\r", "")
    t = re.sub(r"ttt(he|his|the)", r"\1", t, flags=re.IGNORECASE)
    for pat in NOISE_PATTERNS:
        if pat == r"ttt(he|his|the)":
            continue
        t = re.sub(pat, "", t, flags=re.MULTILINE | re.IGNORECASE)
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
        if re.match(r"^\*[^*]+\*$", line) or line.startswith("**"):
            if buffer:
                paragraphs.append(" ".join(buffer))
                buffer = []
            paragraphs.append(line)
            continue
        if buffer and (line[0].isupper() and buffer[-1].endswith(".")):
            paragraphs.append(" ".join(buffer))
            buffer = [line]
        else:
            buffer.append(line)
    if buffer:
        paragraphs.append(" ".join(buffer))
    return "\n\n".join(paragraphs)


def extract_passage(pages: list[str], key: str) -> tuple[str, str]:
    start = PASSAGE_START_PAGE[key]
    end = min(QUESTION_PAGES[key][0], len(pages))
    chunk = clean_text("\n".join(pages[start:end]))
    chunk = re.sub(
        r"READING PASSAGE\s+\d+\s*You should spend about 20 minutes[^\n]*\nPassage\s+\d+\s+below\.\s*",
        "",
        chunk,
        flags=re.I,
    )
    lines = [ln.strip() for ln in chunk.split("\n") if ln.strip()]
    title = lines[0] if lines else "Passage"
    body = join_paragraphs("\n".join(lines[1:]))
    return title, body


def extract_questions(pages: list[str], key: str) -> str:
    indices = QUESTION_PAGES[key]
    text = clean_text("\n".join(pages[i] for i in indices if i < len(pages)))
    text = re.sub(r"Questions\s+\d+-\d+,\s*which are based on Reading\s*\nPassage\s+\d+\s+below\..*", "", text, flags=re.I)
    start = re.search(r"Questions\s+\d", text, re.I)
    if start:
        text = text[start.start() :]
    text = re.sub(r"Listening and Reading answer keys.*", "", text, flags=re.I | re.S)
    text = text.replace("—", "-").replace("–", "-")
    text = re.sub(r"(\d)\s*ooo\.", r"\1 …", text)
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

    for key in QUESTION_PAGES:
        title, body = extract_passage(pages, key)
        (PASS_DIR / f"{key}.txt").write_text(f"{title}\n\n{body}\n", encoding="utf-8")
        questions = extract_questions(pages, key)
        (QUES_DIR / f"{key}.txt").write_text(questions + "\n", encoding="utf-8")
        print(f"Wrote {key}: {title[:55]}")

    print(f"Done — 12 passages from {pdf_path.name}")


if __name__ == "__main__":
    main()
