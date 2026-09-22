const PASS_HASH = "5d5124e4f628c1c838af904ae98ad3222fe1b2fd349c172efee5854635838516";
const GATE_KEY = "bcc-song-grades-ok";

async function sha256hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hideGate() {
  const el = document.getElementById("gate");
  if (el) el.classList.add("hidden");
  document.documentElement.classList.add("unlocked");
}

async function checkStored() {
  if (sessionStorage.getItem(GATE_KEY) === PASS_HASH) hideGate();
}

async function submitGate(ev) {
  ev.preventDefault();
  const input = document.getElementById("pw");
  const err = document.getElementById("gate-err");
  try {
    const hex = await sha256hex(input.value.trim());
    if (hex === PASS_HASH) {
      sessionStorage.setItem(GATE_KEY, PASS_HASH);
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
