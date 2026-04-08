import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { BlogData } from "@/lib/services/blog.service";
import BlogContent from "./BlogContent";
import { buildMetadata, getBlogPostJsonLd } from "@/config/seo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchBlog(slug: string): Promise<BlogData | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);
  if (!blog) return { title: "Blog Post Not Found" };

  return buildMetadata({
    title: `${blog.title} - CodeHarem Blog`,
    description: blog.excerpt || `Read "${blog.title}" on CodeHarem Blog`,
    path: `/blog/${slug}`,
    ogType: "article",
    ...(blog.featuredImage ? { ogImage: blog.featuredImage } : {}),
    article: {
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      author: blog.author?.name,
      tags: blog.tags,
    },
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) notFound();

  // Increment views (fire and forget)
  fetch(`${API_URL}/blogs/${slug}/views`, { method: "POST" }).catch(() => {});

  const jsonLd = getBlogPostJsonLd({
    title: blog.title,
    excerpt: blog.excerpt,
    slug,
    featuredImage: blog.featuredImage,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    author: blog.author,
    tags: blog.tags,
  });

  return (
    <div className="mainContainer py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/blog"
          className="transition-colors hover:text-white"
        >
          Blog
        </Link>
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="truncate text-gray-300">{blog.title}</span>
      </nav>

      {/* Article */}
      <article className="mx-auto max-w-3xl">
        {/* Category + Date */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/blog?category=${blog.category}`}
            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent capitalize transition-colors hover:bg-accent/20"
          >
            {blog.category}
          </Link>
          <time className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            {blog.views} views
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            {blog.excerpt}
          </p>
        )}

        {/* Author */}
        {blog.author && (
          <div className="mt-6 flex items-center gap-3 border-b border-[#2a2a2a] pb-6">
            {blog.author.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="h-10 w-10 rounded-full ring-2 ring-white/10"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                {blog.author.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">
                {blog.author.name}
              </p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#2a2a2a]">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          <BlogContent content={blog.content} />
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-10 border-t border-[#2a2a2a] pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Tags:</span>
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="rounded-full border border-[#333] px-3 py-1 text-xs text-gray-400 transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 border-t border-[#2a2a2a] pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-accent"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
