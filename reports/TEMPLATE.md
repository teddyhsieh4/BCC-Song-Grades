# Report template

Copy this into `reports/<song-id>.md`. The filename is the slug from `songs.json`. Quote only the lines the grade needs. Do not paste the full lyric.

Calibrate scores privately against `RUBRIC.md`. Do not use other songs as foils in the write-up. Other catalog titles may appear only as setlist pairings when this text leaves a gap the service still has to cover.

Leave a heading in place even when the note is short. A busy leader should be able to skim the same spots every time.

Write the body in ordinary paragraphs. Do not fill headings with three-word label sentences. Say what the lyric claims, what it leaves out, and why that matters for this church. Do not explain the grade with an unusual metaphor. “Doctrinal spine,” “the engine of the song,” “atmosphere,” “the lyric never gets there,” and “what caps the label” are critic talk. Quote the line, then say the plain claim. A metaphor that is already in the lyric, or in the Scripture text you are citing, may stay inside the quotation.

Write each report for its own song:

- The notes under each heading below are questions to answer about this song. Do not copy their wording into the report as a finished sentence.
- Do not reuse a sentence from another report. If a sentence would be true of most songs in the catalog, it is not telling the leader anything. Say what is true of this lyric, or leave the sentence out.
- Name the song’s main doctrines once, in the Thesis and the gospel inventory. Later sections add what is new for that heading. Do not repeat the full list under every heading.
- Start each section with a full sentence. Do not open with a one-word answer such as “Reverent.” or “No.” or “One song.”
- Run `python3 skills/bcc-prose/scripts/lint_prose.py reports/<song-id>.md` before the report goes up. Read each hit and decide whether it needs a change.

Do not put a Status line in the report. A grade is published when the report file is on the site and the catalog row is `graded`. If it is not published, the song page does not show a report. The write-up itself does not announce that.

---

# Official title (as in the catalog)

**Source:** published text of the catalog setting (title, writers, CCLI). Note the date the text was read.

- **Slug:**
- **Catalog ID:**
- **Writers:**
- **Year written:**
- **Arrangement year:** (or “not on file”)
- **Family:**
- **Era:**
- **CCLI:** official SongSelect number. If an older catalog row differs, note that under Identification, not as a second CCLI line here.
- **Times logged (2023–Sept 2026):**
- **Years seen:** this window is a snapshot, not all-time use. In prose say “at least X years.”
- **Setlist variants:**
- **Publishers / association:** name the publisher and, if needed, the ministry family. Only mention Hillsong, Elevation, or Bethel when one of them is actually in the credits (automatic Avoid). Do not add a “not Hillsong / Elevation / Bethel” sentence on clean songs.

---

## Thesis

One or two sentences. What argument does this lyric make? This is the place to name its main doctrines.

---

## Overall recommendation

One of: Excellent / Prefer · Strong · Acceptable with notes · Weak · Avoid

Then 3–6 sentences a leader can act on: use it how often, which stanza must stay, and the main reason for the label. Say that reason in ordinary words. Do not write “what caps the label” or “the line that sets the cap.” When you mention how often the church sings it, give this song’s log count and years.

---

## Alternative song suggestions

Include this heading only when the overall label is Weak or Avoid. Omit it on every other label. Do not leave an empty heading.

Three or four songs that cover the theme this lyric is reaching for. Mix titles the church has already logged with titles that are not in the catalog, so a Weak or Avoid song can also be a door for a better text the congregation has not sung. New titles still have to come from usable families: hymn, modern hymn, Getty, CityAlight, Sovereign Grace, and other writers who are not Hillsong, Elevation, or Bethel. Do not suggest a banned-ministry title because the theme matches. Mark each suggestion as already sung or not yet logged.

For each suggestion: title, writers, family, and the CCLI already on the catalog row. Then one or two sentences on the doctrine or text it actually sings. A hymn may be the right pick. Do not say that hymns outrank other usable families.

This is the one place other titles may be named as replacements. The rest of the report still does not use them as foils.

---

## Scores

| Category | Score |
|---|---|
| Theological Accuracy and Biblical Fidelity | |
| Christ-Exalting and Gospel-Saturated | |
| Objectivity vs. Subjectivity | |
| Description of God’s Character | |
| Congregational Usefulness and Clarity | |

Rubric version v1. Grade date YYYY-MM-DD.

The meaning of each score is on the Rubric page. Do not paste the score key into the report.

---

## Voice and addressee

Who speaks (I / we / none). Who is addressed (God, the congregation, an unnamed “You”). To God, about God, or about us. One short paragraph.

---

## How the text moves

Two or three sentences. Where does the lyric start, where does it end, and does the refrain or a later stanza change the claim? Do not retell the lyric line by line.

---

## Lines you cannot cut

The stanza or line the grade depends on. What happens if the band drops it. Is there any single line that would change the label on its own? Say this in ordinary words. Do not call it “load-bearing.” If no line is a problem, say so once in plain words.

---

## Gospel inventory

Check what the lyric itself says. Do not credit the sermon or the next song.

| Element | Present? | Where, if present |
|---|---|---|
| Incarnation | | |
| Our sin named | | |
| Substitution stated | | |
| Wrath or curse | | |
| Cross | | |
| Burial | | |
| Resurrection | | |
| Reign / session | | |
| Repentance | | |
| Lordship | | |
| Present intercession | | |
| Justification / imputed righteousness | | |

Use “implied” only when the line is close and you then say why it is not explicit.

The table is the record of what is named. In the prose sections, say what the lyric does with a doctrine. Do not repeat the table as a run of sentences that each end “is named” or “is not named.”

---

## Persons of the Trinity named

Father / Son / Spirit: named, titled, or unnamed. One short paragraph.

---

## Could another worshiper sing this unchanged?

Could a vague theist, a moralist, or a member of another religion sing the whole song as written? Could they sing the first half if a later stanza is dropped? If the name of Jesus can be swapped for another object and the lines still work, say so. Quote the line that would stop them, if there is one.

---

## Unbiblical, non-biblical, thin

Keep these three distinct.

- **Unbiblical:** contradicts Scripture.
- **Non-biblical:** cannot be checked by a text (decoration, filler, mood).
- **Thin:** true but thin.

If an entry has nothing, write “none.”

---

## Theological Accuracy and Biblical Fidelity: #

Quote, say what the line claims, and give the Scripture reference when the ordinary sense of the text is in view. Give the reference directly (“is Isaiah 53:10”). Do not attach a phrase about the ordinary sense to every reference. Impressionistic “Bible-ish” poetry does not earn a 4 or 5.

---

## Christ-Exalting and Gospel-Saturated: #

Titles without the finished work stay in the 2–3 range. Walk the gospel inventory here in prose if the table needs explaining.

---

## Objectivity vs. Subjectivity: #

Does the lyric declare God, or is it mainly about the singer’s feelings? First-person vow and desire language belongs here. If there is a vow, quote it.

---

## Description of God’s Character: #

Specific attributes, or only “great / good / love.” A small table is fine when the list is long. Note overweight and silence. List the attributes once. Do not add a summary sentence about how specific they are.

---

## Congregational Usefulness and Clarity: #

Corporate voice, length, which stanza is easy to drop, whether the room already knows it. Mention diction only when a word or line is hard to sing or understand. Singability alone does not earn a 4 or 5. Say what the congregation learns by singing this lyric.

---

## Tone

Reverent, casual, cute, sensual, flippant, or ungrounded intensity. Say which, and quote the line that sets the tone. If a line asks the room to confer on God what He already has, quote it. If none does, leave that question out.

---

## What the congregation never says

The doctrines and confessions this lyric never puts in the people’s mouth. Write them as one list sentence. This is the reason for pairing, not a second score.

---

## Setlist notes

- **When it serves the sermon.** Texts and doctrines it fits.
- **Gaps the rest of the hour must cover.** Name one or two catalog songs that cover them when you can.
- **Diet sentence.** What this title adds to a year’s singing. What it never adds.
- **What not to do.** Cuts, tags, or placements that undo the grade. Name the stanza or line at risk.

---

## Identification notes

Is this one song or two settings under one title? Note CCLI mismatches, keys on file, arrangement year, and variant titles from old setlists.

---

## Why this overall label

Give the reason for the label in two or three sentences, in terms of this lyric. No comparison to other graded titles. Do not end with a sentence that only repeats the label.
