import type { MetadataRoute } from "next";
import { getContent, siteOrigin, isProduction } from "@/lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isProduction()) return [];
  const c = await getContent();
  return [
    { url: siteOrigin(), changeFrequency: "monthly", priority: 1 },
    ...c.pages
      .filter((p) => p.published && p.indexable)
      .map((p) => ({
        url: siteOrigin() + p.path,
        lastModified: p.updated,
        changeFrequency: "monthly" as const,
        priority: p.kind === "capability" ? 0.8 : 0.6,
      })),
  ];
}
