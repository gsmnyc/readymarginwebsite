import { readFileSync, writeFileSync } from "node:fs";
const c = JSON.parse(
  readFileSync(new URL("../content/site.json", import.meta.url), "utf8"),
);
let key = 0;
function keys(value) {
  if (Array.isArray(value))
    return value.map((v) =>
      v && typeof v === "object" ? { _key: `item-${key++}`, ...keys(v) } : v,
    );
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, keys(v)]),
    );
  return value;
}
const records = [
  { _id: "rm-settings", _type: "rmSettings", ...keys(c.settings) },
  ...c.pages.map((p) => ({
    _id: "page-" + p.path.slice(1).replaceAll("/", "-"),
    _type: "rmPage",
    ...keys(p),
  })),
  ...c.tiers.map((p, i) => ({
    _id: "tier-" + p.name.toLowerCase(),
    _type: "rmTier",
    order: i,
    ...keys(p),
  })),
  ...c.faqs.map((p, i) => ({
    _id: "faq-" + i,
    _type: "rmFaq",
    order: i,
    ...keys(p),
  })),
];
if (process.argv.includes("--export")) {
  writeFileSync(
    "sanity/seed.ndjson",
    records.map((r) => JSON.stringify(r)).join("\n"),
  );
  console.log("Exported Sanity import records.");
  process.exit(0);
}
const {
  SANITY_PROJECT_ID: id,
  SANITY_DATASET: dataset = "production",
  SANITY_WRITE_TOKEN: token,
} = process.env;
if (!id || !token)
  throw new Error(
    "Set SANITY_PROJECT_ID, SANITY_DATASET and SANITY_WRITE_TOKEN. Use --export for a local import file.",
  );
const r = await fetch(
  `https://${id}.api.sanity.io/v2026-01-01/data/mutate/${dataset}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: records.map((r) => ({ createIfNotExists: r })),
    }),
  },
);
if (!r.ok)
  throw new Error(`CMS import failed (${r.status}); no credentials printed.`);
console.log("Content imported without overwriting existing documents.");
