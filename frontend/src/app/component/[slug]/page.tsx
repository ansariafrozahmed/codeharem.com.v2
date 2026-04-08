import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentData } from "@/lib/services/component.service";
import ComponentDetailClient from "./ComponentDetailClient";
import { buildMetadata, getComponentJsonLd } from "@/config/seo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchComponent(slug: string): Promise<ComponentData | null> {
  try {
    const res = await fetch(`${API_URL}/components/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = await fetchComponent(slug);
  if (!component) return { title: "Component Not Found" };

  return buildMetadata({
    title: `${component.title} - CodeHarem`,
    description: `A ${component.category} component built with ${component.styling === "tailwind" ? "Tailwind CSS" : "CSS"} by ${component.author?.name || "Anonymous"}`,
    path: `/component/${slug}`,
    ogType: "article",
  });
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const component = await fetchComponent(slug);

  if (!component) notFound();

  // Increment views (fire and forget)
  fetch(`${API_URL}/components/${slug}/views`, { method: "POST" }).catch(() => {});

  const jsonLd = getComponentJsonLd({
    title: component.title,
    slug,
    category: component.category,
    styling: component.styling,
    createdAt: component.createdAt,
    author: component.author,
  });

  return (
    <div className="mainContainer py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/component" className="hover:text-white transition-colors">
          Components
        </Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <Link
          href={`/component?category=${component.category}`}
          className="capitalize hover:text-white transition-colors"
        >
          {component.category}
        </Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-300 truncate">{component.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {component.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent capitalize">
              {component.category}
            </span>
            <span className="rounded-full border border-[#333] px-3 py-1 text-xs text-gray-400">
              {component.styling === "tailwind" ? "Tailwind CSS" : "CSS"}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {component.views} views
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {component.likes} likes
            </span>
          </div>
        </div>

        {/* Author */}
        {component.author && (
          <div className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3">
            {component.author.avatar ? (
              <img
                src={component.author.avatar}
                alt={component.author.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                {component.author.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">
                {component.author.name}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(component.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Client part: Preview + Code tabs */}
      <ComponentDetailClient component={component} />
    </div>
  );
}
