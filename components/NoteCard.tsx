"use client";

import React, { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { LoaderThree } from "./ui/LoaderThree";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export interface NoteStruc {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
  isCompleted: boolean;
  createdAt: string;
}

const NoteCard = ({ noteItem }: { noteItem: NoteStruc }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const preview =
    noteItem.content.length > 200
      ? noteItem.content.slice(0, 200) + "..."
      : noteItem.content;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.post("/api/notes/deleteNote", {
        noteId: noteItem._id,
        email: session?.user.email,
      });
      toast.success("Note deleted successfully.");
      window.location.reload();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("error deleting note: ", error);
      }
      toast.error("Could not delete note. Please try again.");
    } finally {
      setLoading(false);
      router.push("/notes");
    }
  };

  if (loading) {
    return <LoaderThree />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <Link href={`/editnote?noteid=${noteItem._id}`}>
            <h2
              className={`text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors cursor-pointer ${noteItem.isCompleted ? "line-through opacity-60" : ""}`}
            >
              {noteItem.title}
            </h2>
          </Link>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {noteItem.isCompleted && (
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-medium">
              ✅ Done
            </span>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <Link href={`/editnote?noteid=${noteItem._id}`}>
        <p
          className={`text-sm text-muted-foreground leading-relaxed mb-4 cursor-pointer hover:text-foreground transition-colors ${noteItem.isCompleted ? "line-through opacity-60" : ""}`}
        >
          {preview}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <Link
          href={`/editnote?noteid=${noteItem._id}`}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Edit note →
        </Link>

        <span>
          Updated{" "}
          {formatDistanceToNow(new Date(noteItem.updatedAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </motion.div>
  );
};

export default NoteCard;
