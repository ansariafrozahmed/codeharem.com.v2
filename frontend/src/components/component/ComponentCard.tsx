"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiToggleLike } from "@/lib/services/component.service";
import type { ComponentData } from "@/lib/services/component.service";

function buildPreviewDoc(c: ComponentData): string {
  const tailwindTag =
    c.styling === "tailwind"
      ? '<script src="https://cdn.tailwindcss.com"></' + "script>"
      : "";
  const cssBlock = c.cssCode ? `<style>${c.cssCode}</style>` : "";
  const extCss = c.externalCss
    .filter((u) => u.trim())
    .map((u) => `<link rel="stylesheet" href="${u}" />`)
    .join("\n");
  const extJs = c.externalJs
    .filter((u) => u.trim())
    .map((u) => `<script src="${u}"></${"script"}>`)
    .join("\n");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">${tailwindTag}${extCss}${cssBlock}${c.headContent || ""}</head><body style="margin:0;background:#141414;display:flex;align-items:center;justify-content:center;min-height:100vh;overflow:hidden">${c.htmlCode}${extJs}${c.jsCode ? `<script>${c.jsCode}</${"script"}>` : ""}</body></html>`;
}

interface Props {
  component: ComponentData;
  initialLiked?: boolean;
}

export default function ComponentCard({
  component,
  initialLiked = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(component.likes);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const { user } = useAuth();
  const previewHtml = buildPreviewDoc(component);

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      // Optimistic update
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 600);

      try {
        const result = await apiToggleLike(component.slug);
        setLiked(result.liked);
        setLikeCount(result.likes);
      } catch {
        // Revert on error
        setLiked(liked);
        setLikeCount(component.likes);
      }
    },
    [user, liked, component.slug, component.likes],
  );

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/component/${component.slug}`}
        className="relative block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-accent/30 group-hover:shadow-[0_20px_60px_-15px_rgba(66,152,114,0.15)]"
      >
        {/* Preview area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
          <div className="absolute inset-0" style={{ zoom: 0.4 }}>
            <iframe
              srcDoc={previewHtml}
              className={`h-full w-full transition-all duration-500 ${
                hovered ? "pointer-events-auto" : "pointer-events-none"
              }`}
              sandbox="allow-scripts"
              tabIndex={-1}
              loading="lazy"
              title={component.title}
            />
          </div>

          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent transition-opacity duration-500 ${
              hovered ? "opacity-0" : "opacity-60"
            }`}
          />

          {/* Corner glow */}
          <div
            className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl transition-all duration-700 ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          />

          {/* Styling badge */}
          <div
            className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider backdrop-blur-md transition-all duration-300 ${
              hovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                component.styling === "tailwind"
                  ? "bg-sky-400"
                  : "bg-orange-400"
              }`}
            />
            <span className="text-white/70">
              {component.styling === "tailwind" ? "Tailwind" : "CSS"}
            </span>
          </div>

          {/* View button */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span
              className={`flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-xs font-medium text-white transition-all duration-500 ${
                hovered ? "translate-y-0 scale-100" : "translate-y-4 scale-90"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              View Component
            </span>
          </div>
        </div>

        {/* Bottom info */}
        <div className="relative px-4 pb-4 pt-3">
          {/* Accent line */}
          <div
            className={`absolute left-0 top-0 h-[2px] bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500 ease-out ${
              hovered ? "w-full" : "w-0"
            }`}
          />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[13px] font-semibold text-white transition-colors duration-300 group-hover:text-accent">
                {component.title}
              </h3>

              {component.author && (
                <div className="mt-1.5 flex items-center gap-2">
                  {component.author.avatar ? (
                    <img
                      src={component.author.avatar}
                      alt={component.author.name}
                      className="h-4 w-4 rounded-full ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-[8px] font-bold text-accent">
                      {component.author.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-[11px] text-gray-500">
                    {component.author.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2.5 pt-0.5">
              {/* Like button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-[11px] transition-all ${
                  liked ? "text-rose-400" : "text-gray-500 hover:text-rose-400"
                }`}
              >
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    likeAnimating ? "scale-125" : "scale-100"
                  }`}
                  fill={liked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                {likeCount}
              </button>

              <span className="flex items-center gap-1 text-[11px] text-gray-500">
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
                {component.views}
              </span>

              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent capitalize">
                {component.category}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
