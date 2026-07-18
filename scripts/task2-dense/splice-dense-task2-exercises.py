#!/usr/bin/env python3
"""Replace WGB2_EXERCISES entries in writingTask2Builder.ts with dense 50+70 drafts."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILDER = ROOT / "src" / "writingTask2Builder.ts"

REPLACEMENTS = [
    # (promptId, path to exercise object body starting with `{` ending before next exercise)
    ("t2-twe-1", ROOT / ".t2work" / "ex1.ts"),
    ("t2-twe-2", ROOT / ".t2work" / "ex2.ts"),
    ("t2-twe-7", ROOT / ".scratch_t2" / "out_e1.ts"),
    ("t2-twe-8", ROOT / ".scratch_t2" / "out_e2.ts"),
]


def find_exercise_span(src: str, prompt_id: str) -> tuple[int, int]:
    needle = f"promptId: '{prompt_id}'"
    pi = src.find(needle)
    if pi < 0:
        raise SystemExit(f"promptId not found: {prompt_id}")
    # walk back to opening `{` of this exercise object
    start = src.rfind("\n  {", 0, pi)
    if start < 0:
        start = src.rfind("{", 0, pi)
    else:
        start = start + 1  # land on `{`
    if start < 0:
        raise SystemExit(f"could not find exercise start for {prompt_id}")
    # walk forward with brace depth from start
    depth = 0
    i = start
    while i < len(src):
        c = src[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                # include trailing comma if present
                if end < len(src) and src[end] == ",":
                    end += 1
                return start, end
        i += 1
    raise SystemExit(f"unclosed exercise for {prompt_id}")


def normalize_exercise(raw: str) -> str:
    text = raw.strip()
    # scratch outs are indented with 2 spaces as array members already
    if text.startswith("{"):
        body = text
    else:
        # strip leading indent from first line variants
        body = text
    # ensure two-space indent for top-level object in WGB2_EXERCISES
    lines = body.splitlines()
    if lines and lines[0].startswith("{"):
        lines[0] = "  {" + lines[0][1:]
    elif lines and lines[0].lstrip().startswith("{"):
        # already maybe indented
        pass
    # If content was `{` at col0 with inner 2-space, bump all lines by 2 spaces
    # Detect: first line starts with `  {` or `{`
    if lines and lines[0].startswith("{"):
        lines = ["  " + ln if ln else ln for ln in lines]
    elif lines and lines[0].startswith("  {") and not lines[0].startswith("    {"):
        # check if inner content uses 2-space from `{` — ex1 uses id: at 2 spaces from `{`
        # production wants: `  {` then `    id:`
        # ex1 has: `{` then `  id:` — after prepending 2 spaces → `  {` then `    id:` ✓ if we prepend to all
        pass

    body = "\n".join(lines).rstrip()
    if not body.endswith(","):
        body += ","
    return body


def indent_exercise_file(path: Path) -> str:
    raw = path.read_text().strip()
    if raw.endswith(","):
        raw = raw.rstrip().rstrip(",")
    lines = raw.splitlines()
    while lines and not lines[0].lstrip().startswith("{"):
        lines.pop(0)
    if not lines:
        raise SystemExit(f"empty exercise in {path}")
    # Normalize so first line is `{` at column 0, then indent whole object by 2 spaces.
    base = len(lines[0]) - len(lines[0].lstrip(" "))
    dedented = [(ln[base:] if ln.startswith(" " * base) else ln) for ln in lines]
    body = "\n".join(("  " + ln if ln else ln) for ln in dedented).rstrip()
    if not body.endswith(","):
        body += ","
    return body


def main() -> None:
    src = BUILDER.read_text()
    items = []
    for prompt_id, path in REPLACEMENTS:
        start, end = find_exercise_span(src, prompt_id)
        items.append((start, end, prompt_id, path))
    items.sort(key=lambda x: x[0], reverse=True)

    for start, end, prompt_id, path in items:
        new_body = indent_exercise_file(path)
        print(f"Replacing {prompt_id} [{start}:{end}] with {path.name} ({len(new_body)} chars)")
        src = src[:start] + new_body + src[end:]

    BUILDER.write_text(src)
    print("Done. Wrote", BUILDER)


if __name__ == "__main__":
    main()
