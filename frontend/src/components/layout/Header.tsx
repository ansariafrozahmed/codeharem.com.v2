"use client";

import Link from "next/link";
import { NAV_LINKS, PROFILE_DROPDOWN_LINKS } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  function handleLogoutClick() {
    setDropdownOpen(false);
    setShowLogoutModal(true);
  }

  async function handleLogoutConfirm() {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      setMenuOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoggingOut(false);
    }
  }

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setMobileProfileOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target as Node)
      ) {
        setMobileProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="relative z-50 w-full bg-[#1a1a1a]/80 backdrop-blur-md">
        <div className="mainContainer flex h-16 items-center justify-between">
          {/* Left: Logo + Desktop nav */}
          <div className="flex items-center gap-14">
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

            <nav className="hidden items-center gap-6 lg:flex">
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
          </div>

          {/* Right: Create + Auth + Hamburger */}
          <div className="flex items-center gap-3">
            {!loading && (
              <Link
                href={user ? "/create" : "/login"}
                className="group hidden md:flex relative items-center gap-1.5 overflow-hidden rounded-md bg-gradient-to-r from-dark-accent to-accent px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(66,152,114,0.3)]"
              >
                <span className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10" />
                <svg
                  className="relative h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="relative font-light tracking-wide inline">
                  Create
                </span>
              </Link>
            )}

            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-10 md:w-20 animate-pulse rounded-lg bg-[#333]" />
                <div className="h-8 hidden md:block w-32 animate-pulse rounded-lg bg-[#333]" />
              </div>
            ) : user ? (
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-[#2a2a2a]"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || ""}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-medium text-white">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate text-sm text-gray-300">
                    {user.name || user.email}
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[#333] bg-[#1e1e1e] shadow-xl transition-all duration-200 ${
                    dropdownOpen
                      ? "pointer-events-auto scale-100 opacity-100"
                      : "pointer-events-none scale-95 opacity-0"
                  }`}
                >
                  <div className="border-b border-[#333] px-4 py-3">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1.5">
                    {PROFILE_DROPDOWN_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={item.iconPath}
                          />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-[#333] py-1.5">
                    <button
                      onClick={handleLogoutClick}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
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
                <span className="hidden md:inline">Login / Signup</span>
              </Link>
            )}

            {/* Mobile avatar with dropdown */}
            {!loading && user && (
              <div className="relative lg:hidden" ref={mobileProfileRef}>
                <button
                  onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                  className="flex items-center rounded-full transition-opacity hover:opacity-80"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || ""}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-medium text-white">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </button>

                <div
                  className={`absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[#333] bg-[#1e1e1e] shadow-xl transition-all duration-200 ${
                    mobileProfileOpen
                      ? "pointer-events-auto scale-100 opacity-100"
                      : "pointer-events-none scale-95 opacity-0"
                  }`}
                >
                  <div className="border-b border-[#333] px-4 py-3">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1.5">
                    {PROFILE_DROPDOWN_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={item.iconPath}
                          />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-[#333] py-1.5">
                    <button
                      onClick={handleLogoutClick}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 top-16 z-50 h-[calc(100dvh-4rem)] bg-[#1a1a1a] transition-all duration-300 lg:hidden ${
            menuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <nav className="mainContainer flex h-full flex-col gap-2 pt-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg py-3 text-lg font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/10 px-3 text-accent"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-4 h-px bg-[#333]" />

            <Link
              href={user ? "/create" : "/login"}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-to-r from-dark-accent to-accent px-4 py-3.5 text-base font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(66,152,114,0.3)]"
            >
              <span className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10" />
              <svg
                className="relative h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="relative font-light tracking-wide">
                Create Component
              </span>
            </Link>

            {!loading && !user && (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 font-light tracking-wide rounded-md bg-gradient-to-r from-dark-accent to-accent px-4 py-3 text-base text-white transition-opacity hover:opacity-90"
              >
                Login / Signup
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Logout confirmation modal — rendered via portal so it's not clipped by header */}
      {showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !loggingOut && setShowLogoutModal(false)}
            />
            <div className="relative w-full max-w-sm animate-[modalIn_0.2s_ease-out] overflow-hidden rounded-2xl border border-[#333] bg-[#1e1e1e] shadow-2xl">
              <div className="flex flex-col items-center px-6 pt-8 pb-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                  <svg
                    className="h-7 w-7 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Log out?</h3>
                <p className="mt-1 text-center text-sm text-gray-400">
                  Are you sure you want to log out of your account?
                </p>
              </div>

              <div className="flex gap-3 border-t border-[#333] px-6 py-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className="flex-1 cursor-pointer rounded-lg border border-[#333] px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  disabled={loggingOut}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-70"
                >
                  {loggingOut ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    "Log out"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Success toast */}
      {showToast &&
        createPortal(
          <div className="fixed top-6 left-1/2 z-[9999] -translate-x-1/2 animate-[toastIn_0.3s_ease-out]">
            <div className="flex items-center gap-3 rounded-xl border border-[#333] bg-[#1e1e1e] px-5 py-3 shadow-2xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15">
                <svg
                  className="h-4 w-4 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">
                Logged out successfully
              </p>
              <button
                onClick={() => setShowToast(false)}
                className="ml-2 text-gray-500 transition-colors hover:text-white"
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
          </div>,
          document.body,
        )}
    </>
  );
}
