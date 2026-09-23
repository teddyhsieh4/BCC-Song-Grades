# BCC Song Grades

Staff site for Berean Community Church song identification and lyrical grades.

Live site: https://teddyhsieh4.github.io/BCC-Song-Grades/

## What is here

- Catalog of 194 identified songs from setlists 2023 through Sept 2026
- Rubric page
- Insights page (family, era, most-logged titles)
- Song pages (identification now; grade reports as they are written)
- `AGENTS.md` for coding tools, `RUBRIC.md` for the grading standard
- `lib/grades.js` for shared labels and score rules
- `scripts/validate.js` and `scripts/build-insights.js` for catalog checks

This folder is a static site. No build step. GitHub Pages serves the `main` branch from the repository root.

Site files sit at that root (`index.html`, `style.css`, `gate.js`, `app.js`, `songs.json`, `insights.json`). Supporting files live under `lib/`, `scripts/`, `data/`, `docs/`, and `reports/`.

## Staff password

The shared password is stored only as a SHA-256 hash in `gate.js`. Ask Theodore for the password. Do not commit the plaintext password to this README.

The gate is a simple front door. It is not bank-grade security. Files next to the site can be fetched without the password.

## Updating the list

Replace `songs.json` identity fields from the live catalog spreadsheet. Do not let that export overwrite published scores or labels. Keep slugs stable when a title has not changed, so old song links still work.

After changing `songs.json`, run:

```
node scripts/validate.js songs.json
node scripts/build-insights.js
```

Then hard-refresh the live site.

When you change `style.css`, `gate.js`, `app.js`, `insights.js`, or `lib/grades.js`, bump the `?v=` query on every HTML page that loads that file.
