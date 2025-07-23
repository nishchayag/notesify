"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "./mode-toggle";

const Navbar = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full px-6 py-3 border-b flex justify-between items-center bg-background text-foreground z-50 relative">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold tracking-tight hover:opacity-90 transition"
      >
        Notesify
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        {session ? (
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            type="button"
            className="bg-white text-black dark:bg-neutral-900 dark:text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition flex items-center gap-2"
            aria-haspopup="true"
            {...(isDropdownOpen
              ? { "aria-expanded": "true" }
              : { "aria-expanded": "false" })}
          >
            {session.user.name || session.user.email}
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-black dark:bg-neutral-900 dark:text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          >
            Login
          </button>
        )}

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 rounded-lg shadow z-50 py-2 border dark:border-neutral-700"
            >
              <Link
                href="/notes"
                className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                View Notes
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                User Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
