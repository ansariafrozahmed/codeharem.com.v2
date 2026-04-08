"use client";

export default function ComponentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Components</h1>
        <p className="mt-1 text-sm text-muted">Manage community components</p>
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
            d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
          />
        </svg>
        <p className="text-sm text-muted">Coming soon</p>
      </div>
    </div>
  );
}
