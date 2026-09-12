import { z } from "zod";
import { cache } from "react";
import fallback from "@/content/site.json";
import searchFallback from "@/content/search-pages.json";
import serviceFallback from "@/content/service-pages.json";
import solutionFallback from "@/content/solution-pages.json";
import answerFallback from "@/content/answer-pages.json";

const sectionSchema = z.object({
  title: z.string(),
  body: z.string(),
  items: z.array(z.string()).default([]),
});
const resourceSchema = z.object({
  url: z.string().url(),
  label: z.string().min(3),
});

export const pageSchema = z.object({
  path: z.string().regex(/^\/[a-z0-9/-]+$/),
  title: z.string().min(5),
  seoTitle: z.string().optional(),
  heading: z.string().min(5),
  description: z.string().min(20),
  kind: z.enum([
    "editorial", "capability", "capability-index", "process", "rhythm",
    "implementation", "owner-view", "audience", "audience-index", "pricing",
    "comparison", "about", "platform", "workstreams", "security", "form",
    "thanks", "diagnostic", "cases", "case", "article", "articles", "guides",
    "checklists", "resources", "download", "campaign", "search", "legal",
    "service", "service-hub", "solution", "solution-hub", "answer",
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
  queries: z.array(z.string()).default([]),
  answer: z.string().default(""),
  disclosure: z.string().default(""),
  resources: z.array(resourceSchema).default([]),
  serviceType: z.string().default(""),
});

export type Page = z.infer<typeof pageSchema>;
export type PageSummary = Pick<Page, "path" | "title" | "heading" | "description" | "kind" | "category" | "keyword" | "indexable">;
export function summarizePage({ path, title, heading, description, kind, category, keyword, indexable }: Page): PageSummary {
  return { path, title, heading, description, kind, category, keyword, indexable };
}

export type Settings = typeof fallback.settings;
export type Tier = (typeof fallback.tiers)[number];
export type FaqItem = (typeof fallback.faqs)[number];
export type Content = { settings: Settings; pages: Page[]; tiers: Tier[]; faqs: FaqItem[] };

const legacyRedirectPaths = new Set(["/new-york-restaurant-bookkeeping"]);

type GeneratedPage = {
  path: string; kind: string; title: string; seoTitle?: string; heading: string;
  description: string; eyebrow: string; answer: string; serviceType?: string;
  queries?: string[]; sections: { title: string; body: string; items: string[] }[];
  related: { path: string; label: string }[]; resources: { url: string; label: string }[];
  publishedAt?: string; author?: string; disclosure?: string;
};

function normalizeGenerated(page: GeneratedPage, updated: string, category: string): Page {
  return pageSchema.parse({
    path: page.path,
    title: page.title,
    seoTitle: page.seoTitle,
    heading: page.heading,
    description: page.description,
    kind: page.kind === "local-service" || page.kind === "local-hub" ? "service" : page.kind,
    sections: page.sections,
    published: true,
    indexable: true,
    publishedAt: page.publishedAt || "",
    updated,
    related: page.related.map((item) => item.path),
    status: page.eyebrow,
    category,
    icon: page.path.includes("payroll") || page.path.includes("tip") ? "tips" : "book",
    takeaway: page.answer,
    author: page.author || "",
    keyword: [page.title, page.serviceType, ...(page.queries || [])].filter(Boolean).join(", "),
    queries: page.queries || [],
    answer: page.answer,
    disclosure: page.disclosure || "",
    resources: page.resources,
    serviceType: page.serviceType || "",
  });
}

const searchPages = searchFallback.pages.map((page) => normalizeGenerated(
  page as GeneratedPage,
  searchFallback.updated,
  page.kind === "article" ? "Payroll and provider selection" : "New York restaurant services",
));
const servicePages = serviceFallback.pages.map((page) => normalizeGenerated(page as GeneratedPage, serviceFallback.updated, "Restaurant finance services"));
const solutionPages = solutionFallback.pages.map((page) => normalizeGenerated(page as GeneratedPage, solutionFallback.updated, "Restaurant finance solutions"));
const answerPages = answerFallback.pages.map((page) => normalizeGenerated(page as GeneratedPage, answerFallback.updated, "Restaurant finance answers"));

const local: Content = {
  ...fallback,
  pages: [
    ...fallback.pages.filter((page) => !legacyRedirectPaths.has(page.path)).map((page) => pageSchema.parse(page)),
    ...searchPages,
    ...servicePages,
    ...solutionPages,
    ...answerPages,
  ],
};

export const getContent = cache(async (): Promise<Content> => {
  const id = process.env.SANITY_PROJECT_ID, dataset = process.env.SANITY_DATASET;
  if (!id || !dataset || !/^[-a-z0-9]+$/.test(id) || !/^[-a-z0-9]+$/.test(dataset)) return local;
  try {
    const query = encodeURIComponent('{"pages":*[_type=="rmPage" && !(_id in path("drafts.**"))],"settings":*[_type=="rmSettings"][0],"tiers":*[_type=="rmTier"]|order(order asc),"faqs":*[_type=="rmFaq"]|order(order asc)}');
    const res = await fetch(`https://${id}.api.sanity.io/v2026-01-01/data/query/${dataset}?perspective=published&query=${query}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return local;
    const { result } = (await res.json()) as { result: { pages: unknown; settings: Partial<Settings> | null; tiers: Tier[]; faqs: FaqItem[] } };
    const remote = z.array(pageSchema).parse(result.pages);
    const byPath = new Map(local.pages.map((page) => [page.path, page]));
    remote.forEach((page) => { if (!legacyRedirectPaths.has(page.path)) byPath.set(page.path, page); });
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
      pages: [...byPath.values()].filter((page) => page.published),
      tiers: result.tiers?.length ? result.tiers : local.tiers,
      faqs: result.faqs?.length ? result.faqs : local.faqs,
    };
  } catch { return local; }
});

export const siteOrigin = () => {
  const configured = process.env.SITE_URL?.trim() || "https://www.readymargin.com";
  try {
    const url = new URL(configured);
    if (url.hostname === "readymargin.com") url.hostname = "www.readymargin.com";
    return url.origin;
  } catch {
    return "https://www.readymargin.com";
  }
};
export const isProduction = () => process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.SITE_ENV === "production";
