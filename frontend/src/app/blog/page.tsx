import Link from "next/link";
import type { Metadata } from "next";
import type { BlogData } from "@/lib/services/blog.service";
import BlogHeroCard from "@/components/blog/BlogHeroCard";
import BlogCard from "@/components/blog/BlogCard";
import { buildMetadata, pagesSeo } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: pagesSeo.blog.title,
  description: pagesSeo.blog.description,
  path: "/blog",
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    search?: string;
    page?: string;
  }>;
}

interface ListResponse {
  blogs: BlogData[];
  total: number;
  page: number;
  totalPages: number;
}

async function fetchBlogs(
  category?: string,
  tag?: string,
  search?: string,
  page?: number
): Promise<ListResponse> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  if (search) params.set("search", search);
  if (page) params.set("page", String(page));
  params.set("limit", "13");

  const qs = params.toString();
  try {
    const res = await fetch(`${API_URL}/blogs${qs ? `?${qs}` : ""}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { blogs: [], total: 0, page: 1, totalPages: 0 };
    return res.json();
  } catch {
    return { blogs: [], total: 0, page: 1, totalPages: 0 };
  }
}

function Pagination({
  currentPage,
  totalPages,
  category,
  tag,
  search,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2 pt-10">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-9 items-center rounded-lg border border-[#333] px-3 text-sm text-gray-400 transition-colors hover:border-accent/40 hover:text-white"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          Prev
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-accent text-white"
                : "border border-[#333] text-gray-400 hover:border-accent/40 hover:text-white"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-9 items-center rounded-lg border border-[#333] px-3 text-sm text-gray-400 transition-colors hover:border-accent/40 hover:text-white"
        >
          Next
          <svg
            className="ml-1.5 h-4 w-4"
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
        </Link>
      )}
    </nav>
  );
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const tag = params.tag || undefined;
  const search = params.search || undefined;
  const page = params.page ? parseInt(params.page) : 1;

  const data = await fetchBlogs(category, tag, search, page);

  const [heroBlog, ...restBlogs] = data.blogs;

  return (
    <div className="mainContainer py-10 md:py-12 lg:py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-medium text-white md:text-4xl">Blog</h1>
        <p className="mt-2 text-gray-400">
          Articles about web development, UI design, and coding tips
        </p>
      </div>

      {/* Active filters */}
      {(category || tag || search) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          {category && (
            <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent capitalize">
              {category}
              <Link
                href={`/blog${tag ? `?tag=${tag}` : ""}${search ? `${tag ? "&" : "?"}search=${search}` : ""}`}
                className="ml-0.5 hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </span>
          )}
          {tag && (
            <span className="flex items-center gap-1.5 rounded-full border border-[#333] px-3 py-1 text-xs text-gray-400">
              #{tag}
              <Link
                href={`/blog${category ? `?category=${category}` : ""}${search ? `${category ? "&" : "?"}search=${search}` : ""}`}
                className="ml-0.5 hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </span>
          )}
          {search && (
            <span className="flex items-center gap-1.5 rounded-full border border-[#333] px-3 py-1 text-xs text-gray-400">
              &quot;{search}&quot;
              <Link
                href={`/blog${category ? `?category=${category}` : ""}${tag ? `${category ? "&" : "?"}tag=${tag}` : ""}`}
                className="ml-0.5 hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </span>
          )}
          <span className="text-gray-500">
            {data.total} result{data.total !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {data.blogs.length > 0 ? (
        <>
          {/* Hero / Featured Post */}
          {heroBlog && page === 1 && (
            <div className="mb-10">
              <BlogHeroCard blog={heroBlog} />
            </div>
          )}

          {/* Grid of remaining posts */}
          {(page === 1 ? restBlogs : data.blogs).length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(page === 1 ? restBlogs : data.blogs).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="mb-4 h-16 w-16 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">
            No blog posts found
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {search
              ? `No results for "${search}". Try a different search term.`
              : "Blog posts will appear here once published."}
          </p>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        category={category}
        tag={tag}
        search={search}
      />
    </div>
  );
}
