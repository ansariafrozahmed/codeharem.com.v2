"use client";

import { useAuth } from "@/context/AuthContext";

const STAT_CARDS = [
  {
    label: "Total Users",
    value: "--",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
  {
    label: "Components",
    value: "--",
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  },
  {
    label: "Blog Posts",
    value: "--",
    icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z",
  },
  {
    label: "Admins",
    value: "--",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  },
];

export default function DashboardPage() {
  const { admin } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl font-bold text-white md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back, {admin?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{card.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <svg
                  className="h-[18px] w-[18px] text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={card.icon}
                  />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick info */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4 md:mt-8 md:p-6">
        <h2 className="text-base font-semibold text-white md:text-lg">Quick Info</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted">Logged in as</span>
            <span className="truncate text-white">{admin?.email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted">Admin since</span>
            <span className="text-white">
              {admin?.created_at
                ? new Date(admin.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "--"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Environment</span>
            <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {process.env.NODE_ENV}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
