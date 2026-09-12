import type { MetadataRoute } from "next";
import { isProduction, siteOrigin } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const allow = { allow: "/", disallow: ["/api/"] };
  const productionRules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", ...allow },
    { userAgent: "OAI-SearchBot", ...allow },
    { userAgent: "PerplexityBot", ...allow },
    { userAgent: "Claude-SearchBot", ...allow },
    { userAgent: "Claude-User", ...allow },
    { userAgent: "Googlebot", ...allow },
    { userAgent: "Bingbot", ...allow },
  ];
  return {
    rules: isProduction() ? productionRules : { userAgent: "*", disallow: "/" },
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
