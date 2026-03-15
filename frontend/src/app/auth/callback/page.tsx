"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokenAndFetchUser } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");

    if (token) {
      setTokenAndFetchUser(token).then(() => {
        router.replace("/");
      });
    } else {
      router.replace("/login");
    }
  }, [searchParams, setTokenAndFetchUser, router]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-[3px] border-[#333] border-t-accent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-white">Signing you in</p>
          <p className="mt-1 text-sm text-gray-400">
            Please wait while we verify your account...
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[blink_1.4s_ease-in-out_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[blink_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[blink_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>

      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
