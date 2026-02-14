"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export interface NoteStruc {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
  isCompleted: boolean;
  createdAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
  folder?: {
    _id: string;
    name: string;
    icon: string;
  } | null;
  tags?: Array<{
    _id: string;
    name: string;
    color: string;
  }>;
}

// Helper to strip HTML and get plain text preview
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const NoteCard = ({ noteItem }: { noteItem: NoteStruc }) => {
  const plainContent = stripHtml(noteItem.content);
  const preview =
    plainContent.length > 150
      ? plainContent.slice(0, 150) + "..."
      : plainContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <Link href={`/editnote?noteid=${noteItem._id}`}>
            <h2
              className={`text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2 ${
                noteItem.isCompleted ? "line-through opacity-60" : ""
              }`}
            >
              {noteItem.title}
            </h2>
          </Link>
        </div>

        {noteItem.isCompleted && (
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
            ✅ Done
          </span>
        )}
      </div>

      {/* Folder indicator */}
      {noteItem.folder && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <span>{noteItem.folder.icon}</span>
          <span>{noteItem.folder.name}</span>
        </div>
      )}

      {/* Content */}
      <Link href={`/editnote?noteid=${noteItem._id}`}>
        <p
          className={`text-sm text-muted-foreground leading-relaxed mb-4 cursor-pointer hover:text-foreground transition-colors line-clamp-3 ${
            noteItem.isCompleted ? "line-through opacity-60" : ""
          }`}
        >
          {preview || "No content"}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
        <Link
          href={`/editnote?noteid=${noteItem._id}`}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Edit note →
        </Link>

        <span>
          {formatDistanceToNow(new Date(noteItem.updatedAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </motion.div>
  );
};

export default NoteCard;
