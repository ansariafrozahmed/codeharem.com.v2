"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/constants";
import { apiCreateComponent } from "@/lib/services/component.service";
import CodeEditor from "@/components/create/CodeEditor";
import Preview from "@/components/create/Preview";
import type { PreviewHandle } from "@/components/create/Preview";
import {
  DEFAULT_CSS_PLAIN,
  DEFAULT_HTML_CSS,
  DEFAULT_HTML_TAILWIND,
} from "@/lib/defaultText";

type Styling = "css" | "tailwind";
type Tab = "html" | "css" | "js";
type MobileView = "code" | "preview";

export default function CreatePage() {
  const [styling, setStyling] = useState<Styling | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [mobileView, setMobileView] = useState<MobileView>("code");

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const previewRef = useRef<PreviewHandle>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [externalCss, setExternalCss] = useState<string[]>([""]);
  const [externalJs, setExternalJs] = useState<string[]>([""]);
  const [headContent, setHeadContent] = useState("");

  // Publish
  const [showPublish, setShowPublish] = useState(false);
  const [componentName, setComponentName] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const router = useRouter();

  function selectStyling(s: Styling) {
    setStyling(s);
    setActiveTab("html");
    if (s === "tailwind") {
      setHtmlCode(DEFAULT_HTML_TAILWIND);
      setCssCode("");
    } else {
      setHtmlCode(DEFAULT_HTML_CSS);
      setCssCode(DEFAULT_CSS_PLAIN);
    }
    setJsCode("");
  }

  const currentCode =
    activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode;

  const currentLanguage: "html" | "css" | "javascript" =
    activeTab === "html" ? "html" : activeTab === "css" ? "css" : "javascript";

  function handleCodeChange(value: string) {
    if (activeTab === "html") setHtmlCode(value);
    else if (activeTab === "css") setCssCode(value);
    else setJsCode(value);
  }

  async function handleSave(status: "draft" | "published") {
    if (!componentName.trim()) {
      setSaveError("Component name is required");
      return;
    }
    if (!category) {
      setSaveError("Please select a category");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const component = await apiCreateComponent({
        title: componentName.trim(),
        category,
        styling: styling!,
        htmlCode,
        cssCode,
        jsCode,
        headContent,
        externalCss: externalCss.filter((u) => u.trim()),
        externalJs: externalJs.filter((u) => u.trim()),
        status,
      });
      router.push(`/component/${component.slug}`);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save component",
      );
    } finally {
      setSaving(false);
    }
  }

  function addExternalLink(type: "css" | "js") {
    if (type === "css") setExternalCss([...externalCss, ""]);
    else setExternalJs([...externalJs, ""]);
  }

  function updateExternalLink(
    type: "css" | "js",
    index: number,
    value: string,
  ) {
    if (type === "css") {
      const updated = [...externalCss];
      updated[index] = value;
      setExternalCss(updated);
    } else {
      const updated = [...externalJs];
      updated[index] = value;
      setExternalJs(updated);
    }
  }

  function removeExternalLink(type: "css" | "js", index: number) {
    if (type === "css")
      setExternalCss(externalCss.filter((_, i) => i !== index));
    else setExternalJs(externalJs.filter((_, i) => i !== index));
  }

  // === Styling Selection Modal ===
  if (!styling) {
    return (
      <div className="flex  items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg animate-[modalIn_0.2s_ease-out]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-white md:text-3xl lg:text-4xl">
              Create a Component
            </h1>
            <p className="mt-2 text-sm md:text-base font-light text-gray-400">
              Choose your preferred styling approach
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* CSS Option */}
            <button
              onClick={() => selectStyling("css")}
              className="group relative overflow-hidden rounded-xl border border-[#333] bg-[#1e1e1e] p-6 text-left transition-all hover:border-accent/50 hover:bg-accent/5 hover:shadow-[0_0_30px_rgba(66,152,114,0.1)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <svg
                  className="h-6 w-6 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.002l5.355-1.12.83-9.617H8.508l-.154-1.915h10.55l.204-1.937z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Plain CSS</h3>
              <p className="mt-1 text-sm font-light text-gray-400">
                Write custom CSS styles from scratch
              </p>
              <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/0.02" />
            </button>

            {/* Tailwind Option */}
            <button
              onClick={() => selectStyling("tailwind")}
              className="group relative overflow-hidden rounded-xl border border-[#333] bg-[#1e1e1e] p-6 text-left transition-all hover:border-accent/50 hover:bg-accent/5 hover:shadow-[0_0_30px_rgba(66,152,114,0.1)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                <svg
                  className="h-6 w-6 text-cyan-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Tailwind CSS</h3>
              <p className="mt-1 text-sm font-light text-gray-400">
                Use utility-first Tailwind classes
              </p>
              <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/[0.02]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] =
    styling === "tailwind"
      ? [
          { key: "html", label: "HTML" },
          { key: "js", label: "JavaScript" },
        ]
      : [
          { key: "html", label: "HTML" },
          { key: "css", label: "CSS" },
          { key: "js", label: "JavaScript" },
        ];

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#333] bg-[#1a1a1a] px-3 py-2 md:px-5">
        <div className="flex items-center gap-3">
          {/* Styling badge */}
          <button
            // onClick={() => setStyling(null)}
            className="flex items-center gap-1.5 rounded-md border border-[#333] bg-[#242424] px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300"
            title="Change styling"
          >
            {styling === "tailwind" ? (
              <svg
                className="h-3.5 w-3.5 text-cyan-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
              </svg>
            ) : (
              <svg
                className="h-3.5 w-3.5 text-blue-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.002l5.355-1.12.83-9.617H8.508l-.154-1.915h10.55l.204-1.937z" />
              </svg>
            )}
            {styling === "tailwind" ? "Tailwind" : "CSS"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 rounded-md border border-[#333] px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Publish button */}
          <button
            onClick={() => setShowPublish(true)}
            className="group relative flex items-center gap-1.5 overflow-hidden rounded-md bg-gradient-to-r from-dark-accent to-accent px-4 py-1.5 text-xs font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(66,152,114,0.3)]"
          >
            <span className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10" />
            <svg
              className="relative h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="relative">Publish</span>
          </button>
        </div>
      </div>

      {/* Mobile view toggle */}
      <div className="flex border-b border-[#333] bg-[#1e1e1e] md:hidden">
        <button
          onClick={() => setMobileView("code")}
          className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
            mobileView === "code"
              ? "border-b-2 border-accent text-accent"
              : "text-gray-400"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
            mobileView === "preview"
              ? "border-b-2 border-accent text-accent"
              : "text-gray-400"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div
          className={`flex flex-col border-r border-[#333] md:w-1/2 ${
            mobileView === "code" ? "w-full" : "hidden md:flex"
          }`}
        >
          {/* Tab bar */}
          <div className="flex items-center border-b border-[#333] bg-[#1e1e1e]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={currentCode}
              onChange={handleCodeChange}
              language={currentLanguage}
            />
          </div>
        </div>

        {/* Preview panel */}
        <div
          className={`flex flex-col md:w-1/2 ${
            mobileView === "preview" ? "w-full" : "hidden md:flex"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#333] bg-[#1e1e1e] px-4 py-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-500">Preview</span>
            <div className="flex items-center gap-1">
              {/* Reload */}
              <button
                onClick={() => previewRef.current?.reload()}
                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                title="Reload preview"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                  />
                </svg>
              </button>
              {/* Fullscreen */}
              <button
                onClick={() => previewRef.current?.fullscreen()}
                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                title="Fullscreen preview"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-white">
            <Preview
              ref={previewRef}
              htmlCode={htmlCode}
              cssCode={cssCode}
              jsCode={jsCode}
              styling={styling}
              externalCss={externalCss}
              externalJs={externalJs}
              headContent={headContent}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="relative w-full max-w-lg animate-[modalIn_0.2s_ease-out] overflow-hidden rounded-lg border border-[#333] bg-[#1e1e1e] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#333] px-6 py-4">
              <h3 className="text-lg font-light text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 transition-colors hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6">
              {/* Custom Head Content */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-300">
                  Stuff for {"<head>"}
                </label>
                <p className="mb-2 text-xs text-gray-500">
                  Add meta tags, fonts, or any custom HTML to the {"<head>"}{" "}
                  section
                </p>
                <textarea
                  value={headContent}
                  onChange={(e) => setHeadContent(e.target.value)}
                  placeholder={
                    '<meta name="viewport" content="...">\n<link rel="preconnect" href="...">\n<link href="https://fonts.googleapis.com/..." rel="stylesheet">'
                  }
                  rows={5}
                  className="w-full rounded-lg border border-[#333] bg-[#242424] px-3 py-2.5 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-accent"
                />
              </div>

              {/* External CSS */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    External CSS
                  </label>
                  <button
                    onClick={() => addExternalLink("css")}
                    className="text-xs text-accent hover:underline"
                  >
                    + Add URL
                  </button>
                </div>
                <div className="space-y-2">
                  {externalCss.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) =>
                          updateExternalLink("css", i, e.target.value)
                        }
                        placeholder="https://example.com/style.css"
                        className="flex-1 rounded-lg border border-[#333] bg-[#242424] px-3 py-3 font-light text-sm text-white placeholder-gray-500 outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => removeExternalLink("css", i)}
                        className="text-gray-500 transition-colors hover:text-red-400"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* External JS */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    External JavaScript
                  </label>
                  <button
                    onClick={() => addExternalLink("js")}
                    className="text-xs text-accent hover:underline"
                  >
                    + Add URL
                  </button>
                </div>
                <div className="space-y-2">
                  {externalJs.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) =>
                          updateExternalLink("js", i, e.target.value)
                        }
                        placeholder="https://example.com/script.js"
                        className="flex-1 rounded-lg border border-[#333] bg-[#242424] px-3 py-3 font-light text-sm text-white placeholder-gray-500 outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => removeExternalLink("js", i)}
                        className="text-gray-500 transition-colors hover:text-red-400"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#333] px-6 py-4">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full rounded-lg bg-gradient-to-r from-dark-accent to-accent py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublish && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPublish(false)}
          />
          <div className="relative w-full max-w-md animate-[modalIn_0.2s_ease-out] overflow-hidden rounded-lg border border-[#333] bg-[#1e1e1e] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#333] px-6 py-4">
              <h3 className="text-base font-semibold text-white">
                Publish Component
              </h3>
              <button
                onClick={() => setShowPublish(false)}
                className="text-gray-500 transition-colors hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {saveError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {saveError}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Component Name
                </label>
                <input
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="e.g. Animated Button"
                  className="w-full rounded-lg border border-[#333] bg-[#242424] px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#333] bg-[#242424] px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-accent"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#333] px-6 py-4">
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="flex-1 rounded-lg border border-[#333] px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save as Draft"}
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={saving || !componentName.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-dark-accent to-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
