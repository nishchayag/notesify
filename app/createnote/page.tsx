"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
function page() {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/notes/addNote", {
        email: session?.user.email,
        title: form.title,
        content: form.content,
      });
      console.log("note created successfully: ", response.data);
      router.push("/notes");
    } catch (error) {
      console.error("error creating a note: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 mt-20">
      <h1 className=" text-5xl">Create new note</h1>
      <form
        className="flex flex-col gap-5 justify-center items-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title" className="text-xl">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="border w-100 px-4 py-3 rounded-xl"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <label htmlFor="content" className="text-xl">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          className="border w-100 h-80 px-4 py-3 rounded-xl overflow-y-scroll"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button
          type="submit"
          className=" bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
        >
          {" "}
          Submit
        </button>
      </form>
    </div>
  );
}

export default page;
