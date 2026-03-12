"use client";
import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const htmlContent = `<div>
  <h1>
    The <span class="highlight">Ultimate</span>
    Code Hub & 
    <span class="highlight">Developer</span>
    Playground
  </h1>
</div>`;

const baseCSS = `h1 {
    font-size: 3rem;
    font-weight: bold;
    line-height: 1.2;
}
`;

const fullProperty = `.highlight {
    color: #449C74;
    text-decoration: underline;
}`;

const MacWindow = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="w-full shadow-lg">
    <div className="bg-[#2A2A2A] rounded-t-lg p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 border-b border-gray-700">
      <div className="flex gap-1.5 sm:gap-2">
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="text-[10px] sm:text-xs text-gray-400 flex-1 text-center">
        {title}
      </div>
    </div>
    <div className="border-x border-b border-gray-700 rounded-b-lg overflow-hidden text-[8px] sm:text-[11px] bg-[#1E1E1E]">
      {children}
    </div>
  </div>
);

const AnimatedCodeEditor = ({
  handleChange,
}: {
  handleChange: (isAnimating: boolean) => void;
}) => {
  const [typedProperty, setTypedProperty] = useState("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const animate = async () => {
      // Start animation
      handleChange(false);
      setTypedProperty("");

      // Type each character
      for (let i = 0; i <= fullProperty.length; i++) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(() => {
            setTypedProperty(fullProperty.slice(0, i));
            resolve(null);
          }, 80);
        });
      }

      // Animation complete, change text color and wait 2 seconds
      handleChange(true);
      await new Promise((resolve) => {
        timeoutId = setTimeout(resolve, 3000);
      });

      // Start next animation
      timeoutId = setTimeout(animate, 100);
    };

    animate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleChange]);

  const cssContent = `${baseCSS}${typedProperty}`;

  return (
    <div className="relative w-full h-full flex flex-col sm:block gap-4">
      <div className="relative sm:absolute sm:bottom-0 sm:left-0 w-full sm:w-[90%] md:w-[80%] lg:w-[450px]">
        <MacWindow title="">
          <SyntaxHighlighter
            language="html"
            style={atomDark}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              padding: "0.75rem",
              background: "transparent",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {htmlContent}
          </SyntaxHighlighter>
        </MacWindow>
      </div>

      <div className="relative lg:mt-4 sm:absolute sm:top-0 sm:right-0 w-full sm:w-[90%] md:w-[80%] lg:w-[450px]">
        <MacWindow title="">
          <SyntaxHighlighter
            language="css"
            style={atomDark}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              padding: "0.75rem",
              background: "transparent",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {cssContent}
          </SyntaxHighlighter>
        </MacWindow>
      </div>
    </div>
  );
};

export default AnimatedCodeEditor;
