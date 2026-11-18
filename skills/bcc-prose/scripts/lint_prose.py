#!/usr/bin/env python3
"""Flag common AI-prose tells in a markdown file. Exit 1 if any hit.

Skipped on purpose:
- Markdown structure: `---` dividers and `|---|---|` table separator rows.
- Blockquotes (`>`) and fenced code blocks.
- Quoted lyrics inside curly quotes (“...”), so a lyric's own em dash or
  wording is never flagged.

A hit is a candidate, not a verdict. Read the sentence before changing it.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

# A line made only of dashes, pipes, colons and spaces is markdown structure
# (a section divider or a table separator row), not prose.
STRUCTURE = re.compile(r"^[\s|:\-]+$")

# Curly-quoted spans are lyric or source quotations. Remove them before checking.
QUOTED = re.compile(r"“[^”]*”")

EM = re.compile(r"—|--")

# Stock cadence from skills/bcc-prose/references/patterns.md.
PHRASES = [
    r"\bat its core\b",
    r"\bit'?s important to note\b",
    r"\bit'?s worth noting\b",
    r"\bin a world where\b",
    r"\blet'?s dive in\b",
    r"\bhere'?s the thing\b",
    r"\bat the end of the day\b",
    r"\bin short,",
    r"\bstands as a testament\b",
    r"\brich tapestry\b",
    r"\bnothing short of\b",
    r"\bleans into\b",
    r"\bspeaks into\b",
    r"\bholds space\b",
    r"\bsits with\b",
    r"\bunpacks\b",
    r"\bdelve\b",
    r"\bdeeply resonant\b",
    r"\brobust yet accessible\b",
    r"\bit'?s not .+, it'?s ",
    r"\bnot .+, but ",
    r"\bless a .+, more a ",
    r"\bload-bearing\b",
]

# Contrast with the "not" second: "X, not Y." at the end of a sentence,
# or "is not X. It is Y."
CONTRAST = [
    (r", not [^.,;]{2,60}\.", "X, not Y ending"),
    (r"\bis not [^.]{2,60}\. It is\b", "is not X. It is Y"),
]

# Stock sentences found repeated across many reports (Prose Tics Fix List, A1).
# Fine once in a while. A problem when every report says them.
STOCK = [
    (r"\bask the room to confer\b", "stock sentence"),
    (r"\bthe (language|diction) is plain\b", "stock sentence"),
    (r"\bsingability is high\b", "stock sentence"),
    (r"\bthe intensity stays inside\b", "stock sentence"),
    (r"\bthe attributes are specific and\b", "stock sentence"),
    (r"\bstay inside ordinary biblical sense\b", "stock sentence"),
    (r"\bthe congregation can learn the\b", "stock sentence"),
    (r"\bdense, precise, and scripture-shaped\b", "stock sentence"),
    (r"\bthat is why it is\b", "stock sentence"),
    (r"\bdoes not stop at titles\b", "stock sentence"),
    (r"\bthose are small gaps\b|\bthat is a small gap\b", "stock sentence"),
    (r"\bhigh-claim\b", "coined term"),
    (r"\bconfessional and shareable\b", "stock sentence"),
    (r"\bnone that affect the claim\b", "stock sentence"),
    (r"\binner weather\b", "metaphor for the grade"),
    (r"\b(true|poetic) and underfed\b", "metaphor for the grade"),
    (r"\bsink the song\b", "metaphor for the grade"),
    (r"\batmosphere\b", "banned grade word"),
    (r"\bflattens?\b", "metaphor for the grade"),
]

PHRASE_RE = [(re.compile(p, re.I), p) for p in PHRASES]
CONTRAST_RE = [(re.compile(p, re.I), label) for p, label in CONTRAST]
STOCK_RE = [(re.compile(p, re.I), label) for p, label in STOCK]


def skip_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    if STRUCTURE.match(s):
        return True
    if s.startswith(">"):
        return True
    return False


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: lint_prose.py <file.md>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    text = path.read_text(encoding="utf-8")
    hits = []
    in_fence = False
    for i, line in enumerate(text.splitlines(), 1):
        if line.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence or skip_line(line):
            continue
        prose = QUOTED.sub("“”", line)
        if EM.search(prose):
            hits.append((i, "em-dash or --", line.strip()))
        for rx, label in PHRASE_RE:
            if rx.search(prose):
                hits.append((i, label, line.strip()))
        for rx, label in CONTRAST_RE + STOCK_RE:
            m = rx.search(prose)
            if m:
                hits.append((i, f"{label}: {m.group(0)}", line.strip()))
    if not hits:
        print(f"clean: {path}")
        return 0
    print(f"{len(hits)} hit(s) in {path}")
    for n, kind, snippet in hits:
        print(f"  L{n}  {kind}")
        print(f"       {snippet[:160]}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
