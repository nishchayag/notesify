"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import {
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Plus,
  FileText,
  Archive,
  Trash,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export interface FolderType {
  _id: string;
  name: string;
  icon: string;
  color: string;
  parentFolder: string | null;
  createdAt: string;
}

export interface TagType {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface SidebarProps {
  onFilterChange?: (filter: {
    folderId?: string;
    tagId?: string;
    view?: string;
  }) => void;
  currentFilter?: { folderId?: string; tagId?: string; view?: string };
}

export default function Sidebar({
  onFilterChange,
  currentFilter,
}: SidebarProps) {
  const { data: session } = useSession();

  const [folders, setFolders] = useState<FolderType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [showFolders, setShowFolders] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6366f1");

  const tagColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
  ];

  useEffect(() => {
    const loadData = async () => {
      if (session?.user?.email) {
        try {
          const [foldersRes, tagsRes] = await Promise.all([
            axios.get(`/api/folders?email=${session?.user?.email}`),
            axios.get(`/api/tags?email=${session?.user?.email}`),
          ]);
          setFolders(foldersRes.data);
          setTags(tagsRes.data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };
    loadData();
  }, [session]);

  const fetchFolders = async () => {
    try {
      const response = await axios.get(
        `/api/folders?email=${session?.user?.email}`,
      );
      setFolders(response.data);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `/api/tags?email=${session?.user?.email}`,
      );
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await axios.post("/api/folders", {
        email: session?.user?.email,
        name: newFolderName,
      });
      toast.success("Folder created!");
      setNewFolderName("");
      setIsCreatingFolder(false);
      fetchFolders();
    } catch (error) {
      toast.error("Failed to create folder");
      console.error(error);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    try {
      await axios.post("/api/tags", {
        email: session?.user?.email,
        name: newTagName,
        color: newTagColor,
      });
      toast.success("Tag created!");
      setNewTagName("");
      setIsCreatingTag(false);
      fetchTags();
    } catch (error) {
      toast.error("Failed to create tag");
      console.error(error);
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await axios.delete("/api/folders", {
        data: { folderId, email: session?.user?.email },
      });
      toast.success("Folder deleted!");
      fetchFolders();
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error(error);
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      await axios.delete("/api/tags", {
        data: { tagId, email: session?.user?.email },
      });
      toast.success("Tag deleted!");
      fetchTags();
    } catch (error) {
      toast.error("Failed to delete tag");
      console.error(error);
    }
  };

  const handleFilterClick = (filter: {
    folderId?: string;
    tagId?: string;
    view?: string;
  }) => {
    onFilterChange?.(filter);
  };

  const isActive = (filter: {
    folderId?: string;
    tagId?: string;
    view?: string;
  }) => {
    if (filter.view && currentFilter?.view === filter.view) return true;
    if (filter.folderId && currentFilter?.folderId === filter.folderId)
      return true;
    if (filter.tagId && currentFilter?.tagId === filter.tagId) return true;
    return false;
  };

  return (
    <aside className="w-64 h-[calc(100vh-73px)] bg-card border-r border-border overflow-y-auto flex-shrink-0">
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="space-y-1">
          <Link
            href="/createnote"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New Note</span>
          </Link>
        </div>

        {/* Views */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Views
          </h3>
          <button
            onClick={() => handleFilterClick({ view: "all" })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive({ view: "all" }) ||
              (!currentFilter?.folderId &&
                !currentFilter?.tagId &&
                !currentFilter?.view)
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Notes</span>
          </button>
          <button
            onClick={() => handleFilterClick({ view: "pinned" })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive({ view: "pinned" })
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Pinned</span>
          </button>
          <button
            onClick={() => handleFilterClick({ view: "completed" })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive({ view: "completed" })
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </button>
          <button
            onClick={() => handleFilterClick({ view: "archived" })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive({ view: "archived" })
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Archived</span>
          </button>
          <button
            onClick={() => handleFilterClick({ view: "trash" })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive({ view: "trash" })
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <Trash className="w-4 h-4" />
            <span>Trash</span>
          </button>
        </div>

        {/* Folders */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <button
              onClick={() => setShowFolders(!showFolders)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
            >
              {showFolders ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              Folders
            </button>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {showFolders && (
            <div className="space-y-1">
              {isCreatingFolder && (
                <div className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createFolder();
                      if (e.key === "Escape") setIsCreatingFolder(false);
                    }}
                    onBlur={() => {
                      if (newFolderName.trim()) createFolder();
                      else setIsCreatingFolder(false);
                    }}
                    className="w-full px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                </div>
              )}

              {folders.map((folder) => (
                <div key={folder._id} className="group">
                  <button
                    onClick={() => handleFilterClick({ folderId: folder._id })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive({ folderId: folder._id })
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{folder.icon}</span>
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </button>
                </div>
              ))}

              {folders.length === 0 && !isCreatingFolder && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No folders yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <button
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
            >
              {showTags ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              Tags
            </button>
            <button
              onClick={() => setIsCreatingTag(true)}
              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showTags && (
            <div className="space-y-1">
              {isCreatingTag && (
                <div className="px-3 py-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createTag();
                      if (e.key === "Escape") setIsCreatingTag(false);
                    }}
                    className="w-full px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                  <div className="flex gap-1 flex-wrap">
                    {tagColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          newTagColor === color
                            ? "ring-2 ring-offset-2 ring-foreground scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={createTag}
                      className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreatingTag(false)}
                      className="text-xs px-2 py-1 bg-muted rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {tags.map((tag) => (
                <div key={tag._id} className="group">
                  <button
                    onClick={() => handleFilterClick({ tagId: tag._id })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive({ tagId: tag._id })
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="truncate">{tag.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTag(tag._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </button>
                </div>
              ))}

              {tags.length === 0 && !isCreatingTag && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No tags yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
