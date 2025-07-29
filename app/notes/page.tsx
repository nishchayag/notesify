"use client";
import axios from "axios";
import { NoteStruc } from "@/components/NoteCard";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";
import { LoaderThree } from "@/components/ui/LoaderThree";
function NotesPage() {
  const [notesArray, setNotesArray] = useState<Array<NoteStruc>>([]);
  const [filteredNotesArray, setFilteredNotesArray] = useState<
    Array<NoteStruc>
  >([]);
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

          if (Array.isArray(response.data)) {
            setNotesArray(response.data);
            setFilteredNotesArray(response.data);
          }
        } catch (error) {
          console.error("Couldnt fetch notes: ", error);
        } finally {
          setloading(false);
        }
      }
    };
    fetchAllNotes();
  }, [session, status]);

  useEffect(() => {
    const lowerSearch = searchFilter.toLowerCase();

    const filteredArray = notesArray.filter(
      (note: NoteStruc) =>
        note.title.toLowerCase().includes(lowerSearch) ||
        note.content.toLowerCase().includes(lowerSearch)
    );
    setFilteredNotesArray(filteredArray);
  }, [searchFilter, notesArray]);

  if (loading) {
    return <LoaderThree />;
  }
  if (status === "authenticated" && Array.isArray(filteredNotesArray)) {
    if (filteredNotesArray.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-8 py-10 px-4">
          <input
            type="text"
            placeholder="Search note"
            className="w-full max-w-md px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-neutral-500"
            onChange={(e) => setSearchFilter(e.target.value)}
            value={searchFilter}
          />
          <button
            onClick={() => {
              router.push("/createnote");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Create Note
          </button>
          <h1 className="text-center text-xl text-neutral-700 dark:text-neutral-300 font-medium">
            No notes are present, please create a note, or change search filter
          </h1>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-10 py-10 px-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
            <input
              type="text"
              placeholder="Search note"
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-neutral-500"
              onChange={(e) => setSearchFilter(e.target.value)}
              value={searchFilter}
            />
            <button
              onClick={() => {
                router.push("/createnote");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Create Note
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2 sm:px-4 md:px-8 lg:px-20">
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

export default NotesPage;
