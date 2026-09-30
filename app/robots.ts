import type { MetadataRoute } from "next";
import { isProduction, siteOrigin } from "@/lib/content";
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const productionRules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/", disallow: ["/api/"] },
  ];

  return {
    rules: isProduction()
      ? productionRules
      : { userAgent: "*", disallow: "/" },
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
