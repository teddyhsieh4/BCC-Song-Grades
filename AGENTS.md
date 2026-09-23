# AGENTS.md

Read this file first. Then read `RUBRIC.md` before writing or scoring any song.

`CLAUDE.md` is one line pointing here. Other tools should do the same. Do not fork instructions into a second brief.

This repo is a password-gated static staff site for Berean Community Church (Irvine). It helps pastors and the musical worship team identify the songs the church actually sings and grade those lyrics for theological richness, gospel clarity, and congregational use. Musical analysis is out of scope.

## Who this is for

Berean Community Church (Irvine): a ~1000-person Southern Baptist congregation named from Acts 17:11. Preaching is expositional. The church holds the inerrancy and sufficiency of Scripture and reads it with a grammatical-historical hermeneutic. The first vision item is God-centered worship. Songs are chosen for doctrinal accuracy. The theological stream is close to The Master’s Seminary (lordship salvation, Doctrines of Grace, Word over private impression). Do not grade as if the room were seeker-friendly. “Not heretical” is the floor, not a 4. Binding standard: `RUBRIC.md`.

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
| `lib/grades.js` | Shared labels, score range, and status values |
| `songs.json` | Identified songs. Source of truth on the site for identity plus published grade pointers |
| `insights.json` | Generated summary counts. Do not hand-edit |
| `data/grade-history.json` | Append-only log of grade changes |
| `data/sample/` | Tiny fake catalog for local checks |
| `scripts/validate.js` | Fails on bad scores, labels, missing ids, duplicate CCLI |
| `scripts/build-insights.js` | Rebuilds `insights.json` from `songs.json` |
| `RUBRIC.md` | Binding grading standard for agents |
| `README.md` | Short human intro |

After you change CSS or JS, bump the `?v=` query on every HTML page that loads that file. GitHub Pages and browsers cache hard.

Relative URLs must work under `/BCC-Song-Grades/`. There is a `<base href="/BCC-Song-Grades/">` on the HTML pages. Keep it.

## Rules that are easy to break

- Published grades require the church chord sheet (or a confirmed published text of that same setting).
- The overall label must be one of the five official labels in `lib/grades.js` and `RUBRIC.md`.
- Never change a published grade without asking.
- Join reports, insights, and setlist history on song `id`, never on title. Titles collide.
- `insights.json` is generated from `songs.json`. Rebuild it. Do not type new counts by hand.
- Do not put a Google Sheet URL or a plaintext password in the repo, including “fallback defaults.”
- If your change makes any statement in README, AGENTS.md, or RUBRIC.md untrue, fix that statement in the same change.
- Do not store a lyrics dump in JSON.

## Field ownership

Identity fields come from the church Sheet plus the band chord sheets: title, writers, year written, arrangement year, CCLI, family, variants, setlist counts, years seen.

Grade fields come from the approved report: the five scores, overall label, lyric quotes, Scripture references, setlist notes, rubric version, grade date.

An export from the Sheet must not overwrite grade fields. A grade must not invent identity fields. Cover artist does not change song family. *Is He Worthy* (Peterson) stays distinct from *He Is Worthy* (Stiff / Zimmer, SGM, CCLI 7138112).

## Data rules

- Identification lives in `songs.json` (194 rows, High confidence as of Sept 2026).
- Give every song a permanent `id` that is not its title. Do not rename slugs once links exist.
- Repertoire membership can be `active`, `retired`, or `not-in-repertoire` on `repertoireStatus` when that field is present. Grade progress uses `status`: `not-graded` or `graded`. Do not delete a row to retire a song.
- When a grade is published, store `rubricVersion` and `gradeDate` (`YYYY-MM-DD`) on the song row. Log the change in `data/grade-history.json`.
- The church chord sheet is the authority for which text we grade. Web lyrics may inform a draft only when CCLI and setting are already confirmed.
- Do not put full copyrighted lyrics in the repo.
- Do not invent CCLI numbers.
- Hillsong, Elevation, and Bethel songs are never used. Do not add them.

Published grades: none yet. Song pages should say so until a report is approved.

When reports exist, prefer `reports/<slug>.md` (or `.html`) plus fields on the `songs.json` row (`status`, `recommendation`). Keep quotes short.

## Gate honesty

`gate.js` checks a SHA-256 hash in the browser. That only hides the screens. `songs.json` on GitHub Pages can be fetched without the password. The gate is a front door for casual visitors. It is not a vault. Do not describe it as stronger than that.

## Visual standard / design decisions

Current look (Sept 2026): navy header `#1b365d`, page `#f5f7fa`, church blue `#2e7ab8`, short gold rule, Source Sans 3. Left-aligned titles. Not cream paper, not burgundy italics (that copied another site and was rejected).

Overall labels will share one color each, defined once, with the label text always shown next to the color. Ask before changing any of this.

## Grading (summary)

Full text: `RUBRIC.md`.

Five scores, 1–5: Theological Accuracy (highest weight), Christ-Exalting and Gospel-Saturated, Objectivity, God’s Character, Congregational Usefulness.

5 dense and Scripture-shaped. 4 solid. 3 true but thin. 2 serious omission or mushy poetry. 1 error or disqualifying confusion.

Overall: Excellent / Prefer, Strong, Acceptable with notes, Weak, Avoid.

Calibration Weak: *How Great Is Our God* (Tomlin / Cash / Reeves, CCLI 4348399).

Known Prefer-lane examples: *Before the Throne*, *Yet Not I*, *In Christ Alone*, *Is He Worthy* (Peterson), many SGM / CityAlight / Getty texts.

## Prose

Write like a pastor-musician briefing a colleague.

Do not use em dashes. Do not stack “not this, but that.” Do not use stock AI cadence (“at its core,” “unpacks,” “rich tapestry,” and the rest listed in `RUBRIC.md`).

Quote a line, say what it does, name Scripture only when the link is real.

## Commits and pull requests

One logical change per commit. Short subject line.

Prefixes: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`, `test:`, plus `grade:` (new or changed grade), `rubric:` (rubric wording), `catalog:` (identity data).

A `grade:` commit should name the song, the old and new label, and why.

Pull request outline lives in `.github/pull_request_template.md`. Do not duplicate it here.

## Current phase

1. Identification of the existing list: done.
2. Written grades of high-use songs, from church charts: current work.
3. Diet view on Insights that includes grade mix: after some reports exist.
4. Any “paste a chart, draft a grade” helper: later, and only against this catalog.

New song discovery waits until the current list is graded.

## Not now

No named login, database, bundler, live AI grader, notifications, polling, or visual redesign until asked. Do not adopt Docker or a server host until there is server work.

## How to check data

```
node scripts/validate.js songs.json
node scripts/validate.js data/sample/songs.json
node scripts/build-insights.js
```

GitHub Actions runs the validator on pull requests.
