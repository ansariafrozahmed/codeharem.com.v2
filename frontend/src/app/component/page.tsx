import Link from "next/link";
import { CATEGORIES } from "@/constants";
import type { ComponentData } from "@/lib/services/component.service";
import SearchBar from "./SearchBar";
import ComponentGrid from "./ComponentGrid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

interface ListResponse {
  components: ComponentData[];
  total: number;
  page: number;
  totalPages: number;
}

async function fetchComponents(
  category?: string,
  search?: string,
  page?: number,
): Promise<ListResponse> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (page) params.set("page", String(page));
  params.set("limit", "18");

  const qs = params.toString();
  try {
    const res = await fetch(`${API_URL}/components${qs ? `?${qs}` : ""}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { components: [], total: 0, page: 1, totalPages: 0 };
    return res.json();
  } catch {
    return { components: [], total: 0, page: 1, totalPages: 0 };
  }
}

function Pagination({
  currentPage,
  totalPages,
  category,
  search,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
  search?: string;
}) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/component${qs ? `?${qs}` : ""}`;
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
        ),
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

export default async function ComponentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const search = params.search || undefined;
  const page = params.page ? parseInt(params.page) : 1;

  const data = await fetchComponents(category, search, page);

  return (
    <div className="mainContainer py-10 md:py-12 lg:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-white md:text-4xl">
          Components
        </h1>
        <p className="mt-2 text-gray-400">
          Browse {data.total > 0 ? data.total.toLocaleString() : ""}{" "}
          community-built components
        </p>
      </div>

      {/* Search - full width on top */}
      <div className="mb-8">
        <SearchBar defaultValue={search} category={category} />
      </div>

      {/* Mobile Category Pills */}
      <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
        <Link
          href={`/component${search ? `?search=${search}` : ""}`}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            !category
              ? "bg-accent text-white"
              : "border border-[#333] text-gray-400 hover:border-accent/40 hover:text-white"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/component?category=${cat}${search ? `&search=${search}` : ""}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              category === cat
                ? "bg-accent text-white"
                : "border border-[#333] text-gray-400 hover:border-accent/40 hover:text-white"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Sidebar + Content */}
      <div className="flex gap-8">
        {/* Left Sidebar - Categories (desktop only) */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Categories
          </h3>
          <nav className="flex flex-col gap-0.5">
            <Link
              href={`/component${search ? `?search=${search}` : ""}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                !category
                  ? "bg-accent/10 text-accent"
                  : "text-gray-400 hover:bg-[#242424] hover:text-white"
              }`}
            >
              All Components
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/component?category=${cat}${search ? `&search=${search}` : ""}`}
                className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  category === cat
                    ? "bg-accent/10 text-accent"
                    : "text-gray-400 hover:bg-[#242424] hover:text-white"
                }`}
              >
                {cat}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Right - Component Grid */}
        <div className="min-w-0 flex-1">
          {/* Active filter info */}
          {(category || search) && (
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-400">
              {category && (
                <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent capitalize">
                  {category}
                  <Link
                    href={`/component${search ? `?search=${search}` : ""}`}
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
                    href={`/component${category ? `?category=${category}` : ""}`}
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

          {data.components.length > 0 ? (
            <ComponentGrid components={data.components} />
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
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white">
                No components found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : category
                    ? `No components in the "${category}" category yet.`
                    : "Be the first to create a component!"}
              </p>
              <Link
                href="/create"
                className="mt-6 rounded-lg bg-gradient-to-r from-dark-accent to-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Create Component
              </Link>
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            category={category}
            search={search}
          />
        </div>
      </div>
    </div>
  );
}
