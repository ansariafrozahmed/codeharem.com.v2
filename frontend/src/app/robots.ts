import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/settings", "/my-components", "/auth/"],
      },
    ],
    sitemap: "https://codeharem.com/sitemap.xml",
  };
}
