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
    <nav className="w-full px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors"
        >
          Notesify
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <ModeToggle />

          {session ? (
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              type="button"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl cursor-pointer hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 font-medium"
              aria-haspopup="true"
              {...(isDropdownOpen
                ? { "aria-expanded": "true" }
                : { "aria-expanded": "false" })}
            >
              {session.user.name || session.user.email}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
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
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl cursor-pointer hover:bg-primary/90 transition-all duration-200 font-medium"
            >
              Login
            </button>
          )}

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-xl shadow-lg z-50 py-2 overflow-hidden"
              >
                <Link
                  href="/notes"
                  className="block px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📝 View Notes
                </Link>
                <Link
                  href="/createnote"
                  className="block px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  ✨ Create Note
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  ⚙️ Settings
                </Link>
                <hr className="my-1 border-border" />
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  🚪 Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
