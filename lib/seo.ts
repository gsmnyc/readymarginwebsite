import type { Metadata } from "next";
import type { Page } from "./content";
import { siteOrigin, isProduction } from "./content";

export function metadataFor(
  p: Pick<Page, "title" | "description" | "path" | "indexable"> & { kind: string; seoTitle?: string },
): Metadata {
  const url = siteOrigin() + p.path;
  const searchTitle = p.seoTitle || p.title;
  const title = searchTitle.includes("| Ready Margin") ? searchTitle : `${searchTitle} | Ready Margin`;
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
      images: [{
        url: `${siteOrigin()}/social/${p.kind === "article" ? "insights.jpg" : ["capability", "service", "service-hub"].includes(p.kind) ? "services.png" : "brand.png"}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.description,
      images: [`${siteOrigin()}/social/${p.kind === "article" ? "insights.jpg" : ["capability", "service", "service-hub"].includes(p.kind) ? "services.png" : "brand.png"}`],
    },
  };
}

export function pageSchemaData(p: Page) {
  const origin = siteOrigin();
  const crumbs = p.path.split("/").filter(Boolean);
  const isNewYorkPage = p.path === "/new-york" || p.path.startsWith("/new-york/");
  const isServicePage = p.kind === "capability" || p.kind === "service" || p.kind === "service-hub" || isNewYorkPage;
  const organization = {
    "@type": "Organization",
    "@id": origin + "/#organization",
    name: "Ready Margin",
    legalName: "GSM Consultants Inc.",
    url: origin,
  };
  const base: Record<string, unknown>[] = [{
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
  }];

  if (isServicePage) {
    const serviceId = origin + p.path + "/#service";
    base.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": serviceId,
      name: p.title,
      serviceType: p.serviceType || p.title,
      description: p.description,
      provider: organization,
      url: origin + p.path,
      areaServed: isNewYorkPage
        ? [
            { "@type": "State", name: "New York" },
            { "@type": "City", name: "New York City" },
          ]
        : { "@type": "Country", name: "United States" },
      audience: { "@type": "BusinessAudience", audienceType: "Restaurant owners and operators" },
      category: "Managed restaurant financial operations",
      termsOfService: origin + "/terms",
    });
    base.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": origin + p.path + "/#webpage",
      name: p.title,
      description: p.description,
      url: origin + p.path,
      about: [
        { "@id": serviceId },
        ...p.queries.map((name) => ({ "@type": "Thing", name })),
      ],
      mainEntity: { "@id": serviceId },
      isPartOf: { "@id": origin + "/#website" },
    });
  }

  if (p.kind === "article") {
    base.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": origin + p.path + "/#article",
      headline: p.heading,
      description: p.description,
      datePublished: p.publishedAt || p.updated,
      dateModified: p.updated,
      author: { ...organization, name: p.author || "Ready Margin editorial" },
      publisher: organization,
      mainEntityOfPage: origin + p.path,
      about: p.keyword ? p.keyword.split(", ").map((name) => ({ "@type": "Thing", name })) : undefined,
    });
  }

  if (p.kind === "answer") {
    base.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": origin + p.path + "/#webpage",
      name: p.title,
      description: p.description,
      url: origin + p.path,
      about: p.queries.map((name) => ({ "@type": "Thing", name })),
      mainEntity: {
        "@type": "Question",
        name: p.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: p.answer,
          url: origin + p.path,
          author: organization,
        },
      },
    });
  }

  return base;
}
