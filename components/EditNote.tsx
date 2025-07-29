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
    <div className="flex flex-col justify-center items-center gap-10 mt-20 px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-neutral-800 dark:text-white">
        Edit Note
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 justify-center items-center w-full max-w-xl"
      >
        <div className="w-full">
          <label
            htmlFor="title"
            className="text-lg font-medium text-neutral-700 dark:text-neutral-200"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-2 w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white"
            value={form.updatedTitle}
            onChange={(e) => setForm({ ...form, updatedTitle: e.target.value })}
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="content"
            className="text-lg font-medium text-neutral-700 dark:text-neutral-200"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="mt-2 w-full h-80 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white resize-none"
            value={form.updatedContent}
            onChange={(e) =>
              setForm({ ...form, updatedContent: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-3 w-full">
          <input
            type="checkbox"
            id="iscompleted"
            className="scale-125 accent-red-500"
            checked={form.updatedIsCompleted}
            onChange={() =>
              setForm({
                ...form,
                updatedIsCompleted: outerIsCompleted ? false : true,
              })
            }
          />
          <label
            htmlFor="iscompleted"
            className="text-neutral-700 dark:text-neutral-200 text-sm sm:text-base"
          >
            Mark as Completed
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button
            onClick={() => router.push("/notes")}
            className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white px-6 py-3 rounded-xl transition"
            type="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition"
          >
            Submit
          </button>
          <button
            onClick={handleDelete}
            type="button"
            className="bg-neutral-500 hover:bg-neutral-600 text-white px-6 py-3 rounded-xl transition"
          >
            Delete Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
