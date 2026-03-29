"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface PreviewProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  styling: "css" | "tailwind";
  externalCss: string[];
  externalJs: string[];
  headContent: string;
}

export interface PreviewHandle {
  reload: () => void;
  fullscreen: () => void;
}

function buildDocument(
  html: string,
  css: string,
  js: string,
  styling: "css" | "tailwind",
  externalCss: string[],
  externalJs: string[],
  headContent: string,
): string {
  const tailwindTag =
    styling === "tailwind"
      ? '<script src="https://cdn.tailwindcss.com"></' + "script>"
      : "";

  const extCssTags = externalCss
    .filter((url) => url.trim())
    .map((url) => `<link rel="stylesheet" href="${url}" />`)
    .join("\n  ");

  const extJsTags = externalJs
    .filter((url) => url.trim())
    .map((url) => `<script src="${url}"></${"script"}>`)
    .join("\n  ");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${tailwindTag}
  ${extCssTags}
  ${headContent}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #ffffff; font-family: system-ui, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  ${extJsTags}
  <script>${js}</${"script"}>
</body>
</html>`;
}

const Preview = forwardRef<PreviewHandle, PreviewProps>(function Preview(
  { htmlCode, cssCode, jsCode, styling, externalCss, externalJs, headContent },
  ref,
) {
  const [srcdoc, setSrcdoc] = useState("");
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function buildCurrent() {
    return buildDocument(
      htmlCode,
      cssCode,
      jsCode,
      styling,
      externalCss,
      externalJs,
      headContent,
    );
  }

  useImperativeHandle(ref, () => ({
    reload: () => {
      setSrcdoc(buildCurrent());
      setKey((k) => k + 1);
    },
    fullscreen: () => {
      iframeRef.current?.requestFullscreen?.();
    },
  }));

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSrcdoc(buildCurrent());
    }, 400);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    htmlCode,
    cssCode,
    jsCode,
    styling,
    externalCss,
    externalJs,
    headContent,
  ]);

  return (
    <iframe
      key={key}
      ref={iframeRef}
      srcDoc={srcdoc}
      sandbox="allow-scripts"
      className="h-full w-full border-0 bg-white"
      title="Preview"
    />
  );
});

export default Preview;
