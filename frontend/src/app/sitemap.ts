import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/constants";

const BASE_URL = "https://codeharem.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface SitemapComponent {
  slug: string;
  updatedAt: string;
}

async function getPublishedComponents(): Promise<SitemapComponent[]> {
  try {
    const res = await fetch(`${API_URL}/components?limit=50`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();

    // Fetch all pages
    const components: SitemapComponent[] = data.components.map(
      (c: { slug: string; updatedAt: string }) => ({
        slug: c.slug,
        updatedAt: c.updatedAt,
      }),
    );

    for (let page = 2; page <= data.totalPages; page++) {
      const pageRes = await fetch(
        `${API_URL}/components?limit=50&page=${page}`,
        { next: { revalidate: 3600 } },
      );
      if (!pageRes.ok) break;
      const pageData = await pageRes.json();
      for (const c of pageData.components) {
        components.push({ slug: c.slug, updatedAt: c.updatedAt });
      }
    }

    return components;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const components = await getPublishedComponents();

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
      url: `${BASE_URL}/playground`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
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

  return [...staticPages, ...categoryPages, ...componentPages];
}
