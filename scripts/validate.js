#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const grades = require("../lib/grades.js");

const file = process.argv[2] || "songs.json";
const abs = path.resolve(process.cwd(), file);

if (!fs.existsSync(abs)) {
  console.error("Missing file:", file);
  process.exit(1);
}

const raw = fs.readFileSync(abs, "utf8");
let songs;
try {
  songs = JSON.parse(raw);
} catch (err) {
  console.error("Invalid JSON in", file, err.message);
  process.exit(1);
}

if (!Array.isArray(songs)) {
  console.error(file, "must be an array of song objects.");
  process.exit(1);
}

const errors = [];
const ids = new Map();
const cclis = new Map();

function fail(i, id, msg) {
  errors.push((id || "#" + i) + ": " + msg);
}

songs.forEach((s, i) => {
  const id = s && s.id;
  if (!id || typeof id !== "string") {
    fail(i, null, "missing id");
    return;
  }
  if (ids.has(id)) fail(i, id, "duplicate id (also " + ids.get(id) + ")");
  else ids.set(id, i);

  if (!s.title || !String(s.title).trim()) fail(i, id, "missing title");

  if (s.ccli) {
    const c = String(s.ccli).trim();
    if (cclis.has(c)) fail(i, id, "duplicate CCLI " + c + " (also " + cclis.get(c) + ")");
    else cclis.set(c, id);
  }

  if (s.status && grades.GRADE_STATUS.indexOf(s.status) === -1) {
    fail(i, id, "status must be not-graded or graded");
  }

  if (s.repertoireStatus && grades.REPERTOIRE_STATUS.indexOf(s.repertoireStatus) === -1) {
    fail(i, id, "repertoireStatus must be active, retired, or not-in-repertoire");
  }

  if (s.recommendation != null && s.recommendation !== "") {
    if (!grades.isAllowedLabel(s.recommendation)) {
      fail(i, id, "recommendation is not one of the five official labels");
    }
  }

  const scores = s.scores || {};
  grades.DIMENSIONS.forEach((dim) => {
    if (scores[dim.key] != null && !grades.isScore(scores[dim.key])) {
      fail(i, id, dim.key + " must be a whole number 1–5");
    }
  });

  if (s.status === "graded") {
    if (!s.recommendation || !grades.isAllowedLabel(s.recommendation)) {
      fail(i, id, "graded song needs an official overall label");
    }
    if (!s.chordSheet && !s.sourceChart) {
      fail(i, id, "published grade needs chordSheet or sourceChart");
    }
    grades.DIMENSIONS.forEach((dim) => {
      if (!grades.isScore(scores[dim.key])) {
        fail(i, id, "graded song missing score " + dim.key);
      }
    });
  }
});

if (errors.length) {
  console.error("Validation failed for", file);
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}

console.log("OK", file, "(" + songs.length + " songs)");
