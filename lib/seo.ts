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
  const isNewYorkPage = p.path === "/new-york" || p.path.startsWith("/new-york/");
  const isServicePage = p.kind === "capability" || isNewYorkPage;
  const base: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        ...crumbs.map((name, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: index === crumbs.length - 1 ? p.title : name.replaceAll("-", " "),
          item: origin + "/" + crumbs.slice(0, index + 1).join("/"),
        })),
      ],
    },
  ];

  if (isServicePage)
    base.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": origin + p.path + "/#service",
      name: p.title,
      serviceType: p.serviceType || p.title,
      description: p.description,
      provider: {
        "@type": "Organization",
        "@id": origin + "/#organization",
        name: "Ready Margin",
        url: origin,
      },
      url: origin + p.path,
      ...(isNewYorkPage
        ? {
            areaServed: [
              { "@type": "State", name: "New York" },
              { "@type": "City", name: "New York City" },
            ],
          }
        : {}),
    });

  if (p.kind === "article")
    base.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": origin + p.path + "/#article",
      headline: p.heading,
      description: p.description,
      datePublished: p.publishedAt || p.updated,
      dateModified: p.updated,
      author: {
        "@type": "Organization",
        name: p.author || "Ready Margin editorial",
        url: origin,
      },
      publisher: {
        "@type": "Organization",
        "@id": origin + "/#organization",
        name: "Ready Margin",
      },
      mainEntityOfPage: origin + p.path,
      about: p.keyword
        ? p.keyword.split(", ").map((name) => ({ "@type": "Thing", name }))
        : undefined,
    });

  return base;
}
