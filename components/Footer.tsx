"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6"
      >
        {/* Brand */}
        <div className="text-base font-semibold text-foreground">Notesify</div>

        {/* Nav Links */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link
            href="/about"
            className="hover:text-primary hover:underline transition"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="hover:text-primary hover:underline transition"
          >
            Privacy
          </Link>
          <a
            href="https://github.com/nishchayag/notesify"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline transition"
          >
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-muted-foreground text-center md:text-right">
          © {new Date().getFullYear()} Notesify. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
