#!/usr/bin/env python3
"""Extract Cambridge IELTS 16 Academic reading passages and questions from a scanned PDF via OCR."""
from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import fitz
except ImportError:
    print("Install pymupdf: python3 -m pip install pymupdf", file=sys.stderr)
    sys.exit(1)

DEFAULT_PDF = Path.home() / "Documents/cambridge /IELTS-16-Academic-Students-Book-with-Answers-Cambridge.pdf"
PASS_DIR = Path(__file__).resolve().parent / "cambridge-16-passages"
QUES_DIR = Path(__file__).resolve().parent / "cambridge-16-questions"
CACHE_DIR = Path(__file__).resolve().parent / "cambridge-16-ocr-cache"

# 0-based inclusive page indices (IELTS-16-Academic-Students-Book-with-Answers-Cambridge.pdf)
PASSAGE_PAGES: dict[str, tuple[int, int]] = {
    "t1p1": (15, 16),
    "t1p2": (20, 21),
    "t1p3": (23, 24),
    "t2p1": (37, 38),
    "t2p2": (41, 42),
    "t2p3": (46, 47),
    "t3p1": (60, 61),
    "t3p2": (64, 65),
    "t3p3": (68, 69),
    "t4p1": (81, 82),
    "t4p2": (85, 86),
    "t4p3": (90, 91),
}

QUESTION_PAGES: dict[str, list[int]] = {
    "t1p1": [17, 18],
    "t1p2": [19, 22],
    "t1p3": [25, 26, 27],
    "t2p1": [39, 40],
    "t2p2": [43, 44, 45],
    "t2p3": [48, 49, 50],
    "t3p1": [62, 63],
    "t3p2": [66, 67],
    "t3p3": [70, 71],
    "t4p1": [83, 84],
    "t4p2": [87, 88],
    "t4p3": [89, 92, 93],
}

TITLE_OVERRIDES: dict[str, str] = {
    "t1p1": "Why we need to protect polar bears",
    "t1p2": "The Step Pyramid of Djoser",
    "t1p3": "The future of work",
    "t2p1": "The White Horse of Uffington",
    "t2p2": "I contain multitudes",
    "t2p3": "How to make wise decisions",
    "t3p1": "Roman shipbuilding and navigation",
    "t3p2": "Climate change reveals ancient artefacts in Norway's glaciers",
    "t3p3": "Plant 'thermometer' triggers springtime growth by measuring night-time heat",
    "t4p1": "Roman tunnels",
    "t4p2": "Changes in reading habits",
    "t4p3": "Attitudes towards Artificial Intelligence",
}

NOISE_PATTERNS = [
    r"laokaoya\.com[^\n]*",
    r"facebook[^\n]*",
    r"yeu?ielts[^\n]*",
    r"hotline[^\n]*",
    r"zalo[^\n]*",
    r"0899\.293\.571[^\n]*",
    r"BO\s*DE\s*THI[^\n]*",
    r"LISTENING\+READING[^\n]*",
    r"BODU[^\n]*",
    r"KIY/NANG[^\n]*",
    r"^\(\w?\)\s*[^\n]*$",
    r"^\(\w\)\s+\w+\s*$",
    r"^we\)\s+www\.[^\n]*$",
    r"^eee\s+www\.[^\n]*$",
    r"^[|=\s._#€£¥@\-—~>]+(?:HH+|sk+|ms+|es)[|=\s._#€£¥@\-—~>]*$",
    r"^[|=\s._#€£¥@\-—~]{8,}$",
    r"^\s*\d{1,2}\s*,?\s*fe?\s*[^\n]*$",
    r"^\s*\d{1,2}\s*$",
    r"^Test\s*\d+\s*$",
    r"^Reading\s*$",
    r"^READING\s*$",
    r"^WRITING\s*$",
    r"^©\s*$",
    r"^e\s*$",
    r"^['']?\s*$",
    r"^\d+\s*\|\s*p\.\s*\d+\s*$",
]


def fix_ocr_errors(text: str) -> str:
    t = text
    t = re.sub(r"^:\s*(Questions\b)", r"\1", t, flags=re.MULTILINE)
    t = re.sub(r"Reading Passage\s+17\b", "Reading Passage 1", t, flags=re.I)
    t = re.sub(r"Reading Passage\s+37\b", "Reading Passage 3", t, flags=re.I)
    t = re.sub(r"\bPassage\s+17\b", "Passage 1", t, flags=re.I)
    t = re.sub(r"\bPassage\s+37\b", "Passage 3", t, flags=re.I)
    t = re.sub(r"\b1s\b", "is", t)
    t = re.sub(r"\btn\b", "in", t)
    t = re.sub(r"\btmpact\b", "impact", t, flags=re.I)
    t = re.sub(r"Questions\s+27\s+and\s+22", "Questions 21 and 22", t, flags=re.I)
    t = re.sub(r"^:\s+", "", t, flags=re.MULTILINE)
    t = re.sub(r"paragraphs,\s*AI\b", "paragraphs, A-I", t, flags=re.I)
    t = re.sub(r"\bsheel\b", "sheet", t, flags=re.I)
    t = re.sub(r"\bi-1x\b", "i-ix", t, flags=re.I)
    t = re.sub(r"\bili\b", "iii", t)
    t = re.sub(r"Wrte\b", "Write", t, flags=re.I)
    t = re.sub(r"wnte\b", "write", t, flags=re.I)
    t = re.sub(r"sneet\b", "sheet", t, flags=re.I)
    t = re.sub(r"GUE tO", "due to", t, flags=re.I)
    t = re.sub(r"areason\b", "a reason", t, flags=re.I)
    t = re.sub(r"anexample\b", "an example", t, flags=re.I)
    t = re.sub(r"asuggestion\b", "a suggestion", t, flags=re.I)
    t = re.sub(r"\bAl\b", "AI", t)
    t = re.sub(r"^([A-J])__\s+", r"\1\n", t, flags=re.MULTILINE)
    t = re.sub(r"\bv_\s", "v ", t)
    t = re.sub(r"\biii_\s", "iii ", t)
    return t


def fix_corrupted_question_ranges(text: str) -> str:
    t = text
    t = re.sub(r"Questions\s*&-(\d+)", r"Questions 5-\1", t)
    t = re.sub(r"Questions\s*(\d+)[—–](\d+)", r"Questions \1-\2", t)
    t = re.sub(r"boxes\s*(\d+)[—–](\d+)", r"boxes \1-\2", t)
    t = re.sub(r"Questions\s*(\d+)--(\d+)", r"Questions \1-\2", t)
    t = re.sub(r"boxes\s*(\d+)--(\d+)", r"boxes \1-\2", t)
    return t


def clean_text(text: str) -> str:
    t = text.replace("\r", "")
    t = t.replace(""", "'").replace(""", "'").replace("–", "-").replace("—", "-")
    t = re.sub(r"^\|\s*", "", t, flags=re.MULTILINE)
    for pat in NOISE_PATTERNS:
        t = re.sub(pat, "", t, flags=re.MULTILINE | re.IGNORECASE)
    t = fix_corrupted_question_ranges(t)
    t = fix_ocr_errors(t)
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
        line = re.sub(r"^\|\s*", "", line)
        if re.match(r"^[A-J]$", line):
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
        if re.match(r"^[A-J]\s+[A-Z'\"(]", line):
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


def ocr_page(doc: fitz.Document, page_idx: int, scale: float = 2.0) -> str:
    cache_path = CACHE_DIR / f"page-{page_idx + 1:03d}.txt"
    if cache_path.exists():
        return cache_path.read_text(encoding="utf-8")

    page = doc[page_idx]
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale))
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(pix.tobytes("png"))
        img_path = tmp.name

    try:
        out = subprocess.check_output(
            ["tesseract", img_path, "stdout", "-l", "eng", "--psm", "6"],
            stderr=subprocess.DEVNULL,
        )
        text = out.decode("utf-8", "replace")
    finally:
        Path(img_path).unlink(missing_ok=True)

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(text, encoding="utf-8")
    return text


def page_text(doc: fitz.Document, page_idx: int) -> str:
    native = doc[page_idx].get_text()
    if len(native.strip()) > 80:
        return native
    return ocr_page(doc, page_idx)


def load_pages(doc: fitz.Document) -> list[str]:
    needed = sorted(
        {
            idx
            for start, end in PASSAGE_PAGES.values()
            for idx in range(start, end + 1)
        }
        | {idx for pages in QUESTION_PAGES.values() for idx in pages}
    )
    pages = [""] * doc.page_count
    for idx in needed:
        if idx >= doc.page_count:
            continue
        print(f"Extract page {idx + 1}/{doc.page_count}...", flush=True)
        pages[idx] = page_text(doc, idx)
    return pages


def is_noise_line(line: str) -> bool:
    if not line or len(line.strip()) < 2:
        return True
    if re.match(r"^Passage\s+\d+\s+below\.?$", line.strip(), re.I):
        return True
    if re.match(r"^(Ed|E[ji]|ri|Fd|Fj|SAGE|=|\.)$", line.strip(), re.I):
        return True
    if re.search(r"_{5,}|HHH{3,}|BOIDU|BODEM|LISTENING|laokaoya|KIY/NANG", line, re.I):
        return True
    if re.match(r"^[|=\s._#€£¥@\-—~>]{6,}$", line):
        return True
    if re.match(r"^\w{1,4}[,.]?\s*$", line):
        return True
    return False


def find_title_and_body_lines(lines: list[str]) -> tuple[str, list[str]]:
    merged = " ".join(lines)
    caps = re.search(
        r"\b([A-Z][A-Z'\u2019\s\-]{12,})\b(?=\s+[A-Z][a-z])",
        merged,
    )
    if caps:
        title = re.sub(r"\s+", " ", caps.group(1)).strip()
        rest = merged[caps.end() :].strip()
        body_lines = [rest] if rest else []
        return title, body_lines

    for idx, line in enumerate(lines):
        if is_noise_line(line):
            continue
        if len(line) >= 12 and not re.match(r"^READING\b", line, re.I):
            return line, lines[idx + 1 :]
    return "Passage", lines


def extract_passage(pages: list[str], key: str) -> tuple[str, str]:
    forced_title = TITLE_OVERRIDES.get(key)

    start, end = PASSAGE_PAGES[key]
    chunk = clean_text("\n".join(pages[start : end + 1]))
    chunk = re.sub(
        r"READING PASSAGE\s+\d+\s*You should spend about 20 minutes[^\n]*\nPassage\s+\d+\s+below\.?\s*",
        "",
        chunk,
        flags=re.I,
    )
    chunk = re.sub(
        r"READING PASSAGE\s+\d+\s*You should spend about 20 minutes[^\n]*",
        "",
        chunk,
        flags=re.I,
    )
    chunk = re.sub(r"READING PASSAGE\s+\d+\s*on the following pages\.?\s*", "", chunk, flags=re.I)
    chunk = re.sub(r"Passage\s+\d+\s+below\.?\s*", "", chunk, flags=re.I)
    chunk = re.sub(r"Questions\s+\d+-\d+.*", "", chunk, flags=re.I)
    lines = [ln.strip() for ln in chunk.split("\n") if ln.strip() and not is_noise_line(ln.strip())]
    if forced_title:
        title = forced_title
        body_lines = lines
        if body_lines and body_lines[0].lower().startswith(forced_title.lower()[:20]):
            body_lines = body_lines[1:]
    else:
        title, body_lines = find_title_and_body_lines(lines)
    body = join_paragraphs("\n".join(body_lines))
    body = re.sub(r"\s+laokaoya[^\n]*", "", body, flags=re.I)
    body = re.sub(r"\s+BO\s*DE[^\n]*", "", body, flags=re.I)
    return title, body


def extract_questions(pages: list[str], key: str) -> str:
    indices = QUESTION_PAGES[key]
    text = clean_text("\n".join(pages[i] for i in indices if i < len(pages)))
    text = re.sub(
        r"READING PASSAGE\s+\d+\s*You should spend about 20 minutes[\s\S]*?Passage\s+\d+[^\n]*\n",
        "",
        text,
        flags=re.I,
    )
    text = re.sub(
        r"Questions\s+\d+-\d+,\s*which are based on Reading Passage[^\n]*\n",
        "",
        text,
        flags=re.I,
    )
    matches = list(re.finditer(r"Questions\s+\d", text, re.I))
    if matches:
        text = text[matches[0].start() :]
    text = re.sub(r"Listening and Reading answer keys.*", "", text, flags=re.I | re.S)
    text = re.sub(r"WRITING\s+WRITING TASK.*", "", text, flags=re.I | re.S)
    return text.strip()


def main() -> None:
    pdf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PDF
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    doc = fitz.open(str(pdf_path))
    pages = load_pages(doc)
    doc.close()

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
