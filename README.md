# BCC Song Grades

Staff site for Berean Community Church song identification and lyrical grades.

Live URL after Pages is enabled:

https://teddyhsieh4.github.io/BCC-Song-Grades/

## What is here

- Catalog of 194 identified songs from setlists 2023 through Sept 2026
- Rubric page
- Insights page (family, era, most-logged titles)
- Song pages (identification now; grade reports as they are written)

This folder is a static site. No build step. Enable GitHub Pages on the `main` branch, root folder.

## Staff password

The shared password is set in `js/gate.js` as a SHA-256 hash only. Ask Theodore for the password. Do not commit the plaintext password to this README.

The gate is a simple front door. It is not bank-grade security.

## Updating the list

Replace `data/songs.json` from the live catalog spreadsheet. Keep slugs stable when a title has not changed, so old song links still work.
