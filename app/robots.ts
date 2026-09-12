import type { MetadataRoute } from "next";
import { isProduction, siteOrigin } from "@/lib/content";

const discoveryAgents = [
  "Googlebot",
  "bingbot",
  "Applebot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
] as const;

export default function robots(): MetadataRoute.Robots {
  const productionRules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...discoveryAgents.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: ["/api/"],
    })),
  ];

  return {
    rules: isProduction()
      ? productionRules
      : { userAgent: "*", disallow: "/" },
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
