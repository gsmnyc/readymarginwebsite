import { readFileSync } from "node:fs";

const key = "66eeb2baaca24bc4b9ca1da852de3551";
const enabled = process.env.INDEXNOW_ENABLED === "true";
const production =
  process.env.VERCEL_ENV === "production" || process.env.SITE_ENV === "production";

if (!enabled || !production) {
  console.log("IndexNow skipped outside an enabled production build.");
} else {
  const origin = new URL(process.env.SITE_URL || "https://readymargin.com");
  if (origin.protocol !== "https:" || origin.hostname !== "readymargin.com") {
    console.warn("IndexNow skipped because SITE_URL is not the canonical HTTPS host.");
  } else {
    const { pages } = JSON.parse(
      readFileSync(new URL("../content/site.json", import.meta.url), "utf8"),
    );
    const urlList = [
      origin.origin,
      ...pages
        .filter((page) => page.published && page.indexable)
        .map((page) => origin.origin + page.path),
    ];
    const payload = {
      host: origin.hostname,
      key,
      keyLocation: origin.origin + "/" + key + ".txt",
      urlList,
    };
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
