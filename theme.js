/* Light / dark switch in the header.
   With no saved choice the site follows the device setting. Choosing the same
   look as the device clears the saved choice, so it goes back to following it. */
(function () {
  var KEY = "bcc-song-grades-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function deviceTheme() { return media && media.matches ? "dark" : "light"; }
  function saved() {
    try { var t = localStorage.getItem(KEY); return t === "light" || t === "dark" ? t : null; } catch (e) { return null; }
  }
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
  var btn = null;
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (!btn) return;
    var next = theme === "dark" ? "light" : "dark";
    btn.innerHTML = theme === "dark" ? SUN : MOON;
    btn.setAttribute("aria-label", "Switch to " + next + " mode");
    btn.title = "Switch to " + next + " mode";
  }
  function current() { return saved() || deviceTheme(); }
  function setup() {
    var bar = document.querySelector("header.site .bar");
    if (!bar || bar.querySelector(".theme-toggle")) return;
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    bar.appendChild(btn);
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try {
        if (next === deviceTheme()) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch (e) {}
      apply(next);
    });
    apply(current());
  }
  if (media) {
    var onChange = function () { if (!saved()) apply(deviceTheme()); };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }
  apply(current());
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
