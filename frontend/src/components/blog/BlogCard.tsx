import Link from "next/link";
import type { BlogData } from "@/lib/services/blog.service";

interface Props {
  blog: BlogData;
}

export default function BlogCard({ blog }: Props) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_60px_-15px_rgba(66,152,114,0.15)]"
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-dark-accent/30 to-accent/5">
            <svg
              className="h-10 w-10 text-accent/20"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-0" />

        {/* Category badge */}
        <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-md capitalize">
          {blog.category}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5">
        {/* Accent line */}
        <div className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500 ease-out group-hover:w-full" />

        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <time>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <span className="flex items-center gap-1">
            <svg
              className="h-3 w-3"
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
            {blog.views}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold text-white transition-colors duration-300 group-hover:text-accent">
          {blog.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#333] px-2 py-0.5 text-[10px] text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        {blog.author && (
          <div className="mt-4 flex items-center gap-2">
            {blog.author.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="h-5 w-5 rounded-full ring-1 ring-white/10"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent">
                {blog.author.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[11px] text-gray-500">
              {blog.author.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
