import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const { pages, settings, tiers } = JSON.parse(
  readFileSync("content/site.json", "utf8"),
);
const paths = new Set(pages.map((p) => p.path));
assert.equal(settings.workingDay.length, 3);
for (const chapter of settings.workingDay) {
  assert(paths.has(chapter.href), `Missing working day route ${chapter.href}`);
}
assert.equal(paths.size, pages.length, "Unique route paths");
assert.equal(pages.filter((p) => p.kind === "capability").length, 6);
for (const key of ["title", "heading", "description"])
  assert.equal(
    new Set(pages.map((p) => p[key])).size,
    pages.length,
    `Unique ${key}`,
  );
const text = JSON.stringify({ pages, settings, tiers });
assert(
  !/[$€£₹]\s*\d|\d\s*(?:USD|dollars)|lorem ipsum/i.test(text),
  "No public prices or filler",
);
assert.equal(settings.email, "contact@readymargin.com");
assert.equal(settings.credit.url, "https://www.linkedin.com/in/gursimarsandhu");
assert.equal(new Set(pages.map((p) => p.seoTitle || p.title)).size, pages.length);
for (const p of pages) {
  for (const link of p.related)
    assert(paths.has(link), `Missing related route ${link}`);
  if (p.kind === "capability") assert.equal(p.sections.length, 5);
  if (p.kind === "case") assert(p.status === "Illustrative workflow");
  if (p.kind === "article") {
    assert(p.category && p.author && p.takeaway);
    assert(p.related.some((r) => r.startsWith("/what-we-handle/")));
  }
}
for (const asset of [
  "favicon.ico",
  "favicon_16.png",
  "favicon_32.png",
  "favicon_48.png",
  "favicon_64.png",
  "favicon_180.png",
  "favicon_192.png",
  "favicon_512.png",
  "fonts/PlusJakartaSans-variable.ttf",
  "fonts/PlusJakartaSans-variable.woff2",
  "fonts/OFL.txt",
  "brand/logo_horizontal_primary_transparent.svg",
  "brand/logo_symbol_primary_dark.svg",
])
  assert(existsSync("public/" + asset), `Missing ${asset}`);
console.log(
  `PASS: ${pages.length + 1} routes, six capability families, unique metadata, linked related routes, honest examples, enquiry-only pricing, exact assets.`,
);
