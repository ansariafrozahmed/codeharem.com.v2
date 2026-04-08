import type { MetadataRoute } from "next";
import { siteConfig, robotsConfig } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [...robotsConfig.allowPaths],
        disallow: [...robotsConfig.disallowPaths],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
