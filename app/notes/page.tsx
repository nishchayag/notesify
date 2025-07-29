"use client";
import axios from "axios";
import { NoteStruc } from "@/components/NoteCard";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";
import { LoaderThree } from "@/components/ui/LoaderThree";
import { toast } from "sonner";
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
          toast.error("Failed to fetch notes. Please try refreshing the page.");
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
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search your notes..."
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                onChange={(e) => setSearchFilter(e.target.value)}
                value={searchFilter}
              />
            </div>

            {/* Empty State */}
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {searchFilter ? "No notes found" : "No notes yet"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {searchFilter
                    ? "Try adjusting your search terms or create a new note."
                    : "Start capturing your thoughts and ideas with your first note."}
                </p>
              </div>

              <button
                onClick={() => router.push("/createnote")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm"
              >
                ✨ Create Your First Note
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Your Notes
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {notesArray.length}{" "}
                    {notesArray.length === 1 ? "note" : "notes"} total
                  </p>
                </div>

                <button
                  onClick={() => router.push("/createnote")}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm flex items-center gap-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Note
                </button>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search your notes..."
                className="w-full max-w-md px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                onChange={(e) => setSearchFilter(e.target.value)}
                value={searchFilter}
              />
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotesArray.map((note, index) => (
                <div key={index}>
                  <NoteCard noteItem={note} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default NotesPage;
