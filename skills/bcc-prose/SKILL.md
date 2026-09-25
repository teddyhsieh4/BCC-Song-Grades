---
name: bcc-prose
description: Write and revise BCC Song Grades prose so it sounds like a pastor-musician briefing a colleague, not like generated content. Use when drafting or editing grade reports, catalog notes, site copy, AGENTS.md text, or any project reply. Also trigger on humanize this, remove AI slop, sounds like AI, de-AI, rewrite naturally, prose lint, or em dash cleanup. Do not add personality, soul, or fake lived experience. Do not flatten theological vocabulary. Keep report headings from reports/TEMPLATE.md.
metadata:
  version: "1.0"
  project: BCC-Song-Grades
---

# BCC Prose

Write like a careful pastor-musician briefing a colleague. Theology and facts first. Cadence second.

This skill is a guardrail while drafting and a revision pass on finished text. It does not replace `RUBRIC.md` or `reports/TEMPLATE.md`. Scores, labels, and heading order stay as those files define them.

Read `references/patterns.md` before a revision pass. Read `references/report-voice.md` before writing or editing a grade report.

## When this applies

- Any song grade report (`reports/<slug>.md`)
- Catalog notes, setlist diet comments, site blurbs
- Project replies that will be read by Theodore or the worship team
- A user request to humanize, de-slop, or lint prose

## When this does not apply

- Code, JSON, CSV, HTML structure, CCLI numbers, slugs
- Quoted lyrics (leave the song’s punctuation, including any em dash in the source lyric)
- Rubric category names and official labels (Excellent / Prefer, Strong, Acceptable with notes, Weak, Avoid)

## Workflow

1. Draft for meaning. Get the argument, quotes, scores, and identification right before hunting cadence.
2. Scan against `references/patterns.md`. Mark hits. Do not invent new bans mid-pass.
3. Rewrite sentence by sentence. Keep meaning, names, numbers, CCLI, years, Scripture references, and the author’s judgment.
4. Read the page aloud in your head. If a sentence sounds like a slogan or a product blurb, rewrite it as a claim with evidence.
5. Deliver clean text. Do not describe this process in the prose.

If the user only asked for a lint, report hits with line context and a suggested fix. Do not rewrite the whole file unless they asked.

Optional check: `python scripts/lint_prose.py <file.md>`

## House voice (positive)

- Ordinary paragraphs after rehearsal. Mix sentence length. A short sentence can land a point. Do not make three-word telegrams the default.
- Quote the lyric, say what the line does or fails to do, then name Scripture only when the link is real in the ordinary sense of the text.
- Use church words: sin, cross, substitution, resurrection, congregation, thin, vague, useful, weak.
- Let the grade rest on evidence.
- Years seen are a snapshot. Say “at least X years.”
- Other catalog titles appear only as setlist pairings when this text leaves a gap. Do not use other songs as foils.
- Do not add “not Hillsong / Elevation / Bethel” on a clean song.

## Hard bans

- Em dashes (`—` or `--` used as a dash). Use a period, comma, colon, parentheses, or a new sentence. Exception: a quoted lyric that already contains one.
- Negative parallelism as a tic: “not X, but Y,” “this, not that,” “less a hammer, more a scalpel.” State the claim once.
- Stock cadence listed in `references/patterns.md` (delve, tapestry, unpacks, leans into, at its core, it’s important to note, stands as a testament, and the rest of that list).
- Inflated adjectives that add no theological point.
- Parallel slogan pairs written for punch.
- Fake first-person color: “I remember when we sang this,” “the room always goes quiet.” If a fact is not in the catalog or the user’s note, omit it.
- ASD-STE100 as a standing voice. Do not shrink substitution, mediation, inerrancy, lament, or “whosoever” to aircraft-manual English.

## Report structure (do not “humanize” away)

Keep the heading order in `reports/TEMPLATE.md`:

Thesis; overall recommendation; scores; voice and addressee; how the text moves; lines you cannot cut; gospel inventory; Trinity; other-worshiper test; unbiblical / non-biblical / thin; five categories; tone; what the congregation never says; setlist and diet; identification; why this label.

Heading text is “Lines you cannot cut,” not “load-bearing.”

Leave a heading in place even when the note is short.

## Priority when rules collide

1. Accuracy (lyric, writers, CCLI, theology)
2. Clarity
3. Specificity
4. Human cadence
5. Style polish

Do not follow a style rule so tightly that the sentence becomes awkward or the doctrine gets vague.

## Output

Return the revised prose only, unless the user asked for a diagnosis. If you cut a claim because it had no source, say so in one line outside the report body.
