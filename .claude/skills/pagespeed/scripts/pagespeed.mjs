#!/usr/bin/env node
// PageSpeed Insights summary for mobile and desktop. Usage: node pagespeed.mjs <url> [--json] [--local]
// Falls back to a local Lighthouse run (npx lighthouse, needs Chrome) when the PSI API is rate-limited.

import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
const asJson = args.includes("--json");
let local = args.includes("--local");
if (!url) {
  console.error("Usage: node pagespeed.mjs <url> [--json] [--local]");
  process.exit(2);
}

function runLighthouse(strategy) {
  const flags = [
    "-y", "lighthouse@12", url,
    "--only-categories=performance", "--output=json", "--output-path=stdout", "--quiet",
    "--chrome-flags=--headless=new",
  ];
  if (strategy === "desktop") flags.push("--preset=desktop");
  const out = execFileSync("npx", flags, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "inherit"] });
  return { lighthouseResult: JSON.parse(out) };
}

async function fetchPsi(strategy) {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", strategy);
  api.searchParams.set("category", "performance");
  if (process.env.PSI_API_KEY) api.searchParams.set("key", process.env.PSI_API_KEY);

  const res = await fetch(api);
  const data = await res.json();
  if (res.status === 429 && !process.env.PSI_API_KEY) {
    console.error("PSI API rate-limited without a key; falling back to local Lighthouse (no field data). Set PSI_API_KEY to avoid this.");
    local = true;
    return runLighthouse(strategy);
  }
  if (!res.ok) throw new Error(`${strategy}: HTTP ${res.status} ${data?.error?.message ?? ""}`);
  return data;
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const ms = (v) => (v == null ? "n/a" : v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`);

async function run(strategy) {
  const data = local ? runLighthouse(strategy) : await fetchPsi(strategy);

  const lh = data.lighthouseResult;
  const audit = (id) => lh.audits[id];
  const field = data.loadingExperience?.metrics ?? {};
  const fieldMetric = (key) =>
    field[key] ? { value: field[key].percentile, category: field[key].category } : null;

  return {
    strategy,
    source: data.loadingExperience ? "pagespeed-insights" : "local-lighthouse",
    fetchedAt: lh.fetchTime,
    score: Math.round((lh.categories.performance.score ?? 0) * 100),
    lab: {
      lcp: audit("largest-contentful-paint")?.numericValue,
      cls: audit("cumulative-layout-shift")?.numericValue,
      tbt: audit("total-blocking-time")?.numericValue,
      fcp: audit("first-contentful-paint")?.numericValue,
      speedIndex: audit("speed-index")?.numericValue,
    },
    field: {
      lcp: fieldMetric("LARGEST_CONTENTFUL_PAINT_MS"),
      cls: fieldMetric("CUMULATIVE_LAYOUT_SHIFT_SCORE"),
      inp: fieldMetric("INTERACTION_TO_NEXT_PAINT"),
    },
    totalBytes: audit("total-byte-weight")?.numericValue,
    heaviest: (audit("total-byte-weight")?.details?.items ?? [])
      .slice(0, 8)
      .map((i) => ({ url: i.url, bytes: i.totalBytes })),
    opportunities: Object.values(lh.audits)
      .filter((a) => a.details?.type === "opportunity" && (a.details.overallSavingsMs ?? 0) > 0)
      .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
      .slice(0, 6)
      .map((a) => ({ id: a.id, title: a.title, savingsMs: a.details.overallSavingsMs, savingsBytes: a.details.overallSavingsBytes })),
  };
}

const reports = [];
for (const strategy of ["mobile", "desktop"]) reports.push(await run(strategy));

if (asJson) {
  console.log(JSON.stringify({ url, reports }, null, 2));
  process.exit(0);
}

for (const r of reports) {
  console.log(`\n=== ${r.strategy.toUpperCase()} — score ${r.score}/100 (${r.source}, ${r.fetchedAt}) ===`);
  console.log(`Lab:   LCP ${ms(r.lab.lcp)} · CLS ${r.lab.cls?.toFixed(3)} · TBT ${ms(r.lab.tbt)} · FCP ${ms(r.lab.fcp)} · SI ${ms(r.lab.speedIndex)}`);
  const f = r.field;
  if (f.lcp || f.cls || f.inp) {
    const fmt = (m, unit) => (m ? `${unit(m.value)} (${m.category})` : "n/a");
    console.log(`Field: LCP ${fmt(f.lcp, ms)} · CLS ${fmt(f.cls, (v) => (v / 100).toFixed(2))} · INP ${fmt(f.inp, ms)}`);
  } else {
    console.log("Field: no Chrome UX Report data (not enough traffic)");
  }
  console.log(`Total transfer: ${kb(r.totalBytes ?? 0)}. Heaviest:`);
  for (const h of r.heaviest) console.log(`  ${kb(h.bytes).padStart(8)}  ${h.url}`);
  if (r.opportunities.length) {
    console.log("Top opportunities:");
    for (const o of r.opportunities) console.log(`  -${ms(o.savingsMs).padStart(7)}  ${o.title}${o.savingsBytes ? ` (${kb(o.savingsBytes)})` : ""}`);
  }
}
