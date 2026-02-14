"use client";

import { useState, useEffect, useCallback } from "react";
import {
  openDatabase,
  addPendingNote,
  getPendingNotes,
  removePendingNote,
  cacheNotes,
  getCachedNotes,
  getCachedNote,
  updateCachedNote,
  removeCachedNote,
  addPendingUpdate,
  getPendingUpdates,
  removePendingUpdate,
  syncOfflineData,
  clearOfflineData,
} from "@/lib/offline-storage";

interface CachedNote {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
  isCompleted: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  folder?: object;
  tags?: object[];
  cachedAt: Date;
}

interface OfflineNote {
  id?: number;
  tempId: string;
  email: string;
  title: string;
  content: string;
  folder?: string;
  tags?: string[];
  createdAt: Date;
  synced: boolean;
}

interface PendingUpdate {
  noteId: string;
  updates: Partial<CachedNote>;
}

interface UseOfflineNotesReturn {
  isOffline: boolean;
  isDBReady: boolean;
  cachedNotes: CachedNote[];
  pendingNotes: OfflineNote[];
  pendingUpdates: PendingUpdate[];
  hasPendingChanges: boolean;
  saveNote: (note: Omit<OfflineNote, "id" | "synced">) => Promise<void>;
  cacheNote: (note: CachedNote) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  syncAll: () => Promise<{ synced: number; failed: number }>;
  refreshCache: () => Promise<void>;
}

export function useOfflineNotes(): UseOfflineNotesReturn {
  const [isOffline, setIsOffline] = useState(false);
  const [isDBReady, setIsDBReady] = useState(false);
  const [cachedNotes, setCachedNotes] = useState<CachedNote[]>([]);
  const [pendingNotes, setPendingNotes] = useState<OfflineNote[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);

  const refreshCache = useCallback(async () => {
    try {
      const [notes, pending, updates] = await Promise.all([
        getCachedNotes(),
        getPendingNotes(),
        getPendingUpdates(),
      ]);
      setCachedNotes(notes);
      setPendingNotes(pending);
      setPendingUpdates(updates);
    } catch (error) {
      console.error("Failed to refresh cache:", error);
    }
  }, []);

  // Initialize DB and set up online/offline listeners
  useEffect(() => {
    const init = async () => {
      try {
        await openDatabase();
        setIsDBReady(true);
        await refreshCache();
      } catch (error) {
        console.error("Failed to initialize offline DB:", error);
      }
    };

    init();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshCache]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (
      !isOffline &&
      isDBReady &&
      (pendingNotes.length > 0 || pendingUpdates.length > 0)
    ) {
      syncAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline, isDBReady]);

  const saveNote = useCallback(
    async (note: Omit<OfflineNote, "id" | "synced">) => {
      if (!isDBReady) return;

      await addPendingNote({ ...note, synced: false });
      await refreshCache();

      // Try to sync immediately if online
      if (!isOffline) {
        try {
          const response = await fetch("/api/notes/addNote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: note.email,
              title: note.title,
              content: note.content,
              folder: note.folder,
              tags: note.tags,
            }),
          });

          if (response.ok) {
            // Remove the pending note after successful sync
            const pending = await getPendingNotes();
            const savedNote = pending.find((n) => n.tempId === note.tempId);
            if (savedNote?.id) {
              await removePendingNote(savedNote.id);
            }
            await refreshCache();
          }
        } catch (error) {
          console.log("Note saved offline, will sync later");
        }
      }
    },
    [isDBReady, isOffline, refreshCache],
  );

  const cacheNote = useCallback(
    async (note: CachedNote) => {
      if (!isDBReady) return;

      await updateCachedNote(note);
      await refreshCache();
    },
    [isDBReady, refreshCache],
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!isDBReady) return;

      await removeCachedNote(noteId);
      await refreshCache();
    },
    [isDBReady, refreshCache],
  );

  const syncAll = useCallback(async (): Promise<{
    synced: number;
    failed: number;
  }> => {
    if (!isDBReady || isOffline) {
      return { synced: 0, failed: 0 };
    }

    const result = await syncOfflineData();
    await refreshCache();
    return result;
  }, [isDBReady, isOffline, refreshCache]);

  return {
    isOffline,
    isDBReady,
    cachedNotes,
    pendingNotes,
    pendingUpdates,
    hasPendingChanges: pendingNotes.length > 0 || pendingUpdates.length > 0,
    saveNote,
    cacheNote,
    deleteNote,
    syncAll,
    refreshCache,
  };
}
