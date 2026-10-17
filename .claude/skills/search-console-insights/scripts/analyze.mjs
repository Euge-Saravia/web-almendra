#!/usr/bin/env node
// Search Console Queries.csv analysis. Usage: node analyze.mjs <Queries.csv> [--brand term1,term2]

import fs from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const brandArg = args[args.indexOf("--brand") + 1];
const brandTerms = (args.includes("--brand") && brandArg ? brandArg : "almendra").toLowerCase().split(",").map((s) => s.trim());
if (!file) {
  console.error("Usage: node analyze.mjs <Queries.csv> [--brand term1,term2]");
  process.exit(2);
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim()));
}

// Handles "1,234", "3.5%", "3,5 %" (Spanish locale) and plain numbers.
const num = (s) => {
  let v = String(s).replace(/[%\s]/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(v)) v = v.replace(/\./g, "").replace(",", ".");
  else if (/^\d+,\d+$/.test(v)) v = v.replace(",", ".");
  else v = v.replace(/,/g, "");
  return Number(v) || 0;
};

const [header, ...body] = parseCsv(fs.readFileSync(file, "utf8").replace(/^﻿/, ""));
const rows = body.map((r) => ({
  query: r[0],
  clicks: num(r[1]),
  impressions: num(r[2]),
  ctr: num(r[3]) / 100,
  position: num(r[4]),
}));

// Rough organic CTR expectations by position (industry averages, desktop+mobile blend).
const expectedCtr = (p) => (p <= 1.5 ? 0.28 : p <= 2.5 ? 0.15 : p <= 3.5 ? 0.1 : p <= 5.5 ? 0.06 : p <= 10.5 ? 0.025 : 0.01);
const isBrand = (q) => brandTerms.some((t) => q.toLowerCase().includes(t));

const sum = (list, k) => list.reduce((a, r) => a + r[k], 0);
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const totalImp = sum(rows, "impressions");
const totalClicks = sum(rows, "clicks");
const brand = rows.filter((r) => isBrand(r.query));
const nonBrand = rows.filter((r) => !isBrand(r.query));

console.log(`File: ${file} (${rows.length} queries; columns: ${header.join(" | ")})`);
console.log(`Totals: ${totalClicks} clicks, ${totalImp} impressions, CTR ${pct(totalImp ? totalClicks / totalImp : 0)}`);
console.log(`Branded (${brandTerms.join(", ")}): ${sum(brand, "clicks")} clicks / ${sum(brand, "impressions")} impr · Non-branded: ${sum(nonBrand, "clicks")} clicks / ${sum(nonBrand, "impressions")} impr`);
if (totalImp < 100) console.log("NOTE: under 100 impressions in total — treat as directional only.");

const table = (title, list) => {
  console.log(`\n## ${title} (${list.length})`);
  for (const r of list.slice(0, 15)) {
    console.log(`  ${r.query.padEnd(45).slice(0, 45)}  pos ${r.position.toFixed(1).padStart(5)}  impr ${String(r.impressions).padStart(6)}  clicks ${String(r.clicks).padStart(4)}  ctr ${pct(r.ctr)}`);
  }
};

table(
  "Low CTR for its position (rewrite title/description)",
  rows.filter((r) => r.impressions >= 50 && r.ctr < expectedCtr(r.position) * 0.5).sort((a, b) => b.impressions - a.impressions),
);
table(
  "Striking distance, positions 5–20 (strengthen on-page copy)",
  rows.filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 20).sort((a, b) => b.impressions - a.impressions),
);
table("Top non-branded queries", [...nonBrand].sort((a, b) => b.impressions - a.impressions));
