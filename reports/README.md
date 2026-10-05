# Grade reports

Published write-ups live here as `reports/<song-id>.md`. The filename is the song `id` from `songs.json`, not the title.

Use `TEMPLATE.md` for every new report. Same headings, in the same order. Add Alternative song suggestions only on a Weak or Avoid report, and omit that heading on every other label.

Do not commit full copyrighted lyrics. Quote only the lines the grade needs.

Drafts may sit here before `songs.json` is flipped to `graded`. The song page will load `reports/<id>.md` when that file exists and will mark it as a draft until Theodore gives an official yes and the catalog status is `graded`. A chord sheet is not part of that yes.

`reports/*.md` stays ignored so unpublished drafts are not committed by accident. Exceptions: `README.md`, `TEMPLATE.md`, published grades, and a report that is the worked example for a rubric change.

Current files on this branch:

- `TEMPLATE.md` (heading order for every new report)
- `king-forevermore-god-the-uncreated-one.md` (batch 1; published on `main`)
- `build-my-life.md` (draft Weak grade; worked example for Alternative song suggestions)
