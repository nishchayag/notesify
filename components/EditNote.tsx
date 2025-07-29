"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { LoaderThree } from "./ui/LoaderThree";
import { toast } from "sonner";
const EditNote = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [noteid, setnoteid] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    updatedTitle: " ",
    updatedContent: " ",
    updatedIsCompleted: false,
  });
  const outerIsCompleted = form.updatedIsCompleted;
  useEffect(() => {
    const id = params.get("noteid");
    if (id) setnoteid(id);
  }, [params]);
  useEffect(() => {
    if (!noteid) return;
    const fetchNoteUsingId = async () => {
      const response = await axios.post("/api/notes/fetchNote", {
        noteId: noteid,
      });

      const { title, content, isCompleted } = response.data;

      setForm((prevForm) => ({
        ...prevForm,
        updatedTitle: title,
        updatedContent: content,
        updatedIsCompleted: isCompleted,
      }));
    };
    fetchNoteUsingId();
  }, [noteid]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/notes/updateNote", {
        noteId: params.get("noteid"),
        title: form.updatedTitle,
        content: form.updatedContent,
        isCompleted: form.updatedIsCompleted,
      });

      toast.success("Note updated successfully!");
      router.push("/notes");
    } catch (error) {
      toast.error("Failed to update note. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.error("could not edit note: ", error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.post("/api/notes/deleteNote", {
        noteId: params.get("noteid"),
        email: session?.user.email,
      });

      toast.success("Note deleted successfully!");
      router.push("/notes");
    } catch (error) {
      toast.error("Failed to delete note. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.error("error deleting note: ", error);
      }
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
          <button
            onClick={() => router.push("/notes")}
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Back to Notes</span>
          </button>
          <h1 className="text-3xl font-bold text-foreground">Edit Note</h1>
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              value={form.updatedTitle}
              onChange={(e) =>
                setForm({ ...form, updatedTitle: e.target.value })
              }
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
              className="w-full h-80 px-4 py-3 rounded-xl border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              value={form.updatedContent}
              onChange={(e) =>
                setForm({ ...form, updatedContent: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <input
              type="checkbox"
              id="iscompleted"
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
              checked={form.updatedIsCompleted}
              onChange={() =>
                setForm({
                  ...form,
                  updatedIsCompleted: !outerIsCompleted,
                })
              }
            />
            <label
              htmlFor="iscompleted"
              className="text-foreground font-medium"
            >
              Mark as Completed
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={() => router.push("/notes")}
              className="px-6 py-3 rounded-xl border border-input bg-background text-foreground hover:bg-accent transition-all duration-200 font-medium"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              type="button"
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-destructive text-white hover:bg-destructive/90 shadow-sm"
              }`}
            >
              {loading ? "Deleting..." : "Delete Note"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              }`}
            >
              {loading ? "Updating..." : "Update Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
