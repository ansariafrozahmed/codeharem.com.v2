"use client";

export default function UsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-muted">Manage registered users</p>
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
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
        <p className="text-sm text-muted">Coming soon</p>
      </div>
    </div>
  );
}
