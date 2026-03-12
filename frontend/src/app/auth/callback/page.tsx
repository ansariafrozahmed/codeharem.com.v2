"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokenAndFetchUser } = useAuth();

  useEffect(() => {
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
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-accent" />
        <p className="text-sm text-gray-400">Signing you in...</p>
      </div>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
