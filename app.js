function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

async function loadSongs() {
  const res = await fetch("songs.json");
  if (!res.ok) throw new Error("Could not load the song list.");
  return res.json();
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
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

function haystack(song) {
  return [
    song.title, song.writers, song.ccli, song.family, song.year,
    song.variants, song.notes, song.yearsSeen, song.era
  ].join(" ").toLowerCase();
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
  host.innerHTML = songs.map((s, i) => `
    <a class="row" href="song.html?id=${encodeURIComponent(s.id)}">
      <span class="n">${i + 1}</span>
      <div>
        <h2>${esc(s.title)}</h2>
        <p class="meta">${esc(s.writers)}${s.year ? " · " + esc(s.year) : ""}${s.ccli ? " · CCLI " + esc(s.ccli) : ""} · ${s.timesLogged} logged</p>
      </div>
      <span class="badge wait">${esc(statusLabel(s))}</span>
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
    if (q && !haystack(s).includes(q)) return false;
    return true;
  });
}

function fillSelect(sel, values, blank) {
  if (!sel) return;
  sel.innerHTML = `<option value="">${blank}</option>` +
    values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
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

  const draw = () => renderList(applyFilters(all));
  ["q", "family", "era", "status"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", draw);
    if (el) el.addEventListener("change", draw);
  });
  $("#stat-songs") && ($("#stat-songs").textContent = String(all.length));
  $("#stat-graded") && ($("#stat-graded").textContent = String(all.filter((s) => s.status === "graded").length));
  $("#stat-logs") && ($("#stat-logs").textContent = String(all.reduce((n, s) => n + (s.timesLogged || 0), 0)));
  draw();
}

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
  host.innerHTML = `
    <p class="kicker">${esc(s.family || "Song")}</p>
    <h1>${esc(s.title)}</h1>
    <p class="lede">${esc(s.writers)}</p>
    <dl class="idgrid">
      <div><dt>Year written</dt><dd>${esc(s.year || "None on file")}</dd></div>
      <div><dt>CCLI</dt><dd>${s.ccli ? esc(s.ccli) : "None on file"}</dd></div>
      <div><dt>Times logged (2023–Sept 2026)</dt><dd>${s.timesLogged}</dd></div>
      <div><dt>Years seen</dt><dd>${esc(s.yearsSeen || "None on file")}</dd></div>
      <div><dt>ID confidence</dt><dd>${esc(s.confidence)}</dd></div>
      <div><dt>Grade</dt><dd>${esc(statusLabel(s))}</dd></div>
    </dl>
    ${s.variants ? `<p><strong>Setlist variants.</strong> ${esc(s.variants)}</p>` : ""}
    ${s.notes ? `<div class="note">${esc(s.notes)}</div>` : ""}
    <div class="note">This page does not reprint the full lyric. CCLI covers congregational use (service slides, SongSelect, the church chord sheet), not a lyrics catalog on this site. Grade reports quote short lines for analysis only. Use SongSelect or the band chart for the complete text.</div>
    <h2>Grade report</h2>
    <div id="report-body"><p class="empty">Looking for a report…</p></div>
    <p><a href="index.html">Back to the catalog</a></p>
  `;
  const body = $("#report-body");
  try {
    const md = await loadReport(s);
    if (!md) {
      body.innerHTML = "<p>No published grade yet. Identification is complete. The report will be written from the church chord sheet (or a confirmed published text of this same setting) and then posted here.</p>";
      return;
    }
    const draft = /Draft grade/i.test(md) || s.status !== "graded";
    body.innerHTML = (draft ? '<p class="note">Draft on file. Scores are not official until the church chord sheet is checked and the catalog is marked graded.</p>' : "") + renderMarkdown(md);
  } catch (err) {
    body.innerHTML = "<p>No published grade yet. Identification is complete. The report will be written from the church chord sheet (or a confirmed published text of this same setting) and then posted here.</p>";
  }
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
