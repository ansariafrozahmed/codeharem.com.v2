"use client";

import dynamic from "next/dynamic";
import { useRef, useCallback } from "react";
import type { OnMount } from "@monaco-editor/react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-sm text-gray-500">
      Loading editor...
    </div>
  ),
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "javascript";
}

export default function CodeEditor({
  value,
  onChange,
  language,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Enable HTML autocompletion and tag closing
    monaco.languages.registerCompletionItemProvider("html", {
      triggerCharacters: ["<", " ", '"', "=", "/"],
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const lineContent = model.getLineContent(position.lineNumber);
        const textBefore = lineContent.substring(0, position.column - 1);

        // Common HTML tags
        if (textBefore.endsWith("<") || /^<\w*$/.test(textBefore.trim())) {
          const tags = [
            "div", "span", "p", "a", "button", "input", "form", "label",
            "h1", "h2", "h3", "h4", "h5", "h6", "img", "ul", "ol", "li",
            "table", "tr", "td", "th", "thead", "tbody", "section", "article",
            "header", "footer", "nav", "main", "aside", "video", "audio",
            "canvas", "svg", "select", "option", "textarea", "details", "summary",
          ];
          return {
            suggestions: tags.map((tag) => ({
              label: tag,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: `${tag}$0</${tag}>`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
              detail: `<${tag}>`,
            })),
          };
        }

        // Common attributes when inside a tag
        if (/<\w+[^>]*$/.test(textBefore)) {
          const attrs = [
            { label: "class", insert: 'class="$0"' },
            { label: "id", insert: 'id="$0"' },
            { label: "style", insert: 'style="$0"' },
            { label: "href", insert: 'href="$0"' },
            { label: "src", insert: 'src="$0"' },
            { label: "alt", insert: 'alt="$0"' },
            { label: "type", insert: 'type="$0"' },
            { label: "placeholder", insert: 'placeholder="$0"' },
            { label: "value", insert: 'value="$0"' },
            { label: "onclick", insert: 'onclick="$0"' },
          ];
          return {
            suggestions: attrs.map((attr) => ({
              label: attr.label,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: attr.insert,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            })),
          };
        }

        return { suggestions: [] };
      },
    });

    // CSS property suggestions
    monaco.languages.registerCompletionItemProvider("css", {
      triggerCharacters: [":"],
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const props = [
          "display", "flex-direction", "justify-content", "align-items", "gap",
          "margin", "padding", "width", "height", "max-width", "min-height",
          "background", "background-color", "color", "font-size", "font-weight",
          "border", "border-radius", "box-shadow", "position", "top", "right",
          "bottom", "left", "z-index", "overflow", "opacity", "transition",
          "transform", "animation", "grid-template-columns", "grid-template-rows",
          "text-align", "text-decoration", "line-height", "letter-spacing",
          "cursor", "outline", "flex", "flex-wrap", "flex-grow", "flex-shrink",
        ];

        return {
          suggestions: props.map((prop) => ({
            label: prop,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: `${prop}: $0;`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          })),
        };
      },
    });
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(v) => onChange(v || "")}
      theme="vs-dark"
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 2,
        automaticLayout: true,
        padding: { top: 12 },
        bracketPairColorization: { enabled: true },
        formatOnPaste: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        acceptSuggestionOnCommitCharacter: true,
        wordBasedSuggestions: "currentDocument",
        parameterHints: { enabled: true },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoIndent: "full",
        linkedEditing: true,
      }}
    />
  );
}
