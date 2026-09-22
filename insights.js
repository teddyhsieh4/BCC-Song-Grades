function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function bars(rows, hostId) {
  const host = document.getElementById(hostId);
  if (!host) return;
  const max = Math.max(...rows.map((r) => r.count), 1);
  host.innerHTML = rows.map((r) => `
    <div class="barline">
      <div class="label">${esc(r.name)}</div>
      <div class="bar"><i style="width:${(r.count / max) * 100}%"></i></div>
      <div class="c">${r.count}</div>
    </div>
  `).join("");
}

async function init() {
  const res = await fetch("insights.json");
  const d = await res.json();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("n-songs", d.uniqueSongs);
  set("n-graded", d.graded);
  set("n-sum", d.timesLoggedSum);
  set("n-asof", d.asOf);
  bars(d.families, "family-bars");
  bars(d.eras, "era-bars");
  const top = document.getElementById("top-list");
  if (top) {
    top.innerHTML = d.mostLogged.map((s, i) => `
      <a class="row" href="song.html?id=${encodeURIComponent(s.id)}">
        <span class="n">${i + 1}</span>
        <div>
          <h2>${esc(s.title)}</h2>
          <p class="meta">${esc(s.writers)}</p>
        </div>
        <span class="badge">${s.timesLogged} logs</span>
      </a>
    `).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => init());
