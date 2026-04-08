"use client";

export default function BlogsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Blogs</h1>
        <p className="mt-1 text-sm text-muted">Manage blog posts</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
        <svg
          className="mb-3 h-12 w-12 text-muted/30"
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
        <p className="text-sm text-muted">Coming soon</p>
      </div>
    </div>
  );
}
