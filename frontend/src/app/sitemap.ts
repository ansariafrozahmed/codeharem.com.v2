import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/constants";
import { siteConfig } from "@/config/seo";

const BASE_URL = siteConfig.url;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface SitemapEntry {
  slug: string;
  updatedAt: string;
}

async function fetchPaginatedSlugs(endpoint: string): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(`${API_URL}/${endpoint}?limit=50`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();

    const key = endpoint === "blogs" ? "blogs" : "components";
    const entries: SitemapEntry[] = data[key].map(
      (item: { slug: string; updatedAt: string }) => ({
        slug: item.slug,
        updatedAt: item.updatedAt,
      }),
    );

    for (let page = 2; page <= data.totalPages; page++) {
      const pageRes = await fetch(
        `${API_URL}/${endpoint}?limit=50&page=${page}`,
        { next: { revalidate: 3600 } },
      );
      if (!pageRes.ok) break;
      const pageData = await pageRes.json();
      for (const item of pageData[key]) {
        entries.push({ slug: item.slug, updatedAt: item.updatedAt });
      }
    }

    return entries;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [components, blogs] = await Promise.all([
    fetchPaginatedSlugs("components"),
    fetchPaginatedSlugs("blogs"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/component`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/playground`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/component?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const componentPages: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${BASE_URL}/component/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...componentPages, ...blogPages];
}
