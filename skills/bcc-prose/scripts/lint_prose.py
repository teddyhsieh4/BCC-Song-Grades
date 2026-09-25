#!/usr/bin/env python3
"""Flag common AI-prose tells in a markdown file. Quoted lyric lines are skipped
when they sit in markdown emphasis or quote blocks. Exit 1 if any hit."""
from __future__ import annotations

import re
import sys
from pathlib import Path

EM = re.compile(r"—|--")
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
PHRASE_RE = [re.compile(p, re.I) for p in PHRASES]


def skip_line(line: str) -> bool:
    s = line.strip()
    if s.startswith(">"):
        return True
    if s.startswith("```"):
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
        if EM.search(line):
            hits.append((i, "em-dash or --", line.strip()))
        for rx in PHRASE_RE:
            if rx.search(line):
                hits.append((i, rx.pattern, line.strip()))
    if not hits:
        print(f"clean: {path}")
        return 0
    print(f"{len(hits)} hit(s) in {path}")
    for n, kind, snippet in hits:
        print(f"  L{n}  {kind}")
        print(f"       {snippet}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
