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

/* Catalog links reuse the query keys index.html already understands.
   A zero count is not a link: there is nothing to open. */
function catalogQuery(params) {
  const qs = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) qs.set(key, params[key]);
  });
  const search = qs.toString();
  return "index.html" + (search ? "?" + search : "");
}

function barAria(name, count, unit, extra) {
  const n = count || 0;
  if (unit === "time") {
    const noun = n === 1 ? "time sung" : "times sung";
    let text = "View " + name + " songs";
    if (extra) text += ", " + extra;
    return text + ". " + n + " " + noun + ".";
  }
  const noun = n === 1 ? "song" : "songs";
  return "View " + n + " " + name + " " + noun + ".";
}

/* Each bar with a count is its own <a>. The browser cancels a tap that
   becomes a scroll, so do not navigate from touchstart or pointerdown.
   A zero count stays plain text. */
function bars(rows, hostId, opts) {
  const host = document.getElementById(hostId);
  if (!host) return;
  const options = opts || {};
  const colorFor = options.colorFor;
  const hrefFor = options.hrefFor;
  const unit = options.unit || "song";
  const extra = options.extra || "";
  const max = Math.max(...rows.map((r) => r.count || 0), 1);
  const total = rows.reduce((sum, r) => sum + (r.count || 0), 0);
  const pct = (n) => {
    if (!total || !n) return "0%";
    const p = (n / total) * 100;
    return p < 1 ? "<1%" : `${Math.round(p)}%`;
  };
  host.innerHTML = rows.map((r) => {
    const count = r.count || 0;
    const href = count > 0 && hrefFor ? hrefFor(r) : "";
    const tone = colorFor ? colorFor(r.name) : "";
    const open = href
      ? `<a class="barline" href="${esc(href)}" aria-label="${esc(barAria(r.name, count, unit, extra))}">`
      : `<div class="barline">`;
    const close = href ? "</a>" : "</div>";
    return `${open}
      <div class="label">${esc(r.name)}</div>
      <div class="meter"><i class="${tone ? esc(tone) : ""}" style="width:${(count / max) * 100}%"></i></div>
      <div class="c">${count} <span class="pct">${esc(pct(count))}</span></div>
    ${close}`;
  }).join("");
}

async function init() {
  const res = await fetch("insights.json");
  const d = await res.json();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("n-songs", d.uniqueSongs);
  set("n-graded", d.graded);
  set("n-sum", d.timesLoggedSum);
  set("n-asof", d.asOf);
  set("n-notgraded", d.notGraded);
  const labelClass = (name) => {
    const meta = typeof BCC_GRADES !== "undefined" && BCC_GRADES.LABEL_META ? BCC_GRADES.LABEL_META[name] : null;
    return meta ? meta.cls : "";
  };
  bars(d.recommendations || [], "grade-bars", {
    colorFor: labelClass,
    unit: "song",
    hrefFor: (r) => catalogQuery({ status: r.name })
  });
  /* The bar counts times sung. The catalog still lists songs, most sung first. */
  bars(d.recommendationsByLogs || [], "grade-log-bars", {
    colorFor: labelClass,
    unit: "time",
    extra: "most sung first",
    hrefFor: (r) => catalogQuery({ status: r.name, sort: "logged" })
  });
  set("n-logged-graded", d.loggedGraded);
  const allLogs = (d.loggedGraded || 0) + (d.loggedNotGraded || 0);
  set("n-logged-notgraded", d.loggedNotGraded);
  set("n-logged-all", allLogs);
  set("n-logged-notgraded-pct", allLogs ? `${Math.round((d.loggedNotGraded / allLogs) * 100)}%` : "0%");
  bars(d.families, "family-bars", {
    unit: "song",
    hrefFor: (r) => catalogQuery({ family: r.name })
  });
  bars(d.eras, "era-bars", {
    unit: "song",
    hrefFor: (r) => catalogQuery({ era: r.name })
  });
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
