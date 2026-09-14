import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import content from "../content/site.json" with { type: "json" };
import searchContent from "../content/search-pages.json" with { type: "json" };
import serviceContent from "../content/service-pages.json" with { type: "json" };
import solutionContent from "../content/solution-pages.json" with { type: "json" };
import answerContent from "../content/answer-pages.json" with { type: "json" };
import nycIntentContent from "../content/nyc-intent-pages.json" with { type: "json" };

const generatedGroups = [searchContent, serviceContent, solutionContent, answerContent, nycIntentContent];
const dir = await mkdtemp(tmpdir() + "/rm-seo-");
const homeSource = await readFile("app/page.tsx", "utf8");
const homeTitle = homeSource.match(/title: "([^"]+)"/)?.[1];
const homeDescription = homeSource.match(/description: "([^"]+)"/)?.[1];
assert(homeTitle && homeDescription, "Homepage search metadata must remain explicit.");
assert((homeTitle + " | Ready Margin").length >= 50 && (homeTitle + " | Ready Margin").length <= 60, "Homepage title should fit an unclipped search result.");
assert(homeDescription.length >= 120 && homeDescription.length <= 160, "Homepage description should fit a useful search snippet.");
async function load(entry, name) {
  const out = dir + "/" + name + ".mjs";
  await build({ entryPoints: [entry], outfile: out, bundle: true, platform: "node", format: "esm", packages: "bundle" });
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
const { getContent, siteOrigin } = await load("lib/content.ts", "content");

assert.equal(siteOrigin(), "https://www.readymargin.com", "Apex configuration must normalize to the public www host");

const robotRules = robots().rules;
assert(Array.isArray(robotRules));
for (const agent of [
  "*",
  "Googlebot",
  "bingbot",
  "Applebot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
]) {
  const rule = robotRules.find((item) => item.userAgent === agent);
  assert(rule, `Missing crawler rule for ${agent}`);
  assert.equal(rule.allow, "/");
  assert.deepEqual(rule.disallow, ["/api/"]);
}

const merged = await getContent();
const indexable = merged.pages.filter((page) => page.published && page.indexable);
const map = await sitemap();
assert.equal(map.length, indexable.length + 1);
assert(map.every((item) => item.url === "https://www.readymargin.com" || item.url.startsWith("https://www.readymargin.com/")));
assert.equal(new Set(map.map((item) => item.url)).size, map.length);

for (const page of indexable) {
  const metadata = metadataFor(page);
  assert.equal(metadata.robots?.index, true, `Indexable page has noindex: ${page.path}`);
  assert.equal(metadata.alternates?.canonical, "https://www.readymargin.com" + page.path);

  if (page.kind === "article") {
    const article = pageSchemaData(page).find((item) => item["@type"] === "Article");
    assert(article, `Missing Article schema: ${page.path}`);
    assert.equal(article.datePublished, page.publishedAt || page.updated);
    assert.equal(article.dateModified, page.updated);
  }

  if (["service", "service-hub", "capability"].includes(page.kind)) {
    const schemas = pageSchemaData(page);
    const service = schemas.find((item) => item["@type"] === "Service");
    const webpage = schemas.find((item) => item["@type"] === "WebPage");
    assert(service, `Missing Service schema: ${page.path}`);
    assert(webpage, `Missing service WebPage schema: ${page.path}`);
    assert.equal(service.provider["@id"], "https://www.readymargin.com/#organization");
    assert.equal(service.provider.legalName, "Ready Margin Inc");
    assert.equal(webpage.mainEntity["@id"], service["@id"]);
    if (page.path === "/new-york" || page.path.startsWith("/new-york/")) assert(Array.isArray(service.areaServed));
  }

  if (page.kind === "answer") {
    const schemas = pageSchemaData(page);
    assert(!schemas.some((item) => item["@type"] === "QAPage"), `Authored answer must not use QAPage: ${page.path}`);
    const webpage = schemas.find((item) => item["@type"] === "WebPage");
    assert(webpage, `Missing WebPage schema: ${page.path}`);
    assert.equal(webpage.mainEntity["@type"], "Question");
    assert.equal(webpage.mainEntity.acceptedAnswer["@type"], "Answer");
    assert.equal(webpage.mainEntity.acceptedAnswer.text, page.answer);
  }
}

const llmsResponse = await llms.GET();
const llmsText = await llmsResponse.text();
assert.equal(llmsResponse.headers.get("X-Robots-Tag"), "noindex, follow");
for (const page of indexable.filter((page) =>
  ["capability", "service", "service-hub", "solution", "solution-hub", "answer", "article", "process", "rhythm", "implementation", "owner-view", "audience"].includes(page.kind) ||
  page.path === "/new-york" || page.path.startsWith("/new-york/"),
)) {
  assert(llmsText.includes("https://www.readymargin.com" + page.path), `Missing llms.txt URL ${page.path}`);
}

for (const group of generatedGroups) {
  for (const raw of group.pages) {
    const page = merged.pages.find((item) => item.path === raw.path);
    assert(page, `Generated intent page was not integrated: ${raw.path}`);
    assert(page.indexable && page.published);
    assert(page.answer.length >= 80, `Answer-first copy is too thin: ${raw.path}`);
  }
}

for (const expected of [
  "/new-york/restaurant-accounting-payroll-services",
  "/new-york/restaurant-financial-reporting-services",
  "/new-york/restaurant-finance-solutions",
  "/new-york/restaurant-cfo-services",
  "/new-york/restaurant-turnaround-consulting",
  "/new-york/restaurant-food-cost-inventory-services",
  "/new-york/restaurant-tax-compliance-support",
  "/new-york/multi-location-restaurant-finance-services",
]) {
  const page = merged.pages.find((item) => item.path === expected);
  assert(page, `Missing priority NYC intent page: ${expected}`);
  assert(page.queries.length >= 5, `Priority NYC page needs query coverage: ${expected}`);
  assert(llmsText.includes("https://www.readymargin.com" + expected), `Priority NYC page missing from llms.txt: ${expected}`);
}

assert(content.pages.length < merged.pages.length);
await rm(dir, { recursive: true, force: true });
console.log(`PASS: ${map.length} canonical sitemap URLs, major crawler access, valid Service/WebPage/Article schema and full intent-family discovery.`);
