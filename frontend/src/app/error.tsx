"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mainContainer flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center py-20">
      <div className="relative mb-8">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-red-500/30 flex items-center justify-center">
          <svg
            className="w-12 h-12 md:w-16 md:h-16 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div className="absolute inset-0 blur-3xl opacity-10 bg-red-500 rounded-full" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Something went wrong
      </h2>
      <p className="text-gray-400 max-w-md mb-10 text-lg">
        An unexpected error occurred. Please try again or return to the home
        page.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-dark-accent to-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-8 py-3 rounded-lg border border-[#333] text-gray-300 font-semibold hover:bg-[#2a2a2a] hover:text-white transition-colors"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
