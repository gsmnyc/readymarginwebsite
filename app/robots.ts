import type { MetadataRoute } from "next";
import { isProduction, siteOrigin } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction()
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
