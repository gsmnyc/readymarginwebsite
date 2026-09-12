import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import content from "../content/site.json" with { type: "json" };
import searchContent from "../content/search-pages.json" with { type: "json" };

const run = (env) =>
  spawnSync(process.execPath, ["scripts/submit-indexnow.mjs"], {
    encoding: "utf8",
    env: { ...process.env, ...env },
  });

const skipped = run({ INDEXNOW_ENABLED: "false", VERCEL_ENV: "production" });
assert.equal(skipped.status, 0);
assert.match(skipped.stdout, /skipped/);

const dry = run({
  INDEXNOW_ENABLED: "true",
  INDEXNOW_DRY_RUN: "true",
  VERCEL_ENV: "production",
  SITE_URL: "https://readymargin.com",
});
assert.equal(dry.status, 0);
const payload = JSON.parse(dry.stdout);
assert.equal(payload.host, "readymargin.com");
assert.equal(
  payload.keyLocation,
  "https://readymargin.com/66eeb2baaca24bc4b9ca1da852de3551.txt",
);
const expectedPaths = new Set([
  ...content.pages
    .filter((page) => page.published && page.indexable)
    .map((page) => page.path),
  ...searchContent.pages.map((page) => page.path),
]);
assert.equal(payload.urlList.length, expectedPaths.size + 1);
for (const page of searchContent.pages)
  assert(
    payload.urlList.includes("https://readymargin.com" + page.path),
    `Missing IndexNow URL ${page.path}`,
  );
assert(
  payload.urlList.every(
    (url) =>
      url === "https://readymargin.com" ||
      url.startsWith("https://readymargin.com/"),
  ),
);
console.log("PASS: IndexNow includes canonical core and search-authority routes.");
