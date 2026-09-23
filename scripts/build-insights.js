#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const grades = require("../lib/grades.js");

const root = path.resolve(__dirname, "..");
const songsPath = path.join(root, "songs.json");
const outPath = path.join(root, "insights.json");

const songs = JSON.parse(fs.readFileSync(songsPath, "utf8"));

function countBy(key) {
  const map = new Map();
  songs.forEach((s) => {
    const name = s[key] || "Unknown";
    map.set(name, (map.get(name) || 0) + 1);
  });
  return map;
}

function rowsFrom(map, preferredOrder) {
  const keys = preferredOrder
    ? preferredOrder.filter((k) => map.has(k)).concat([...map.keys()].filter((k) => preferredOrder.indexOf(k) === -1))
    : [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(b[0])).map((e) => e[0]);
  return keys.map((name) => ({ name, count: map.get(name) }));
}

const familyMap = countBy("family");
const eraMap = countBy("era");
const recMap = new Map();
grades.OVERALL_LABELS.forEach((l) => recMap.set(l, 0));
let graded = 0;
songs.forEach((s) => {
  if (s.status === "graded") graded += 1;
  if (s.recommendation && recMap.has(s.recommendation)) {
    recMap.set(s.recommendation, recMap.get(s.recommendation) + 1);
  }
});

const mostLogged = songs
  .slice()
  .sort((a, b) => (b.timesLogged || 0) - (a.timesLogged || 0) || a.title.localeCompare(b.title))
  .slice(0, 15)
  .map((s) => ({
    title: s.title,
    id: s.id,
    timesLogged: s.timesLogged || 0,
    writers: s.writers || ""
  }));

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const now = new Date();
const asOf = now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear();

const out = {
  asOf,
  uniqueSongs: songs.length,
  highConfidence: songs.filter((s) => s.confidence === "High").length,
  graded,
  notGraded: songs.length - graded,
  setlistMentionsRaw: songs.reduce((n, s) => n + (s.timesLogged || 0), 0),
  timesLoggedSum: songs.reduce((n, s) => n + (s.timesLogged || 0), 0),
  families: rowsFrom(familyMap),
  eras: rowsFrom(eraMap, grades.ERAS),
  recommendations: grades.OVERALL_LABELS.map((name) => ({ name, count: recMap.get(name) })),
  mostLogged
};

fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log("Wrote", path.relative(root, outPath), "from", songs.length, "songs");
