#!/usr/bin/env python3
"""
Combines every lesson attachment for the Writing course into one PDF, laid out
like a textbook: cover, table of contents, then each chapter/lesson's original
files inserted verbatim (PDF pages copied as-is, images placed full-page).

No content is re-typed, summarized, or altered — only cover/TOC/divider pages
are newly authored; every original page/image is inserted byte-for-byte.
"""
import json
import os
import fitz  # PyMuPDF

ROOT = "/Users/natchanon/IELTS SPEAKING"
DOCS_ROOT = os.path.join(ROOT, "public")
ORDER_JSON = "/tmp/textbook-order.json"
OUT_PATH = os.path.join(ROOT, "migration-notes", "IELTS-Writing-Coursebook.pdf")

THAI_FONT = "/System/Library/Fonts/Supplemental/Ayuthaya.ttf"
LATIN_BOLD_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

A4 = fitz.paper_rect("a4")
MARGIN = 48

with open(ORDER_JSON, "r", encoding="utf-8") as f:
    lessons = json.load(f)

# Group by chapter, preserving order of first appearance.
chapters = []
by_name = {}
for lesson in lessons:
    name = lesson["chapter"]
    if name not in by_name:
        by_name[name] = {"name": name, "lessons": []}
        chapters.append(by_name[name])
    by_name[name]["lessons"].append(lesson)


def new_page(doc):
    return doc.new_page(width=A4.width, height=A4.height)


def draw_text(page, point, text, fontsize, font=THAI_FONT, color=(0, 0, 0)):
    page.insert_font(fontfile=font, fontname="F")
    page.insert_text(point, text, fontsize=fontsize, fontname="F", fontfile=font, color=color)


def chapter_divider_page(doc, chapter_num, chapter_name):
    page = new_page(doc)
    page.draw_rect(fitz.Rect(0, 0, A4.width, A4.height), color=None, fill=(0.02, 0.09, 0.29))
    draw_text(page, (MARGIN, A4.height / 2 - 40), f"บทที่ {chapter_num}", 22, color=(0.85, 0.85, 1))
    draw_text(page, (MARGIN, A4.height / 2), chapter_name, 30, color=(1, 1, 1))
    return page


def lesson_divider_page(doc, chapter_name, lesson_title, file_count):
    page = new_page(doc)
    y = MARGIN + 20
    draw_text(page, (MARGIN, y), chapter_name, 11, color=(0.4, 0.4, 0.4))
    y += 34
    draw_text(page, (MARGIN, y), lesson_title, 20, color=(0.02, 0.09, 0.29))
    y += 26
    note = "เอกสารประกอบบทเรียนนี้" if file_count == 1 else f"เอกสารประกอบบทเรียนนี้ ({file_count} ไฟล์)"
    draw_text(page, (MARGIN, y), note, 11, color=(0.45, 0.45, 0.45))
    page.draw_line(fitz.Rect(MARGIN, y + 14, A4.width - MARGIN, y + 14).tl,
                    fitz.Rect(MARGIN, y + 14, A4.width - MARGIN, y + 14).tr,
                    color=(0.8, 0.8, 0.85), width=1)
    return page


def insert_image_page(doc, image_path):
    page = new_page(doc)
    pix = fitz.Pixmap(image_path)
    if pix.n - pix.alpha >= 4:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    img_w, img_h = pix.width, pix.height
    avail_w = A4.width - 2 * MARGIN
    avail_h = A4.height - 2 * MARGIN
    scale = min(avail_w / img_w, avail_h / img_h)
    draw_w, draw_h = img_w * scale, img_h * scale
    x0 = (A4.width - draw_w) / 2
    y0 = (A4.height - draw_h) / 2
    rect = fitz.Rect(x0, y0, x0 + draw_w, y0 + draw_h)
    page.insert_image(rect, filename=image_path)
    return page


def build_content(doc):
    """Returns list of {chapter, chapter_num, lesson_title, page (1-indexed, local)}."""
    toc_entries = []
    chapter_num = 0
    for chapter in chapters:
        chapter_num += 1
        chapter_page = chapter_divider_page(doc, chapter_num, chapter["name"])
        toc_entries.append({"type": "chapter", "text": chapter["name"], "page": chapter_page.number + 1})
        for lesson in chapter["lessons"]:
            files = lesson["files"]
            lesson_page = lesson_divider_page(doc, chapter["name"], lesson["title"], len(files))
            toc_entries.append({"type": "lesson", "text": lesson["title"], "page": lesson_page.number + 1})
            for file_info in files:
                rel_path = file_info["path"].lstrip("/")
                abs_path = os.path.join(DOCS_ROOT, rel_path)
                ext = os.path.splitext(abs_path)[1].lower()
                if ext == ".pdf":
                    src = fitz.open(abs_path)
                    doc.insert_pdf(src)
                    src.close()
                else:
                    insert_image_page(doc, abs_path)
    return toc_entries


def build_toc_pages(entries, front_offset):
    toc_doc = fitz.open()
    page = new_page(toc_doc)
    draw_text(page, (MARGIN, MARGIN + 10), "สารบัญ", 22, color=(0.02, 0.09, 0.29))
    y = MARGIN + 50
    line_h_chapter = 26
    line_h_lesson = 18
    bottom = A4.height - MARGIN
    for entry in entries:
        needed = line_h_chapter if entry["type"] == "chapter" else line_h_lesson
        if y + needed > bottom:
            page = new_page(toc_doc)
            y = MARGIN + 10
        page_num = entry["page"] + front_offset
        if entry["type"] == "chapter":
            draw_text(page, (MARGIN, y), entry["text"], 13, color=(0.02, 0.09, 0.29))
            draw_text(page, (A4.width - MARGIN - 30, y), str(page_num), 11, color=(0.3, 0.3, 0.3))
            y += line_h_chapter
        else:
            text = entry["text"]
            if len(text) > 78:
                text = text[:75] + "..."
            draw_text(page, (MARGIN + 22, y), text, 10.5, color=(0.15, 0.15, 0.15))
            draw_text(page, (A4.width - MARGIN - 30, y), str(page_num), 10, color=(0.4, 0.4, 0.4))
            y += line_h_lesson
    return toc_doc


def build_cover():
    doc = fitz.open()
    page = new_page(doc)
    page.draw_rect(fitz.Rect(0, 0, A4.width, A4.height), color=None, fill=(0.02, 0.09, 0.29))
    draw_text(page, (MARGIN, 90), "English Plan", 16, color=(0.7, 0.78, 1))
    draw_text(page, (MARGIN, 280), "IELTS Academic Writing", 30, color=(1, 1, 1))
    draw_text(page, (MARGIN, 320), "Coursebook", 30, color=(1, 1, 1))
    draw_text(page, (MARGIN, 380), "รวมเอกสารประกอบการเรียนทั้งหมด", 16, color=(0.8, 0.85, 1))
    draw_text(page, (MARGIN, 410), f"{len(lessons)} บทเรียน", 16, color=(0.8, 0.85, 1))
    return doc


def add_footers(doc, skip_pages):
    total = doc.page_count
    for i, page in enumerate(doc):
        if i in skip_pages:
            continue
        text = f"{i + 1} / {total}"
        draw_text(page, (A4.width - MARGIN - 40, A4.height - 28), text, 9, color=(0.5, 0.5, 0.5))


def main():
    content_doc = fitz.open()
    toc_entries = build_content(content_doc)
    print(f"Content pages: {content_doc.page_count}")

    cover_doc = build_cover()
    front_offset = 1  # cover
    toc_page_count = 2
    for _ in range(4):
        toc_doc = build_toc_pages(toc_entries, front_offset + toc_page_count)
        if toc_doc.page_count == toc_page_count:
            break
        toc_page_count = toc_doc.page_count
        toc_doc.close()
    print(f"TOC pages: {toc_doc.page_count}")

    final = fitz.open()
    final.insert_pdf(cover_doc)
    final.insert_pdf(toc_doc)
    final.insert_pdf(content_doc)

    skip = set(range(1 + toc_doc.page_count))  # cover + toc, no footer
    add_footers(final, skip)

    final.save(OUT_PATH, garbage=4, deflate=True)
    print(f"Saved: {OUT_PATH} ({final.page_count} pages, {os.path.getsize(OUT_PATH) / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
