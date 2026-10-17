#!/usr/bin/env node
// Technical SEO pass/fail check for a single URL. Usage: node check.mjs <url>

const input = process.argv[2];
if (!input) {
  console.error("Usage: node check.mjs <url>");
  process.exit(2);
}

const results = [];
const add = (status, name, detail = "") => results.push({ status, name, detail });

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3] ?? "") : null;
};
const metaContent = (html, key, value) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if ((attr(tag, key) ?? "").toLowerCase() === value) return attr(tag, "content");
  }
  return null;
};
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const range = (name, value, min, max) => {
  if (!value) return add("fail", name, "missing");
  const len = decode(value).trim().length;
  add(len >= min && len <= max ? "pass" : "warn", name, `${len} chars (target ${min}–${max}): "${decode(value).trim()}"`);
};

const res = await fetch(input, { redirect: "follow", headers: { "user-agent": "almendra-seo-checklist" } });
const finalUrl = new URL(res.url);
const html = await res.text();

add(res.status === 200 ? "pass" : "fail", "HTTP status", `${res.status} ${res.url}`);
add(finalUrl.protocol === "https:" ? "pass" : "fail", "https", finalUrl.protocol);

const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null;
range("title", title, 30, 60);
range("meta description", metaContent(html, "name", "description"), 70, 160);

const canonicalTag = (html.match(/<link\b[^>]*>/gi) ?? []).find((t) => (attr(t, "rel") ?? "").toLowerCase() === "canonical");
const canonical = canonicalTag ? attr(canonicalTag, "href") : null;
add(canonical && /^https?:\/\//.test(canonical) ? "pass" : "fail", "canonical", canonical ?? "missing");

for (const prop of ["og:title", "og:description", "og:image", "og:url"]) {
  const v = metaContent(html, "property", prop);
  add(v ? "pass" : "fail", prop, v ?? "missing");
}
const twitter = metaContent(html, "name", "twitter:card");
add(twitter ? "pass" : "fail", "twitter:card", twitter ?? "missing");

const lang = attr(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang");
add(lang ? "pass" : "fail", "html lang", lang ?? "missing");
add(metaContent(html, "name", "viewport") ? "pass" : "fail", "viewport");

const h1s = (html.match(/<h1\b[\s\S]*?<\/h1>/gi) ?? []).map((h) => h.replace(/<[^>]+>/g, "").trim());
add(h1s.length === 1 ? "pass" : "fail", "h1 count", `${h1s.length}${h1s.length ? `: ${h1s.join(" | ")}` : ""}`);

const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
const noAlt = imgs.filter((t) => !(attr(t, "alt") ?? "").trim()).map((t) => attr(t, "src"));
add(noAlt.length === 0 ? "pass" : "fail", "img alt", noAlt.length ? `${noAlt.length}/${imgs.length} missing: ${noAlt.join(", ")}` : `${imgs.length} images`);

const ldBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const ldTypes = [];
let ldError = null;
for (const block of ldBlocks) {
  try {
    const data = JSON.parse(block);
    for (const node of [data, ...(data["@graph"] ?? [])].flat()) if (node?.["@type"]) ldTypes.push(node["@type"]);
  } catch (e) {
    ldError = e.message;
  }
}
add(ldTypes.length && !ldError ? "pass" : "fail", "JSON-LD", ldError ? `parse error: ${ldError}` : ldTypes.length ? ldTypes.join(", ") : "none");

const origin = finalUrl.origin;
const robots = await fetch(`${origin}/robots.txt`);
const robotsTxt = robots.ok ? await robots.text() : "";
add(robots.ok && /^sitemap:/im.test(robotsTxt) ? "pass" : "fail", "robots.txt", robots.ok ? (/^sitemap:/im.test(robotsTxt) ? "has Sitemap line" : "no Sitemap: line") : `HTTP ${robots.status}`);

const sitemap = await fetch(`${origin}/sitemap.xml`);
if (!sitemap.ok) {
  add("fail", "sitemap.xml", `HTTP ${sitemap.status}`);
} else {
  const locs = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const foreign = locs.filter((l) => { try { return new URL(l).host !== finalUrl.host; } catch { return true; } });
  add(locs.length && !foreign.length ? "pass" : "fail", "sitemap.xml", !locs.length ? "no <loc> entries" : foreign.length ? `wrong host: ${foreign.join(", ")}` : `${locs.length} URL(s)`);
}

const icon = { pass: "PASS", warn: "WARN", fail: "FAIL" };
for (const r of results) console.log(`${icon[r.status]}  ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
const failed = results.filter((r) => r.status === "fail").length;
console.log(`\n${results.length - failed}/${results.length} checks passed for ${res.url}`);
process.exit(failed ? 1 : 0);
