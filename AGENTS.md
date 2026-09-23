# AGENTS.md

Read this file first. Then read `RUBRIC.md` before writing or scoring any song.

This repo is a password-gated static staff site for Berean Community Church (Irvine). It helps pastors and the musical worship team identify the songs the church actually sings and grade those lyrics for theological richness, gospel clarity, and congregational use. Musical analysis is out of scope.

## Who this is for

A ~1000-person Southern Baptist church that aims to emulate the Bereans (Acts 17:11) and wants the word of Christ to dwell richly in sung worship (Col. 3:16). Do not grade as if the room were seeker-friendly. “Not heretical” is the floor, not a 4.

Owner: Theodore Hsieh (`teddyhsieh4`).
Repo: https://github.com/teddyhsieh4/BCC-Song-Grades
Live site: https://teddyhsieh4.github.io/BCC-Song-Grades/
Church public site (visual reference only): https://bereancc.com/

## Ask before you change these

Ask Theodore before you:

- Publish or change a song grade or recommendation
- Change colors, layout, fonts, or the password gate
- Add pages, a framework, or a build step
- Commit full lyrics or scrape lyrics for a batch of songs
- Point the site at a new data source
- Delete or rename slugs in `songs.json`

Safe without asking: fix a broken relative path, a 404, or an obvious typo in existing copy. Still describe the change in the commit message.

## What the site is

GitHub Pages, `main` branch, site root. No bundler. No framework.

| File | Role |
|---|---|
| `index.html` | Catalog (default page) |
| `rubric.html` | Human-readable rubric |
| `insights.html` | Family / era / most-logged charts |
| `song.html` | One song. Reads `?id=` from `songs.json` |
| `style.css` | Navy bulletin theme |
| `gate.js` | Client-side password. Hash only. Never commit the plaintext |
| `app.js` | Catalog search and song page |
| `insights.js` | Insights charts |
| `songs.json` | 194 identified songs. Source of truth *on the site* |
| `insights.json` | Summary counts for charts |
| `RUBRIC.md` | Binding grading standard for agents |
| `README.md` | Short human intro. Path notes there may be stale |

Ignore stray `download` files in the repo root. Do not add more of them.

After you change CSS or JS, bump the `?v=` query on every HTML page that loads that file. GitHub Pages and browsers cache hard.

Relative URLs must work under `/BCC-Song-Grades/`. There is a `<base href="/BCC-Song-Grades/">` on the HTML pages. Keep it.

## Visual standard

Current look (Sept 2026): navy header `#1b365d`, page `#f5f7fa`, church blue `#2e7ab8`, short gold rule, Source Sans 3. Left-aligned titles. Not cream paper, not burgundy italics (that copied another site and was rejected).

## Data rules

- Identification lives in `songs.json` (194 rows, High confidence as of Sept 2026).
- The church chord sheet is the authority for *which text* we grade. Web lyrics may inform a draft only when CCLI and setting are already confirmed.
- Do not put full copyrighted lyrics in the repo.
- Do not invent CCLI numbers.
- Cover artist does not change song family. *Is He Worthy* (Peterson) stays distinct from *He Is Worthy* (Stiff / Zimmer, SGM, CCLI 7138112).
- Hillsong, Elevation, and Bethel songs are never used. Do not add them.

Published grades: none yet. Song pages should say so until a report is approved.

When reports exist, prefer `reports/<slug>.md` (or `.html`) plus fields on the `songs.json` row (`status`, `recommendation`). Do not store a lyrics dump in JSON.

## Grading (summary)

Full text: `RUBRIC.md`.

Five scores, 1–5: Theological Accuracy (highest weight), Christ-Exalting and Gospel-Saturated, Objectivity, God’s Character, Congregational Usefulness.

5 dense and Scripture-shaped. 4 solid. 3 true but thin. 2 serious omission or mushy poetry. 1 error or disqualifying confusion.

Overall: Prefer, Strong, Acceptable with notes, Weak, Avoid.

Calibration Weak: *How Great Is Our God* (Tomlin / Cash / Reeves, CCLI 4348399).

Known Prefer-lane examples: *Before the Throne*, *Yet Not I*, *In Christ Alone*, *Is He Worthy* (Peterson), many SGM / CityAlight / Getty texts.

## Prose

Write like a pastor-musician briefing a colleague.

Do not use em dashes. Do not stack “not this, but that.” Do not use stock AI cadence (“at its core,” “unpacks,” “rich tapestry,” and the rest listed in `RUBRIC.md`).

Quote a line, say what it does, name Scripture only when the link is real.

## Current phase

1. Identification of the existing list: done.
2. Written grades of high-use songs, from church charts: current work.
3. Diet view on Insights that includes grade mix: after some reports exist.
4. Any “paste a chart, draft a grade” helper: later, and only against this catalog.

New song discovery waits until the current list is graded.
