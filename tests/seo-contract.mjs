import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import content from "../content/site.json" with { type: "json" };

const dir = await mkdtemp(tmpdir() + "/rm-seo-");
async function load(entry, name) {
  const out = dir + "/" + name + ".mjs";
  await build({
    entryPoints: [entry],
    outfile: out,
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "bundle",
  });
  return import(pathToFileURL(out));
}

process.env.SITE_ENV = "production";
process.env.SITE_URL = "https://readymargin.com";
delete process.env.VERCEL_ENV;
delete process.env.SANITY_PROJECT_ID;
delete process.env.SANITY_DATASET;

const robots = (await load("app/robots.ts", "robots")).default;
const sitemap = (await load("app/sitemap.ts", "sitemap")).default;
const { metadataFor, pageSchemaData } = await load("lib/seo.ts", "seo");
const llms = await load("app/llms.txt/route.ts", "llms");

const robotRules = robots().rules;
assert(Array.isArray(robotRules));
for (const agent of ["*", "OAI-SearchBot", "PerplexityBot"]) {
  const rule = robotRules.find((item) => item.userAgent === agent);
  assert(rule, `Missing crawler rule for ${agent}`);
  assert.equal(rule.allow, "/");
  assert.deepEqual(rule.disallow, ["/api/"]);
}

const indexable = content.pages.filter((page) => page.published && page.indexable);
const map = await sitemap();
assert.equal(map.length, indexable.length + 1);
assert(
  map.every(
    (item) =>
      item.url === "https://readymargin.com" ||
      item.url.startsWith("https://readymargin.com/"),
  ),
);
assert.equal(new Set(map.map((item) => item.url)).size, map.length);

for (const page of indexable) {
  const metadata = metadataFor(page);
  assert.equal(metadata.robots?.index, true, `Indexable page has noindex: ${page.path}`);
  assert.equal(metadata.alternates?.canonical, "https://readymargin.com" + page.path);
  if (page.kind === "article") {
    const article = pageSchemaData(page).find((item) => item["@type"] === "Article");
    assert(article, `Missing Article schema: ${page.path}`);
    assert.equal(article.datePublished, page.publishedAt);
    assert.equal(article.dateModified, page.updated);
  }
}

const llmsResponse = await llms.GET();
const llmsText = await llmsResponse.text();
assert.equal(llmsResponse.headers.get("X-Robots-Tag"), "noindex, follow");
for (const page of indexable.filter((page) => page.kind === "capability" || page.kind === "article"))
  assert(llmsText.includes("https://readymargin.com" + page.path));

await rm(dir, { recursive: true, force: true });
console.log(
  `PASS: canonical host, ${map.length} sitemap URLs, explicit search/answer-engine crawler rules, article dates and content-derived llms.txt.`,
);
