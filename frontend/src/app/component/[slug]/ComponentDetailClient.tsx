"use client";

import { useState, useRef } from "react";
import type { ComponentData } from "@/lib/services/component.service";

interface Props {
  component: ComponentData;
}

type Tab = "preview" | "html" | "css" | "js";

function buildDocument(c: ComponentData): string {
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

  return `<!DOCTYPE html><html><head><meta charset="utf-8">${tailwindTag}${extCss}${cssBlock}${c.headContent || ""}</head><body style="margin:0;background:#0a0a0a;display:flex;align-items:center;justify-content:center;min-height:100vh">${c.htmlCode}${extJs}${c.jsCode ? `<script>${c.jsCode}</${"script"}>` : ""}</body></html>`;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-[#333] bg-[#1a1a1a] px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:border-accent/40 hover:text-white"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            Copy
          </>
        )}
      </button>
      <pre className="overflow-auto rounded-lg bg-[#0a0a0a] p-4 pr-24 text-sm leading-relaxed">
        <code className="text-gray-300">
          <span className="text-gray-500 text-xs block mb-2">{`// ${language}`}</span>
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function ComponentDetailClient({ component }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewDoc = buildDocument(component);
  const showCss = component.styling === "css";

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "preview", label: "Preview", show: true },
    { id: "html", label: "HTML", show: true },
    { id: "css", label: "CSS", show: showCss },
    { id: "js", label: "JavaScript", show: true },
  ];

  function handleReload() {
    setIframeKey((k) => k + 1);
  }

  function handleFullscreen() {
    iframeRef.current?.requestFullscreen?.();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1f1f1f]">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#1a1a1a] px-4">
        <div className="flex">
          {tabs
            .filter((t) => t.show)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-accent"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
        </div>

        {/* Preview controls */}
        {activeTab === "preview" && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleReload}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              title="Reload preview"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
            </button>
            <button
              onClick={handleFullscreen}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              title="Fullscreen"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === "preview" && (
          <div className="relative min-h-[400px] bg-[#0a0a0a] md:min-h-[500px]">
            <iframe
              key={iframeKey}
              ref={iframeRef}
              srcDoc={previewDoc}
              className="h-[500px] w-full md:h-[600px]"
              sandbox="allow-scripts"
              title={`${component.title} preview`}
            />
          </div>
        )}

        {activeTab === "html" && (
          <CodeBlock code={component.htmlCode || "<!-- No HTML code -->"} language="HTML" />
        )}

        {activeTab === "css" && showCss && (
          <CodeBlock code={component.cssCode || "/* No CSS code */"} language="CSS" />
        )}

        {activeTab === "js" && (
          <CodeBlock code={component.jsCode || "// No JavaScript code"} language="JavaScript" />
        )}
      </div>
    </div>
  );
}
