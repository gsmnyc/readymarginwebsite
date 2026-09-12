import { readFileSync } from "node:fs";

const key = "66eeb2baaca24bc4b9ca1da852de3551";
const enabled = process.env.INDEXNOW_ENABLED === "true";
const production = process.env.VERCEL_ENV === "production" || process.env.SITE_ENV === "production";
const legacyRedirectPaths = new Set(["/new-york-restaurant-bookkeeping"]);

if (!enabled || !production) {
  console.log("IndexNow skipped outside an enabled production build.");
} else {
  const origin = new URL(process.env.SITE_URL || "https://www.readymargin.com");
  if (origin.hostname === "readymargin.com") origin.hostname = "www.readymargin.com";
  if (origin.protocol !== "https:" || origin.hostname !== "www.readymargin.com") {
    console.warn("IndexNow skipped because SITE_URL is not the canonical HTTPS host.");
  } else {
    const read = (name) => JSON.parse(readFileSync(new URL(`../content/${name}`, import.meta.url), "utf8"));
    const site = read("site.json");
    const generated = [
      read("search-pages.json"),
      read("service-pages.json"),
      read("solution-pages.json"),
      read("answer-pages.json"),
    ];
    const canonicalPaths = new Set([
      ...site.pages.filter((page) => page.published && page.indexable && !legacyRedirectPaths.has(page.path)).map((page) => page.path),
      ...generated.flatMap((group) => group.pages.map((page) => page.path)),
    ]);
    const urlList = [origin.origin, ...[...canonicalPaths].map((path) => origin.origin + path)];
    const payload = { host: origin.hostname, key, keyLocation: origin.origin + "/" + key + ".txt", urlList };
    if (process.env.INDEXNOW_DRY_RUN === "true") {
      console.log(JSON.stringify(payload));
    } else {
      try {
        const response = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(5000),
        });
        if (response.status === 200 || response.status === 202)
          console.log(`IndexNow accepted ${urlList.length} canonical URLs (${response.status}).`);
        else console.warn(`IndexNow did not accept this notification (${response.status}).`);
      } catch {
        console.warn("IndexNow notification could not be sent; the build will continue.");
      }
    }
  }
}
