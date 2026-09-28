function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

async function loadSongs() {
  const res = await fetch("songs.json");
  if (!res.ok) throw new Error("Could not load the song list.");
  const songs = await res.json();
  try {
    const extraRes = await fetch("data/published-grades.json");
    if (extraRes.ok) {
      const extra = await extraRes.json();
      return songs.map((s) => extra[s.id] ? Object.assign({}, s, extra[s.id]) : s);
    }
  } catch (err) {
    /* overlay is optional */
  }
  return songs;
}

function songNote(s) {
  const note = String(s.notes || "").trim();
  if (!note) return "";
  if (/logged under both titles/i.test(note)) return "";
  if (/treat as one song/i.test(note)) return "";
  return `<div class="note">${esc(note)}</div>`;
}
