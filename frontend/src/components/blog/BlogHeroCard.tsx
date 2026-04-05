import Link from "next/link";
import type { BlogData } from "@/lib/services/blog.service";

interface Props {
  blog: BlogData;
}

export default function BlogHeroCard({ blog }: Props) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_60px_-15px_rgba(66,152,114,0.15)]"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:w-3/5">
          {blog.featuredImage ? (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-dark-accent/40 to-accent/10">
              <svg
                className="h-16 w-16 text-accent/30"
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
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]/80 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent lg:hidden" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center p-6 lg:p-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent capitalize">
              {blog.category}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-accent lg:text-3xl">
            {blog.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-400 lg:text-base">
            {blog.excerpt}
          </p>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#333] px-2.5 py-0.5 text-[11px] text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author + Meta */}
          <div className="mt-6 flex items-center justify-between">
            {blog.author && (
              <div className="flex items-center gap-2.5">
                {blog.author.avatar ? (
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="h-8 w-8 rounded-full ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                    {blog.author.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-400">
                  {blog.author.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-gray-500">
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
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
