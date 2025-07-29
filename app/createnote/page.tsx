"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoaderThree } from "@/components/ui/LoaderThree";
import { X } from "lucide-react";
import { toast } from "sonner";
function CreateNote() {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/notes/addNote", {
        email: session?.user.email,
        title: form.title,
        content: form.content,
      });
      toast.success("Note created successfully.");
      router.push("/notes");
    } catch (error) {
      toast.error("Failed to create note. Please try again.");
      console.error("error creating a note: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderThree />;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/notes"
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Notes</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Note
          </h1>
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Give your note a title..."
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Start writing your note..."
              className="w-full h-80 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/notes"
              className="px-6 py-3 rounded-xl border border-input bg-background text-foreground hover:bg-accent transition-all duration-200 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              }`}
            >
              {loading ? "Creating..." : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNote;
