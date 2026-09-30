import { spawn } from "node:child_process";
import { existsSync, lstatSync, renameSync, mkdirSync, writeFileSync, cpSync, rmSync } from "node:fs";
import path from "node:path";

// Keep the normal Next.js server deployment and its webhook API intact.
// Sites serves the static page export and a visitor-controlled email enquiry.
const api = path.resolve("app/api/review/route.ts");
const excludedApi = api + ".sites-excluded";
// Public Sites deployments must be crawlable. Explicit preview exports stay private
// to search engines; the chosen mode also overrides an inherited Vercel mode.
const siteMode = process.argv.includes("--preview") ? "preview" : "production";
if (!existsSync(api) && existsSync(excludedApi)) renameSync(excludedApi, api);
if (existsSync(excludedApi)) throw new Error("The temporary Sites API path already exists.");
renameSync(api, excludedApi);
try {
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], {
      stdio: "inherit",
      env: { ...process.env, RM_SITES_EXPORT: "1", NEXT_PUBLIC_ENQUIRY_MODE: "email", NEXT_TELEMETRY_DISABLED: "1", SITE_ENV: siteMode, VERCEL_ENV: siteMode, ...(process.argv[2] && !process.argv[2].startsWith("--") ? { SITE_URL: process.argv[2] } : {}) },
    });
    child.on("error", reject);
    child.on("exit", resolve);
  });
  if (code !== 0) throw new Error(`Sites export failed (${code}).`);
  // Next uses a custom distDir as the export destination. Normalize it to
  // the portable static root declared in the Sites hosting manifest.
  if (!existsSync(".next-sites/index.html")) throw new Error("Missing Sites export index.html.");
  const output = path.resolve("out");
  if (existsSync(output) && lstatSync(output).isSymbolicLink()) throw new Error("Static output must be a regular directory.");
  rmSync(output, { recursive: true, force: true });
  cpSync(".next-sites", output, { recursive: true });
  const aliases = { "/products": "/what-we-handle", "/book-a-demo": "/book-a-review", "/blog": "/insights", "/resources/podcast": "/resources", "/new-york-restaurant-bookkeeping": "/new-york/restaurant-bookkeeping-services" };
  for (const [from, to] of Object.entries(aliases)) {
    const filename = path.resolve("out", from.slice(1) + ".html");
    mkdirSync(path.dirname(filename), { recursive: true });
    writeFileSync(filename, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${to}"><title>Continue to Ready Margin</title></head><body><a href="${to}">Continue to Ready Margin</a></body></html>`);
  }
  console.log("Sites export ready in out/. Enquiries use a prepared email draft.");
} finally {
  renameSync(excludedApi, api);
}
