function esc(s) {
  const map = { "&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;", "'": "&#" + "39;" };
  return String(s ?? "").replace(/[&<>"']/g, (c) => map[c]);
}

function statusLabel(song) {
  if (typeof BCC_GRADES !== "undefined" && BCC_GRADES.displayLabel) return BCC_GRADES.displayLabel(song);
  if (song.recommendation) return song.recommendation;
  return "Not yet graded";
}

function badgeClass(song) {
  if (typeof BCC_GRADES !== "undefined" && BCC_GRADES.badgeClass) return BCC_GRADES.badgeClass(song);
  return "wait";
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
        <div class="badges">
          <span class="badge">${s.timesLogged} logs</span>
          <span class="badge ${badgeClass(s)}">${esc(statusLabel(s))}</span>
        </div>
      </a>
    `).join("");
  }
}

function familyInfoDialog() {
  const root = document.getElementById("family-info");
  const openBtn = document.getElementById("family-info-btn");
  if (!root || !openBtn) return;
  const panel = root.querySelector(".dialog");

  function open() {
    root.hidden = false;
    document.body.classList.add("dialog-open");
    openBtn.setAttribute("aria-expanded", "true");
    if (panel) panel.focus();
  }
  function close() {
    root.hidden = true;
    document.body.classList.remove("dialog-open");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
  }

  openBtn.addEventListener("click", open);
  root.querySelectorAll("[data-close-family-info]").forEach((el) => {
    el.addEventListener("click", close);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !root.hidden) close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  familyInfoDialog();
});
