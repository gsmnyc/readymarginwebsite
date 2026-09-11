import type { MetadataRoute } from "next";
import { isProduction, siteOrigin } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  const productionRules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/", disallow: ["/api/"] },
    { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/api/"] },
    { userAgent: "PerplexityBot", allow: "/", disallow: ["/api/"] },
  ];
  return {
    rules: isProduction()
      ? productionRules
      : { userAgent: "*", disallow: "/" },
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
