/* Shared labels and score rules. Pages and scripts should read from here. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BCC_GRADES = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SCORE_MIN = 1;
  const SCORE_MAX = 5;

  const DIMENSIONS = [
    { key: "theologicalAccuracy", label: "Theological Accuracy and Biblical Fidelity" },
    { key: "christExalting", label: "Christ-Exalting and Gospel-Saturated" },
    { key: "objectivity", label: "Objectivity vs. Subjectivity" },
    { key: "godsCharacter", label: "Description of God’s Character" },
    { key: "congregationalUsefulness", label: "Congregational Usefulness and Clarity" }
  ];

  const OVERALL_LABELS = [
    "Excellent / Prefer",
    "Strong",
    "Acceptable with notes",
    "Weak",
    "Avoid"
  ];

  const GRADE_STATUS = ["not-graded", "graded"];
  const REPERTOIRE_STATUS = ["active", "retired", "not-in-repertoire"];

  const RUBRIC_VERSION = "v1";

  const ERAS = [
    "Before 1900 (hymns)",
    "1900–1989",
    "1990–1999",
    "2000–2009",
    "2010–2019",
    "2020–2025",
    "Unknown / traditional"
  ];

  function isAllowedLabel(value) {
    return OVERALL_LABELS.indexOf(value) !== -1;
  }

  function isScore(value) {
    return Number.isInteger(value) && value >= SCORE_MIN && value <= SCORE_MAX;
  }

  const LABEL_META = {
    "Excellent / Prefer": { cls: "prefer", action: "Feature freely" },
    "Strong": { cls: "strong", action: "Use regularly" },
    "Acceptable with notes": { cls: "acceptable", action: "Spare use only" },
    "Weak": { cls: "weak", action: "Do not feature" },
    "Avoid": { cls: "avoid", action: "Do not use" }
  };

  function displayLabel(song) {
    if (song && song.recommendation) return song.recommendation;
    return "Not yet graded";
  }

  function badgeClass(song) {
    const label = displayLabel(song);
    return (LABEL_META[label] && LABEL_META[label].cls) || "wait";
  }

  function actionLine(song) {
    const label = displayLabel(song);
    return (LABEL_META[label] && LABEL_META[label].action) || "Identification only";
  }

  return {
    SCORE_MIN,
    SCORE_MAX,
    DIMENSIONS,
    OVERALL_LABELS,
    GRADE_STATUS,
    REPERTOIRE_STATUS,
    RUBRIC_VERSION,
    ERAS,
    LABEL_META,
    isAllowedLabel,
    isScore,
    displayLabel,
    badgeClass,
    actionLine
  };
});
