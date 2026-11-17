const PASS_HASH = "5d5124e4f628c1c838af904ae98ad3222fe1b2fd349c172efee5854635838516";
const GATE_KEY = "bcc-song-grades-ok";
// Remembers the password on this device for 30 days. This only saves the hash
// and an end date. It skips the gate screen; it is not real security.
const REMEMBER_KEY = "bcc-song-grades-remember";
const REMEMBER_DAYS = 30;

async function sha256hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hideGate() {
  const el = document.getElementById("gate");
  if (el) el.classList.add("hidden");
  document.documentElement.classList.add("unlocked");
}

function rememberedOk() {
  try {
    const saved = JSON.parse(localStorage.getItem(REMEMBER_KEY) || "null");
    if (saved && saved.hash === PASS_HASH && saved.until > Date.now()) return true;
    localStorage.removeItem(REMEMBER_KEY);
  } catch (e) {}
  return false;
}

function remember() {
  try { sessionStorage.setItem(GATE_KEY, PASS_HASH); } catch (e) {}
  try {
    const until = Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(REMEMBER_KEY, JSON.stringify({ hash: PASS_HASH, until }));
  } catch (e) {}
}

async function checkStored() {
  let sessionOk = false;
  try { sessionOk = sessionStorage.getItem(GATE_KEY) === PASS_HASH; } catch (e) {}
  if (sessionOk || rememberedOk()) {
    hideGate();
  } else {
    // The early check in each page's <head> may have hidden the gate for an
    // old or expired entry. Show it again.
    document.documentElement.classList.remove("unlocked");
  }
}

async function submitGate(ev) {
  ev.preventDefault();
  const input = document.getElementById("pw");
  const err = document.getElementById("gate-err");
  try {
    const hex = await sha256hex(input.value.trim());
    if (hex === PASS_HASH) {
      remember();
      hideGate();
    } else if (err) {
      err.textContent = "That password is not right.";
      input.select();
    }
  } catch (e) {
    if (err) err.textContent = "Could not check the password in this browser.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkStored();
  const form = document.getElementById("gate-form");
  if (form) form.addEventListener("submit", submitGate);
});
