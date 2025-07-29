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
    <div className="flex flex-col justify-center items-center gap-10 mt-20 px-4">
      <Link
        href="/notes"
        className="text-red-500 hover:text-black hover:bg-red-200 p-2 rounded-lg transition-colors duration-100"
      >
        <X className="p-1" />
      </Link>
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-neutral-800 dark:text-white">
        Create New Note
      </h1>
      <form
        className="flex flex-col gap-6 justify-center items-center w-full max-w-xl"
        onSubmit={handleSubmit}
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
            className="mt-2 w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-neutral-500"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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
            className="mt-2 w-full h-80 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-neutral-500 resize-none"
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
