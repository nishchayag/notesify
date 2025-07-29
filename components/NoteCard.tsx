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
      className={`relative rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 transition group hover:shadow-2xl `}
    >
      {/* Clickable Overlay */}
      <Link
        href={`/editnote?noteid=${noteItem._id}`}
        className="absolute inset-0 z-0"
      />

      {/* Top Row */}
      <div className="relative z-10 flex justify-between items-start mb-3">
        <h2
          className={`text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-red-500 transition-colors ${noteItem.isCompleted ? "line-through" : ""} `}
        >
          {noteItem.title}
        </h2>

        {noteItem.isCompleted && (
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full ">
            ✅ Completed
          </span>
        )}
      </div>

      {/* Content */}
      <p
        className={`relative z-10 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed ${noteItem.isCompleted ? "line-through" : ""}`}
      >
        {preview}
      </p>

      {/* Bottom Row */}
      <div className="relative z-10 mt-4 flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 text-red-400 hover:text-red-600 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>

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
