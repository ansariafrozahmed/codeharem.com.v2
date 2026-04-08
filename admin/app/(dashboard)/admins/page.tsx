"use client";

import { useEffect, useState } from "react";
import { adminList } from "@/lib/api";

interface Admin {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminList()
      .then((data) => setAdmins(data.admins))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <div>
          <h1 className="text-xl font-bold text-white md:text-2xl">
            Admin Users
          </h1>
          <p className="mt-1 text-sm text-muted">Manage admin accounts</p>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          {admins.length} admin{admins.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Name
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Email
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Created
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-sm text-muted"
                >
                  No admin users found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">
                        {admin.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    {admin.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    {new Date(admin.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    {new Date(admin.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-border bg-card py-12">
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              Loading...
            </div>
          </div>
        ) : admins.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted">
            No admin users found.
          </div>
        ) : (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {admin.name}
                  </p>
                  <p className="truncate text-xs text-muted">{admin.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
                <span>
                  Created{" "}
                  {new Date(admin.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>
                  Updated{" "}
                  {new Date(admin.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
