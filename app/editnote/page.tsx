"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
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
    setnoteid(params.get("noteid")!);
  });
  useEffect(() => {
    const fetchNoteUsingId = async () => {
      const response = await axios.post("/api/notes/fetchNote", {
        noteId: noteid,
      });
      console.log(response.data);
      const { title, content, isCompleted } = response.data;
      console.log({ title, content, isCompleted });
      setForm({
        ...form,
        updatedTitle: title,
        updatedContent: content,
        updatedIsCompleted: isCompleted,
      });
      console.log(form);
    };
    fetchNoteUsingId();
  }, [noteid]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/notes/updateNote", {
        noteId: params.get("noteid"),
        title: form.updatedTitle,
        content: form.updatedContent,
        isCompleted: form.updatedIsCompleted,
      });
      console.log(response.data);
      router.push("/notes");
    } catch (error) {
      console.error("could not edit note: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/notes/deleteNote", {
        noteId: params.get("noteid"),
        email: session?.user.email,
      });
      console.log(response.data);

      router.push("/notes");
    } catch (error) {
      console.error("error deleting note: ", error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 mt-20">
      <h1 className="text-5xl">Edit Note</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-center items-center"
      >
        <label htmlFor="title" className="text-xl">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="border w-100 px-4 py-3 rounded-xl"
          value={form.updatedTitle}
          onChange={(e) => setForm({ ...form, updatedTitle: e.target.value })}
        />
        <label htmlFor="content" className="text-xl">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          className="border w-100 h-80 px-4 py-3 rounded-xl overflow-y-scroll"
          value={form.updatedContent}
          onChange={(e) => setForm({ ...form, updatedContent: e.target.value })}
        />
        <div className=" flex flex-row gap-4">
          <input
            type="checkbox"
            id="iscompleted"
            className="scale-150"
            checked={form.updatedIsCompleted}
            onChange={() =>
              setForm({
                ...form,
                updatedIsCompleted: outerIsCompleted ? false : true,
              })
            }
          />
          <label htmlFor="iscompleted">Is Completed?</label>
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => router.push("/notes")}
            className=" bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
          >
            {" "}
            Cancel
          </button>
          <button
            type="submit"
            className=" bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
          >
            {" "}
            Submit
          </button>
          <button
            onClick={handleDelete}
            className=" bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
          >
            {" "}
            Delete Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
