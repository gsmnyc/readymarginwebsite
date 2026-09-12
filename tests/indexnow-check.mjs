import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import content from "../content/site.json" with { type: "json" };
import searchContent from "../content/search-pages.json" with { type: "json" };
import serviceContent from "../content/service-pages.json" with { type: "json" };
import solutionContent from "../content/solution-pages.json" with { type: "json" };
import answerContent from "../content/answer-pages.json" with { type: "json" };

const generated = [searchContent, serviceContent, solutionContent, answerContent];
const legacyRedirectPaths = new Set(["/new-york-restaurant-bookkeeping"]);
const run = (env) => spawnSync(process.execPath, ["scripts/submit-indexnow.mjs"], { encoding: "utf8", env: { ...process.env, ...env } });

const skipped = run({ INDEXNOW_ENABLED: "false", VERCEL_ENV: "production" });
assert.equal(skipped.status, 0);
assert.match(skipped.stdout, /skipped/);

const preview = run({ INDEXNOW_ENABLED: "true", INDEXNOW_DRY_RUN: "true", VERCEL_ENV: "preview", SITE_ENV: "production" });
assert.equal(preview.status, 0);
assert.match(preview.stdout, /skipped/);
const invalid = run({ INDEXNOW_ENABLED: "true", INDEXNOW_DRY_RUN: "true", VERCEL_ENV: "production", SITE_URL: "invalid-url" });
assert.equal(invalid.status, 0);
assert.match(invalid.stderr, /SITE_URL is invalid/);

const dry = run({
  INDEXNOW_ENABLED: "true",
  INDEXNOW_DRY_RUN: "true",
  VERCEL_ENV: "production",
  SITE_URL: "https://readymargin.com",
});
assert.equal(dry.status, 0);
const payload = JSON.parse(dry.stdout);
assert.equal(payload.host, "www.readymargin.com");
assert.equal(payload.keyLocation, "https://www.readymargin.com/66eeb2baaca24bc4b9ca1da852de3551.txt");

const expectedPaths = new Set([
  ...content.pages.filter((page) => page.published && page.indexable && !legacyRedirectPaths.has(page.path)).map((page) => page.path),
  ...generated.flatMap((group) => group.pages.map((page) => page.path)),
]);
assert.equal(payload.urlList.length, expectedPaths.size + 1);
for (const path of expectedPaths) {
  assert(payload.urlList.includes("https://www.readymargin.com" + path), `Missing IndexNow URL ${path}`);
}
assert(!payload.urlList.includes("https://www.readymargin.com/new-york-restaurant-bookkeeping"), "Redirected legacy URL must not be submitted to IndexNow");
assert(payload.urlList.every((url) => url === "https://www.readymargin.com" || url.startsWith("https://www.readymargin.com/")));
console.log(`PASS: IndexNow includes ${expectedPaths.size} canonical content URLs and excludes redirects.`);
