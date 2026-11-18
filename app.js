function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

async function loadSongs() {
  const res = await fetch("songs.json");
  if (!res.ok) throw new Error("Could not load the song list.");
  return res.json();
}

/* Working-memo sentences from the catalog Sheet ("Writer confirmed by you.") stay off the site. */
const MEMO_SENTENCE = /\b(?:confirmed by you|implied by your|(?:to )?match(?:es)? your|previous (?:row|ccli)|corrected to)\b/i;

function songNote(s) {
  const raw = String(s.notes || "").trim();
  if (!raw) return "";
  if (/logged under both titles/i.test(raw)) return "";
  if (/treat as one song/i.test(raw)) return "";
  const parts = raw.match(/[^.!?]+(?:[.!?]+[\u201d"\u2019)]*|$)\s*/g) || [raw];
  const note = parts.filter((p) => !MEMO_SENTENCE.test(p)).join("").trim();
  if (!note) return "";
  return `<div class="note">${esc(note)}</div>`;
}

function esc(s) {
  const amp = String.fromCharCode(38);
  const map = {
    "&": amp + "amp;",
    "<": amp + "lt;",
    ">": amp + "gt;",
    '"': amp + "quot;",
    "'": amp + "#39;"
  };
  return String(s ?? "").replace(/[&<>"']/g, (c) => map[c]);
}

function inlineMd(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^\*\n]+)\*/g, "$1<em>$2</em>");
  return s;
}

function renderMarkdown(src) {
  const lines = String(src || "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i += 1; continue; }
    if (/^---+$/.test(line.trim())) { out.push("<hr>"); i += 1; continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const n = h[1].length;
      out.push("<h" + n + ">" + inlineMd(h[2]) + "</h" + n + ">");
      i += 1;
      continue;
    }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|\s*-/.test(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i]);
        i += 1;
      }
      const cells = (row) => row.split("|").slice(1, -1).map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      let html = "<table><thead><tr>" + head.map((c) => "<th>" + inlineMd(c) + "</th>").join("") + "</tr></thead><tbody>";
      body.forEach((r) => {
        html += "<tr>" + r.map((c) => "<td>" + inlineMd(c) + "</td>").join("") + "</tr>";
      });
      html += "</tbody></table>";
      out.push(html);
      continue;
    }
    if (/^\*\*[^*]+\*\*:/.test(line)) {
      const items = [];
      while (i < lines.length && /^\*\*[^*]+\*\*:/.test(lines[i])) {
        items.push("<p>" + inlineMd(lines[i]) + "</p>");
        i += 1;
      }
      out.push(items.join("\n"));
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push("<li>" + inlineMd(lines[i].replace(/^[-*]\s+/, "")) + "</li>");
        i += 1;
      }
      out.push("<ul>" + items.join("") + "</ul>");
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push("<li>" + inlineMd(lines[i].replace(/^\d+\.\s+/, "")) + "</li>");
        i += 1;
      }
      out.push("<ol>" + items.join("") + "</ol>");
      continue;
    }
    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() !== "" && !/^#{1,4}\s/.test(lines[i]) && !/^---+$/.test(lines[i].trim()) && !/^\|/.test(lines[i]) && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    out.push("<p>" + inlineMd(para.join(" ")) + "</p>");
  }
  return out.join("\n");
}

async function loadReport(song) {
  const path = song.report || ("reports/" + song.id + ".md");
  const res = await fetch(path);
  if (!res.ok) return null;
  return res.text();
}

function statusLabel(song) {
  if (typeof BCC_GRADES !== "undefined" && BCC_GRADES.displayLabel) {
    return BCC_GRADES.displayLabel(song);
  }
  if (song.recommendation) return song.recommendation;
  return "Not yet graded";
}

function badgeClass(song) {
  if (typeof BCC_GRADES !== "undefined" && BCC_GRADES.badgeClass) {
    return BCC_GRADES.badgeClass(song);
  }
  return song && song.recommendation ? "strong" : "wait";
}

function actionLine(song) {
  if (typeof BCC_GRADES !== "undefined" && BCC_GRADES.actionLine) {
    return BCC_GRADES.actionLine(song);
  }
  return song && song.recommendation ? "" : "Identification only";
}

function haystack(song) {
  return [
    song.title, song.writers, song.ccli, song.family, song.year,
    song.variants, song.notes, song.yearsSeen, song.era
  ].join(" ").toLowerCase();
}

/* Graded rows show the five scores in small type, with short names. */
function rowScores(song) {
  if (!song.scores || typeof BCC_GRADES === "undefined" || !BCC_GRADES.DIMENSIONS) return "";
  const parts = BCC_GRADES.DIMENSIONS.filter((d) => Number.isInteger(song.scores[d.key])).map((d) =>
    `<span title="${esc(d.label)}"><i class="full">${esc(d.short || d.label)}</i><i class="tiny">${esc(d.tiny || d.short || d.label)}</i> <b>${song.scores[d.key]}</b></span>`);
  return parts.length ? `<p class="row-scores" aria-label="Scores out of 5">${parts.join("")}</p>` : "";
}

function renderList(songs) {
  const host = $("#results");
  const count = $("#count");
  if (!host) return;
  if (!songs.length) {
    host.innerHTML = '<p class="empty">No songs match that search.</p>';
    if (count) count.textContent = "0 songs";
    return;
  }
  if (count) count.textContent = songs.length + (songs.length === 1 ? " song" : " songs");
  host.innerHTML = songs.map((s) => `
    <a class="row" href="song.html?id=${encodeURIComponent(s.id)}">
      <h2>${esc(s.title)}</h2>
      <span class="badge ${badgeClass(s)}">${esc(statusLabel(s))}</span>
      <p class="meta">${esc(s.writers)}${s.year ? " · " + esc(s.year) : ""}${s.ccli ? " · CCLI " + esc(s.ccli) : ""} · ${s.timesLogged} logged</p>
      ${rowScores(s)}
    </a>
  `).join("");
}

function applyFilters(all) {
  const q = ($("#q")?.value || "").trim().toLowerCase();
  const family = $("#family")?.value || "";
  const era = $("#era")?.value || "";
  const status = $("#status")?.value || "";
  return all.filter((s) => {
    if (family && s.family !== family) return false;
    if (era && s.era !== era) return false;
    if (status === "graded" && s.status !== "graded") return false;
    if (status === "not-graded" && s.status !== "not-graded") return false;
    if (status && status !== "graded" && status !== "not-graded" && s.recommendation !== status) return false;
    if (q && !haystack(s).includes(q)) return false;
    return true;
  });
}

function gradeRank(song) {
  const labels = (typeof BCC_GRADES !== "undefined" && BCC_GRADES.OVERALL_LABELS) || [];
  const i = labels.indexOf(song.recommendation);
  return i === -1 ? -1 : i;
}

function sortSongs(songs, how) {
  const byTitle = (a, b) => a.title.localeCompare(b.title);
  const list = songs.slice();
  if (how === "logged") return list.sort((a, b) => (b.timesLogged || 0) - (a.timesLogged || 0) || byTitle(a, b));
  if (how === "grade") {
    /* Avoid first, then Weak, up to Excellent / Prefer. Ungraded songs go last. */
    return list.sort((a, b) => {
      const ra = gradeRank(a);
      const rb = gradeRank(b);
      if (ra === -1 && rb === -1) return byTitle(a, b);
      if (ra === -1) return 1;
      if (rb === -1) return -1;
      return rb - ra || byTitle(a, b);
    });
  }
  if (how === "recent") {
    /* Newest gradeDate first. Ungraded songs go last. */
    return list.sort((a, b) => {
      const da = a.status === "graded" ? a.gradeDate || "" : "";
      const db = b.status === "graded" ? b.gradeDate || "" : "";
      if (!da && !db) return byTitle(a, b);
      if (!da) return 1;
      if (!db) return -1;
      return db.localeCompare(da) || byTitle(a, b);
    });
  }
  return list.sort(byTitle);
}

function fillSelect(sel, values, blank) {
  if (!sel) return;
  sel.innerHTML = `<option value="">${blank}</option>` +
    values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
}

const CATALOG_STATE_KEY = "bcc-catalog-state";

/* Keep search and filters in the address bar, and remember the list order for Previous / Next on song pages. */
function rememberCatalog(fields, list) {
  const qs = new URLSearchParams();
  fields.forEach((id) => {
    const el = document.getElementById(id);
    const v = el ? el.value.trim() : "";
    if (v && !(id === "sort" && v === "az")) qs.set(id, v);
  });
  const search = qs.toString() ? "?" + qs.toString() : "";
  try { history.replaceState(null, "", "index.html" + search); } catch (err) { /* ignore */ }
  try {
    sessionStorage.setItem(CATALOG_STATE_KEY, JSON.stringify({ search, ids: list.map((s) => s.id) }));
  } catch (err) { /* storage can be unavailable */ }
}

function readCatalogState() {
  try {
    const raw = sessionStorage.getItem(CATALOG_STATE_KEY);
    const state = raw ? JSON.parse(raw) : null;
    if (state && Array.isArray(state.ids)) return state;
  } catch (err) { /* ignore */ }
  return null;
}

async function initHome() {
  const all = await loadSongs();
  all.sort((a, b) => a.title.localeCompare(b.title));
  const families = [...new Set(all.map((s) => s.family))].sort();
  const eras = [...new Set(all.map((s) => s.era))];
  fillSelect($("#family"), families, "All families");
  fillSelect($("#era"), [
    "Before 1900 (hymns)", "1900–1989", "1990–1999", "2000–2009", "2010–2019", "2020–2025", "Unknown / traditional"
  ].filter((e) => eras.includes(e)), "All eras");

  const FIELDS = ["q", "family", "era", "status", "sort"];
  const params = new URLSearchParams(location.search);
  FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    const v = params.get(id);
    if (!el || v === null) return;
    if (el.tagName === "SELECT" && ![...el.options].some((o) => o.value === v)) return;
    el.value = v;
  });

  const draw = () => {
    const list = sortSongs(applyFilters(all), $("#sort")?.value || "az");
    renderList(list);
    rememberCatalog(FIELDS, list);
  };
  FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", draw);
    if (el) el.addEventListener("change", draw);
  });
  $("#stat-songs") && ($("#stat-songs").textContent = String(all.length));
  $("#stat-graded") && ($("#stat-graded").textContent = String(all.filter((s) => s.status === "graded").length));
  $("#stat-logs") && ($("#stat-logs").textContent = String(all.reduce((n, s) => n + (s.timesLogged || 0), 0)));
  draw();
}

const PINNED_SECTIONS = ["Thesis", "Overall recommendation", "Alternative song suggestions", "Setlist notes"];

function trimEdges(lines) {
  const blank = (l) => /^(-{3,})?$/.test(l.trim());
  while (lines.length && blank(lines[0])) lines.shift();
  while (lines.length && blank(lines[lines.length - 1])) lines.pop();
  return lines;
}

/* Split a report into the part before the first "## " heading and one entry per "## " section. */
function splitReport(md) {
  const lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
  const intro = [];
  const sections = [];
  let current = null;
  lines.forEach((line) => {
    const m = line.match(/^##\s+(.*)$/);
    if (m) {
      current = { title: m[1].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    } else if (!/^#\s/.test(line)) {
      intro.push(line);
    }
  });
  sections.forEach((sec) => { sec.body = trimEdges(sec.lines).join("\n"); });
  return { intro: trimEdges(intro).join("\n"), sections };
}

function isPinned(title) {
  return PINNED_SECTIONS.some((p) => title.toLowerCase().startsWith(p.toLowerCase()));
}

function scoreBars(song) {
  if (!song.scores || typeof BCC_GRADES === "undefined" || !BCC_GRADES.DIMENSIONS) return "";
  const max = BCC_GRADES.SCORE_MAX || 5;
  const rows = BCC_GRADES.DIMENSIONS.filter((d) => Number.isInteger(song.scores[d.key])).map((d) => {
    const v = song.scores[d.key];
    return `<div class="scoreline">
      <span class="label">${esc(d.label)}</span>
      <span class="meter"><i style="width:${(v / max) * 100}%"></i></span>
      <span class="c">${v} / ${max}</span>
    </div>`;
  });
  return rows.length ? `<div class="scorebars" aria-label="Scores">${rows.join("")}</div>` : "";
}

function detailsBlock(title, html) {
  return `<details class="rsec"><summary>${inlineMd(title)}</summary><div class="rbody">${html}</div></details>`;
}

function renderReport(md) {
  const { intro, sections } = splitReport(md);
  const pinned = PINNED_SECTIONS
    .map((p) => sections.find((sec) => sec.title.toLowerCase().startsWith(p.toLowerCase())))
    .filter(Boolean);
  const rest = sections.filter((sec) => !isPinned(sec.title));
  const top = pinned.map((sec) => `<section class="rtop"><h2>${inlineMd(sec.title)}</h2>${renderMarkdown(sec.body)}</section>`).join("");
  const more = rest.length ? `
    <div class="more-head">
      <h2>Full report</h2>
      <button type="button" class="linkbtn" id="toggle-all">Open all</button>
    </div>
    ${rest.map((sec) => detailsBlock(sec.title, renderMarkdown(sec.body))).join("")}` : "";
  return { html: top + more, intro };
}

function songDetails(s, reportIntro) {
  return detailsBlock("Song details", `
    <dl class="idgrid">
      <div><dt>Year written</dt><dd>${esc(s.year || "None on file")}</dd></div>
      <div><dt>CCLI</dt><dd>${s.ccli ? esc(s.ccli) : "None on file"}</dd></div>
      <div><dt>Times logged (2023–Sept 2026)</dt><dd>${s.timesLogged}</dd></div>
      <div><dt>Years seen</dt><dd>${esc(s.yearsSeen || "None on file")}</dd></div>
    </dl>
    ${s.variants ? `<p><strong>Setlist variants.</strong> ${esc(s.variants)}</p>` : ""}
    ${songNote(s)}
    ${reportIntro ? renderMarkdown(reportIntro) : ""}
  `);
}

function wireToggleAll(root) {
  const btn = $("#toggle-all", root);
  if (!btn) return;
  const all = () => $$("#report-body details.rsec", root);
  const sync = () => { btn.textContent = all().every((d) => d.open) ? "Close all" : "Open all"; };
  btn.addEventListener("click", () => {
    const open = !all().every((d) => d.open);
    all().forEach((d) => { d.open = open; });
    sync();
  });
  all().forEach((d) => d.addEventListener("toggle", sync));
}

function catalogHref() {
  const state = readCatalogState();
  return "index.html" + (state && state.search ? state.search : "");
}

function cameFromCatalog() {
  try {
    const ref = new URL(document.referrer);
    return ref.origin === location.origin && /\/(index\.html)?$/.test(ref.pathname);
  } catch (err) {
    return false;
  }
}

/* Back links return to the catalog with the same search and filters. Going back in history also keeps the scroll spot. */
function wireBackLinks(root) {
  $$("a[data-back]", root).forEach((a) => {
    a.setAttribute("href", catalogHref());
    a.addEventListener("click", (e) => {
      if (cameFromCatalog() && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });
}

/* Previous / Next follow the list the reader came from, or the full A to Z list. */
function prevNext(all, song) {
  const state = readCatalogState();
  const fromList = !!(state && state.ids.includes(song.id));
  const ids = fromList ? state.ids : all.slice().sort((a, b) => a.title.localeCompare(b.title)).map((s) => s.id);
  const i = ids.indexOf(song.id);
  if (i === -1 || ids.length < 2) return "";
  const byId = new Map(all.map((s) => [s.id, s]));
  const prev = i > 0 ? byId.get(ids[i - 1]) : null;
  const next = i < ids.length - 1 ? byId.get(ids[i + 1]) : null;
  const link = (s, dir) => s ? `<a class="pn-${dir}" href="song.html?id=${encodeURIComponent(s.id)}">
      <span class="pn-dir">${dir === "prev" ? "← Previous" : "Next →"}</span>
      <span class="pn-title">${esc(s.title)}</span></a>` : "<span></span>";
  return `<nav class="prevnext" aria-label="More songs">${link(prev, "prev")}${link(next, "next")}</nav>
    <p class="pn-count">${i + 1} of ${ids.length} in ${fromList ? "your catalog list" : "the catalog"}</p>`;
}

const LYRICS_NOTE = '<div class="note">This page does not reprint the full lyric. CCLI covers congregational use (service slides, SongSelect, printed charts), not a lyrics catalog on this site. Grade reports quote short lines for analysis only. Use SongSelect or a printed chart for the complete text.</div>';

async function initSong() {
  const id = new URLSearchParams(location.search).get("id");
  const host = $("#song");
  if (!host) return;
  const all = await loadSongs();
  const s = all.find((x) => x.id === id);
  if (!s) {
    host.innerHTML = '<p class="empty">That song is not in the list. <a href="index.html">Back to the catalog</a>.</p>';
    return;
  }
  document.title = s.title + " · BCC Song Grades";
  const head = `
    <p class="crumb"><a data-back href="index.html">← Catalog</a></p>
    <p class="kicker">${esc(s.family || "Song")}</p>
    <h1>${esc(s.title)}</h1>
    <p class="lede">${esc(s.writers)}</p>
    <p class="grade-line"><span class="badge ${badgeClass(s)}">${esc(statusLabel(s))}</span><span class="grade-action">${esc(actionLine(s))}</span></p>
  `;

  let md = null;
  if (s.status === "graded") {
    try { md = await loadReport(s); } catch (err) { md = null; }
  }

  if (!md) {
    host.innerHTML = head + `
      <dl class="idgrid">
        <div><dt>Year written</dt><dd>${esc(s.year || "None on file")}</dd></div>
        <div><dt>CCLI</dt><dd>${s.ccli ? esc(s.ccli) : "None on file"}</dd></div>
        <div><dt>Times logged (2023–Sept 2026)</dt><dd>${s.timesLogged}</dd></div>
        <div><dt>Years seen</dt><dd>${esc(s.yearsSeen || "None on file")}</dd></div>
      </dl>
      <p class="no-grade">No published grade yet. The report will be posted here after approval.</p>
      ${s.variants ? detailsBlock("Also logged as", `<p>${esc(s.variants)}</p>`) : ""}
      ${songNote(s)}
      ${LYRICS_NOTE}
      ${prevNext(all, s)}
      <p class="back-link"><a data-back href="index.html">Back to the catalog</a></p>
    `;
    wireBackLinks(host);
    return;
  }

  const report = renderReport(md);
  host.innerHTML = head + `
    ${scoreBars(s)}
    <div id="report-body">${report.html}</div>
    ${songDetails(s, report.intro)}
    ${LYRICS_NOTE}
    ${prevNext(all, s)}
    <p class="back-link"><a data-back href="index.html">Back to the catalog</a></p>
  `;
  wireToggleAll(host);
  wireBackLinks(host);
}

document.addEventListener("DOMContentLoaded", () => {
  if ($("#results")) initHome().catch((e) => {
    const host = $("#results");
    if (host) host.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  });
  if ($("#song")) initSong().catch((e) => {
    const host = $("#song");
    if (host) host.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  });
});
