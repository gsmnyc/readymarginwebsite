import type { Metadata } from "next";
import type { Page } from "./content";
import { siteOrigin, isProduction } from "./content";

export function metadataFor(
  p: Pick<Page, "title" | "description" | "path" | "indexable"> & {
    kind: string;
    seoTitle?: string;
    canonicalPath?: string;
    publishedAt?: string;
    updated?: string;
  },
): Metadata {
  const origin = siteOrigin();
  const url = origin + (p.canonicalPath || p.path);
  const searchTitle = (p.seoTitle || p.title).trim();
  const title = searchTitle.endsWith("| Ready Margin") ? searchTitle : `${searchTitle} | Ready Margin`;
  const isArticle = p.kind === "article";
  const image = isArticle
    ? { file: "insights.jpg", width: 1536, height: 1024, alt: "Ready Margin restaurant finance guides" }
    : ["capability", "service", "service-hub"].includes(p.kind)
      ? { file: "services.png", width: 640, height: 612, alt: "Ready Margin restaurant finance services" }
      : { file: "brand.png", width: 1016, height: 240, alt: "Ready Margin" };
  const socialImage = `${origin}/social/${image.file}`;
  return {
    title: { absolute: title },
    description: p.description,
    alternates: { canonical: url },
    robots: { index: isProduction() && p.indexable, follow: true, googleBot: { index: isProduction() && p.indexable, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title,
      description: p.description,
      url,
      siteName: "Ready Margin",
      locale: "en_US",
      type: isArticle ? "article" : "website",
      ...(isArticle ? {
        publishedTime: p.publishedAt || p.updated || undefined,
        modifiedTime: p.updated || undefined,
      } : {}),
      images: [{
        url: socialImage,
        width: image.width,
        height: image.height,
        alt: image.alt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.description,
      images: [{ url: socialImage, alt: image.alt }],
    },
  };
}

export function pageSchemaData(p: Page, pages: Page[] = []) {
  const origin = siteOrigin();
  const parts = p.path.split("/").filter(Boolean);
  const crumbs = parts.map((name,index) => ({ name, path: "/" + parts.slice(0,index + 1).join("/") }))
    .filter(crumb => crumb.path === p.path || pages.some(page => page.path === crumb.path));
  const isNewYorkPage = p.path === "/new-york" || p.path.startsWith("/new-york/");
  const isServicePage = p.kind === "capability" || p.kind === "service" || p.kind === "service-hub" || isNewYorkPage;
  const organization = {
    "@type": "Organization",
    "@id": origin + "/#organization",
    name: "Ready Margin",
    legalName: "Ready Margin Inc",
    url: origin,
  };
  const url = origin + p.path;
  const base: Record<string, unknown>[] = [{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      ...crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.path === p.path ? p.title : pages.find(page => page.path === crumb.path)?.title || crumb.name.replaceAll("-", " "),
        item: origin + crumb.path,
      })),
    ],
  }];

  if (isServicePage) {
    const serviceId = url + "#service";
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
    });
  }

  base.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url + "#webpage",
    name: p.title,
    description: p.description,
    url,
    inLanguage: "en-US",
    dateModified: p.updated,
    isPartOf: { "@id": origin + "/#website" },
    publisher: organization,
    ...(isServicePage ? { mainEntity: { "@id": url + "#service" } } : {}),
    ...(p.kind === "article" ? { mainEntity: { "@id": url + "#article" } } : {}),
    ...(p.kind === "answer" && p.answer ? {
      mainEntity: { "@type": "Question", name: p.heading, acceptedAnswer: { "@type": "Answer", text: p.answer, url, author: organization } },
    } : {}),
  });

  if (p.kind === "article") {
    base.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": url + "#article",
      headline: p.heading,
      description: p.description,
      datePublished: p.publishedAt || p.updated,
      dateModified: p.updated,
      author: organization,
      publisher: organization,
      mainEntityOfPage: { "@id": url + "#webpage" },
      image: origin + "/social/insights.jpg",
      ...(p.takeaway ? { abstract: p.takeaway } : {}),
    });
  }

  if (p.faqs.length > 0) {
    base.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": url + "#faq",
      mainEntity: p.faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return base;
}
