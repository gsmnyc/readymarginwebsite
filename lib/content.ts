import { z } from "zod";
import { cache } from "react";
import fallback from "@/content/site.json";
const sectionSchema = z.object({
  title: z.string(),
  body: z.string(),
  items: z.array(z.string()).default([]),
});
export const pageSchema = z.object({
  path: z.string().regex(/^\/[a-z0-9/-]+$/),
  title: z.string().min(5),
  seoTitle: z.string().optional(),
  heading: z.string().min(5),
  description: z.string().min(20),
  kind: z.enum([
    "editorial",
    "capability",
    "capability-index",
    "process",
    "rhythm",
    "implementation",
    "owner-view",
    "audience",
    "audience-index",
    "pricing",
    "comparison",
    "about",
    "platform",
    "workstreams",
    "security",
    "form",
    "thanks",
    "diagnostic",
    "cases",
    "case",
    "article",
    "articles",
    "guides",
    "checklists",
    "resources",
    "download",
    "campaign",
    "search",
    "legal",
  ]),
  sections: z.array(sectionSchema),
  published: z.boolean(),
  indexable: z.boolean(),
  publishedAt: z.string().default(""),
  updated: z.string(),
  related: z.array(z.string()).default([]),
  status: z.string().default(""),
  category: z.string().default(""),
  icon: z.string().default(""),
  takeaway: z.string().default(""),
  author: z.string().default(""),
  keyword: z.string().default(""),
});
export type Page = z.infer<typeof pageSchema>;
export type PageSummary = Pick<
  Page,
  | "path"
  | "title"
  | "heading"
  | "description"
  | "kind"
  | "category"
  | "keyword"
  | "indexable"
>;
export function summarizePage({
  path,
  title,
  heading,
  description,
  kind,
  category,
  keyword,
  indexable,
}: Page): PageSummary {
  return {
    path,
    title,
    heading,
    description,
    kind,
    category,
    keyword,
    indexable,
  };
}
export type Settings = typeof fallback.settings;
export type Tier = (typeof fallback.tiers)[number];
export type FaqItem = (typeof fallback.faqs)[number];
export type Content = {
  settings: Settings;
  pages: Page[];
  tiers: Tier[];
  faqs: FaqItem[];
};
const local: Content = {
  ...fallback,
  pages: fallback.pages.map((p) => pageSchema.parse(p)),
};
export const getContent = cache(async (): Promise<Content> => {
  const id = process.env.SANITY_PROJECT_ID,
    dataset = process.env.SANITY_DATASET;
  if (
    !id ||
    !dataset ||
    !/^[-a-z0-9]+$/.test(id) ||
    !/^[-a-z0-9]+$/.test(dataset)
  )
    return local;
  try {
    const query = encodeURIComponent(
      '{"pages":*[_type=="rmPage" && !(_id in path("drafts.**"))],"settings":*[_type=="rmSettings"][0],"tiers":*[_type=="rmTier"]|order(order asc),"faqs":*[_type=="rmFaq"]|order(order asc)}',
    );
    const res = await fetch(
      `https://${id}.api.sanity.io/v2026-01-01/data/query/${dataset}?perspective=published&query=${query}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return local;
    const { result } = (await res.json()) as {
      result: {
        pages: unknown;
        settings: Partial<Settings> | null;
        tiers: Tier[];
        faqs: FaqItem[];
      };
    };
    const remote = z.array(pageSchema).parse(result.pages);
    const byPath = new Map(local.pages.map((p) => [p.path, p]));
    remote.forEach((p) => byPath.set(p.path, p));
    return {
      settings: {
        ...local.settings,
        ...result.settings,
        workingDay: result.settings?.workingDay?.length === 3 && result.settings.workingDay.every((chapter) =>
          Object.values(chapter).every((value) => typeof value === "string") &&
          Object.keys(local.settings.workingDay[0]).every((key) => key in chapter) &&
          byPath.get(chapter.href)?.published,
        ) ? result.settings.workingDay : local.settings.workingDay,
        experiments: [],
      },
      pages: [...byPath.values()].filter((p) => p.published),
      tiers: result.tiers?.length ? result.tiers : local.tiers,
      faqs: result.faqs?.length ? result.faqs : local.faqs,
    };
  } catch {
    return local;
  }
});
export const siteOrigin = () => {
  const configured = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  return configured || "https://readymargin.com";
};
export const isProduction = () => process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.SITE_ENV === "production";
