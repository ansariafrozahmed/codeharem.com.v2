"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  defaultValue,
  category,
}: {
  defaultValue?: string;
  category?: string;
}) {
  const [query, setQuery] = useState(defaultValue || "");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query.trim()) params.set("search", query.trim());
    const qs = params.toString();
    router.push(`/component${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full lg:max-w-sm">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search components..."
        className="w-full rounded-lg border border-[#333] bg-[#1f1f1f] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent/50"
      />
    </form>
  );
}
