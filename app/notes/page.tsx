"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";
import { LoaderThree } from "@/components/ui/LoaderThree";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import {
  Menu,
  X,
  Search,
  Plus,
  Pin,
  Archive,
  RotateCcw,
  Trash2,
} from "lucide-react";

export interface NoteStruc {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
  isCompleted: boolean;
  createdAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
  folder?: {
    _id: string;
    name: string;
    icon: string;
  } | null;
  tags?: Array<{
    _id: string;
    name: string;
    color: string;
  }>;
}

function NotesPage() {
  const [notesArray, setNotesArray] = useState<Array<NoteStruc>>([]);
  const [filteredNotesArray, setFilteredNotesArray] = useState<
    Array<NoteStruc>
  >([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<{
    folderId?: string;
    tagId?: string;
    view?: string;
  }>({ view: "all" });

  const fetchNotes = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      setLoading(true);
      const requestData: Record<string, unknown> = {
        email: session.user.email,
      };

      // Apply filters based on view
      if (currentFilter.view === "archived") {
        requestData.includeArchived = true;
      } else if (currentFilter.view === "trash") {
        requestData.includeTrashed = true;
      } else if (currentFilter.view === "pinned") {
        requestData.pinnedOnly = true;
      } else if (currentFilter.view === "completed") {
        requestData.completedOnly = true;
      }

      // Apply folder filter
      if (currentFilter.folderId) {
        requestData.folderId = currentFilter.folderId;
      }

      // Apply tag filter
      if (currentFilter.tagId) {
        requestData.tagId = currentFilter.tagId;
      }

      const response = await axios.post("/api/notes/fetchNotes", requestData);

      if (Array.isArray(response.data)) {
        setNotesArray(response.data);
        setFilteredNotesArray(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch notes. Please try refreshing the page.");
      console.error("Couldn't fetch notes:", error);
    } finally {
      setLoading(false);
    }
  }, [session, status, currentFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Search filter
  useEffect(() => {
    const lowerSearch = searchFilter.toLowerCase();
    const filteredArray = notesArray.filter(
      (note: NoteStruc) =>
        note.title.toLowerCase().includes(lowerSearch) ||
        note.content.toLowerCase().includes(lowerSearch),
    );
    setFilteredNotesArray(filteredArray);
  }, [searchFilter, notesArray]);

  const handleFilterChange = useCallback(
    (filter: { folderId?: string; tagId?: string; view?: string }) => {
      setCurrentFilter(filter);
      setSearchFilter("");
    },
    [],
  );

  const handlePinNote = async (noteId: string, isPinned: boolean) => {
    try {
      await axios.post("/api/notes/updateNote", {
        noteId,
        isPinned: !isPinned,
      });
      toast.success(isPinned ? "Note unpinned" : "Note pinned");
      fetchNotes();
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleArchiveNote = async (noteId: string, isArchived: boolean) => {
    try {
      await axios.post("/api/notes/updateNote", {
        noteId,
        isArchived: !isArchived,
      });
      toast.success(isArchived ? "Note restored" : "Note archived");
      fetchNotes();
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleTrashNote = async (noteId: string, isTrashed: boolean) => {
    try {
      await axios.post("/api/notes/updateNote", {
        noteId,
        isTrashed: !isTrashed,
      });
      toast.success(isTrashed ? "Note restored" : "Note moved to trash");
      fetchNotes();
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handlePermanentDelete = async (noteId: string) => {
    try {
      await axios.post("/api/notes/deleteNote", {
        noteId,
        email: session?.user.email,
      });
      toast.success("Note permanently deleted");
      fetchNotes();
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const getViewTitle = () => {
    if (currentFilter.view === "pinned") return "Pinned Notes";
    if (currentFilter.view === "completed") return "Completed Notes";
    if (currentFilter.view === "archived") return "Archived Notes";
    if (currentFilter.view === "trash") return "Trash";
    if (currentFilter.folderId) {
      const note = notesArray.find(
        (n) => n.folder?._id === currentFilter.folderId,
      );
      return note?.folder?.icon + " " + note?.folder?.name || "Folder";
    }
    if (currentFilter.tagId) {
      const note = notesArray.find((n) =>
        n.tags?.some((t) => t._id === currentFilter.tagId),
      );
      const tag = note?.tags?.find((t) => t._id === currentFilter.tagId);
      return tag?.name || "Tag";
    }
    return "All Notes";
  };

  if (loading) {
    return <LoaderThree />;
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
        <Sidebar
          onFilterChange={handleFilterChange}
          currentFilter={currentFilter}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {getViewTitle()}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {filteredNotesArray.length}{" "}
                  {filteredNotesArray.length === 1 ? "note" : "notes"}
                </p>
              </div>

              {currentFilter.view !== "trash" && (
                <button
                  onClick={() => router.push("/createnote")}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Note
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                onChange={(e) => setSearchFilter(e.target.value)}
                value={searchFilter}
              />
            </div>
          </div>

          {/* Notes Grid or Empty State */}
          {filteredNotesArray.length === 0 ? (
            <div className="text-center py-16 space-y-6">
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
                  {searchFilter
                    ? "No notes found"
                    : `No ${getViewTitle().toLowerCase()}`}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {searchFilter
                    ? "Try adjusting your search terms or create a new note."
                    : currentFilter.view === "trash"
                      ? "Notes you delete will appear here."
                      : "Start capturing your thoughts and ideas."}
                </p>
              </div>

              {currentFilter.view !== "trash" &&
                currentFilter.view !== "archived" && (
                  <button
                    onClick={() => router.push("/createnote")}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm"
                  >
                    ✨ Create Your First Note
                  </button>
                )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNotesArray.map((note) => (
                <div key={note._id} className="relative group">
                  {/* Quick actions overlay */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {currentFilter.view !== "trash" ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePinNote(note._id, note.isPinned || false);
                          }}
                          className={`p-1.5 rounded-lg bg-card/90 backdrop-blur-sm border shadow-sm hover:bg-accent ${
                            note.isPinned
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                          title={note.isPinned ? "Unpin" : "Pin"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveNote(
                              note._id,
                              note.isArchived || false,
                            );
                          }}
                          className="p-1.5 rounded-lg bg-card/90 backdrop-blur-sm border shadow-sm hover:bg-accent text-muted-foreground"
                          title={note.isArchived ? "Unarchive" : "Archive"}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrashNote(note._id, false);
                          }}
                          className="p-1.5 rounded-lg bg-card/90 backdrop-blur-sm border shadow-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Move to trash"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrashNote(note._id, true);
                          }}
                          className="p-1.5 rounded-lg bg-card/90 backdrop-blur-sm border shadow-sm hover:bg-accent text-muted-foreground"
                          title="Restore"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePermanentDelete(note._id);
                          }}
                          className="p-1.5 rounded-lg bg-card/90 backdrop-blur-sm border shadow-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Pin indicator */}
                  {note.isPinned && currentFilter.view !== "pinned" && (
                    <div className="absolute top-2 left-2 z-10">
                      <Pin className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}

                  <NoteCard noteItem={note} />

                  {/* Tags display */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 px-1">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag._id}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: tag.color + "20",
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{note.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NotesPage;
