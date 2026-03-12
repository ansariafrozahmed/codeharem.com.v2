"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuth();

  console.log(user);

  return (
    <header className="relative z-50 w-full bg-[#1a1a1a]/80 backdrop-blur-md">
      <div className="mainContainer flex h-16  items-center justify-between ">
        <Link href="/" className="block">
          <Image
            src="/logo.webp"
            className="w-32 h-auto"
            alt="Logo"
            priority
            height={100}
            width={600}
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[#333]" />
          ) : user ? (
            <>
              {/* <Link
                href="/create"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-dark-accent to-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <span className="text-base leading-none">+</span> Create now
              </Link> */}
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || ""}
                      className="h-8 w-8 rounded-full transition-opacity hover:opacity-80"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-medium text-white transition-opacity hover:opacity-80">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* <Link
                href="/create"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-dark-accent to-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <span className="text-base leading-none">+</span> Create now
              </Link> */}
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Login / Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
