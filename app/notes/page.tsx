"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";
function notesPage() {
  const [notesArray, setNotesArray] = useState<Array<Object>>([]);
  const [filteredNotesArray, setFilteredNotesArray] = useState<Array<Object>>(
    []
  );
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setloading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  useEffect(() => {
    const fetchAllNotes = async () => {
      if (status === "authenticated") {
        try {
          setloading(true);
          const response = await axios.post("/api/notes/fetchNotes", {
            email: session.user.email,
          });

          setNotesArray(response.data);

          setFilteredNotesArray(response.data);
        } catch (error) {
          console.error("Couldnt fetch notes: ", error);
        } finally {
          setloading(false);
        }
      }
    };
    fetchAllNotes();
  }, [session, status]);
  console.log(filteredNotesArray);

  if (loading) {
    return <h1>Loading notes</h1>;
  }
  if (status === "authenticated" && Array.isArray(filteredNotesArray)) {
    if (filteredNotesArray.length == 0) {
      return (
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-center text-3xl">
            No notes are present, please create a note
          </h1>
          <button
            onClick={() => {
              router.push("/createnote");
            }}
            className=" bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
          >
            {" "}
            Create Note
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="flex flex-row gap-4">
            <input
              type="text"
              placeholder="Search note"
              className="border w-100 px-4 py-3 rounded-xl"
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <button
              onClick={() => {
                router.push("/createnote");
              }}
              className=" bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
            >
              {" "}
              Create Note
            </button>
          </div>
          <div className="grid grid-cols-3 gap-10 px-20 w-full">
            {filteredNotesArray.map((note, index) => (
              <div key={index}>
                <NoteCard noteItem={note} />
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}

export default notesPage;
