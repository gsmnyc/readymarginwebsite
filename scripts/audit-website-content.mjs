import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const files = ["site.json","search-pages.json","service-pages.json","solution-pages.json","answer-pages.json","nyc-intent-pages.json"];
const pages = files.flatMap(file => JSON.parse(readFileSync(new URL("../content/" + file, import.meta.url), "utf8")).pages);
const routes = new Set(), titles = new Set();
for (const p of pages) {
  assert(/^\/[a-z0-9/-]+$/.test(p.path), "Invalid path " + p.path);
  assert(!routes.has(p.path), "Duplicate route " + p.path);
  routes.add(p.path);
  assert(p.title && p.heading && p.description, "Missing core copy " + p.path);
  if (p.indexable !== false && p.published !== false && p.path !== "/new-york-restaurant-bookkeeping") {
    const title = p.seoTitle || p.title;
    assert(!titles.has(title), "Duplicate SEO title " + title);
    titles.add(title);
    assert(p.description.length >= 80 && p.description.length <= 225, "Description review needed: " + p.path);
  }
}
for (const p of pages) {
  for (const item of p.related || []) {
    const target = typeof item === "string" ? item : item.path;
    assert(routes.has(target), "Broken related link " + p.path + " -> " + target);
  }
  if (p.canonicalPath) assert(routes.has(p.canonicalPath), "Broken canonical " + p.path);
  for (const faq of p.faqs || []) assert(faq.question.length >= 5 && faq.answer.length >= 20, "Thin FAQ " + p.path);
}
assert(routes.has("/new-york/restaurant-bookkeeping-services"), "Missing NYC bookkeeping page");
const form = pages.find(p => p.path === "/bookkeeping-consultation");
assert(form && form.published && !form.indexable, "Bookkeeping enquiry must be published but noindex");
console.log("PASS: " + pages.length + " content routes; related links, canonical paths and enquiry contract.");
