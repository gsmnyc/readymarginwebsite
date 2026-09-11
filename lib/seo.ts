import type { Metadata } from "next";
import type { Page } from "./content";
import { siteOrigin, isProduction } from "./content";
export function metadataFor(
  p: Pick<Page, "title" | "description" | "path" | "indexable"> & {
    kind: string;
    seoTitle?: string;
  },
): Metadata {
  const url = siteOrigin() + p.path;
  const searchTitle = p.seoTitle || p.title;
  const title = searchTitle.includes("| Ready Margin")
    ? searchTitle
    : `${searchTitle} | Ready Margin`;
  return {
    title: { absolute: title },
    description: p.description,
    alternates: { canonical: url },
    robots: { index: isProduction() && p.indexable, follow: true },
    openGraph: {
      title,
      description: p.description,
      url,
      siteName: "Ready Margin",
      type: p.kind === "article" ? "article" : "website",
      images: [
        {
          url: `${siteOrigin()}/social/${p.kind === "article" ? "insights.jpg" : p.kind === "capability" ? "services.png" : "brand.png"}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.description,
      images: [
        `${siteOrigin()}/social/${p.kind === "article" ? "insights.jpg" : p.kind === "capability" ? "services.png" : "brand.png"}`,
      ],
    },
  };
}
export function pageSchemaData(p: Page) {
  const origin = siteOrigin();
  const crumbs = p.path.split("/").filter(Boolean);
  const base: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        ...crumbs.map((n, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: i === crumbs.length - 1 ? p.title : n.replaceAll("-", " "),
          item: origin + "/" + crumbs.slice(0, i + 1).join("/"),
        })),
      ],
    },
  ];
  if (p.kind === "capability" || p.path === "/new-york-restaurant-bookkeeping")
    base.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: p.title,
      description: p.description,
      provider: { "@type": "Organization", "@id": origin + "/#organization", name: "Ready Margin" },
      url: origin + p.path,
      ...(p.path === "/new-york-restaurant-bookkeeping"
        ? { areaServed: { "@type": "AdministrativeArea", name: "New York" } }
        : {}),
    });
  if (p.kind === "article")
    base.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.heading,
      description: p.description,
      datePublished: p.updated,
      dateModified: p.updated,
      author: { "@type": "Organization", name: p.author },
      publisher: { "@type": "Organization", "@id": origin + "/#organization", name: "Ready Margin" },
      mainEntityOfPage: origin + p.path,
    });
  return base;
}
