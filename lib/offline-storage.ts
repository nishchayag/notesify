// IndexedDB utility for offline note storage

const DB_NAME = "notesify-offline";
const DB_VERSION = 1;

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

let db: IDBDatabase | null = null;

export async function openDatabase(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Store for pending notes (created offline)
      if (!database.objectStoreNames.contains("pending-notes")) {
        const pendingStore = database.createObjectStore("pending-notes", {
          keyPath: "id",
          autoIncrement: true,
        });
        pendingStore.createIndex("tempId", "tempId", { unique: true });
        pendingStore.createIndex("synced", "synced", { unique: false });
      }

      // Store for cached notes (for offline viewing)
      if (!database.objectStoreNames.contains("cached-notes")) {
        const cachedStore = database.createObjectStore("cached-notes", {
          keyPath: "_id",
        });
        cachedStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }

      // Store for pending updates
      if (!database.objectStoreNames.contains("pending-updates")) {
        database.createObjectStore("pending-updates", {
          keyPath: "noteId",
        });
      }
    };
  });
}

// Pending notes (created offline)
export async function addPendingNote(
  note: Omit<OfflineNote, "id">,
): Promise<number> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["pending-notes"], "readwrite");
    const store = transaction.objectStore("pending-notes");
    const request = store.add(note);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as number);
  });
}

export async function getPendingNotes(): Promise<OfflineNote[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["pending-notes"], "readonly");
    const store = transaction.objectStore("pending-notes");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function removePendingNote(id: number): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["pending-notes"], "readwrite");
    const store = transaction.objectStore("pending-notes");
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Cached notes (for offline viewing)
export async function cacheNotes(notes: CachedNote[]): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["cached-notes"], "readwrite");
    const store = transaction.objectStore("cached-notes");

    notes.forEach((note) => {
      store.put({ ...note, cachedAt: new Date() });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getCachedNotes(): Promise<CachedNote[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["cached-notes"], "readonly");
    const store = transaction.objectStore("cached-notes");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getCachedNote(
  noteId: string,
): Promise<CachedNote | undefined> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["cached-notes"], "readonly");
    const store = transaction.objectStore("cached-notes");
    const request = store.get(noteId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function updateCachedNote(note: CachedNote): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["cached-notes"], "readwrite");
    const store = transaction.objectStore("cached-notes");
    const request = store.put({ ...note, cachedAt: new Date() });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function removeCachedNote(noteId: string): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["cached-notes"], "readwrite");
    const store = transaction.objectStore("cached-notes");
    const request = store.delete(noteId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Pending updates (edits made offline)
export async function addPendingUpdate(
  noteId: string,
  updates: Partial<CachedNote>,
): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["pending-updates"], "readwrite");
    const store = transaction.objectStore("pending-updates");
    const request = store.put({ noteId, updates, updatedAt: new Date() });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPendingUpdates(): Promise<
  Array<{ noteId: string; updates: Partial<CachedNote> }>
> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["pending-updates"], "readonly");
    const store = transaction.objectStore("pending-updates");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function removePendingUpdate(noteId: string): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["pending-updates"], "readwrite");
    const store = transaction.objectStore("pending-updates");
    const request = store.delete(noteId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Sync pending notes and updates when back online
export async function syncOfflineData(): Promise<{
  synced: number;
  failed: number;
}> {
  let synced = 0;
  let failed = 0;

  // Sync pending notes
  const pendingNotes = await getPendingNotes();
  for (const note of pendingNotes) {
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

      if (response.ok && note.id) {
        await removePendingNote(note.id);
        synced++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error("Failed to sync note:", error);
      failed++;
    }
  }

  // Sync pending updates
  const pendingUpdates = await getPendingUpdates();
  for (const { noteId, updates } of pendingUpdates) {
    try {
      const response = await fetch("/api/notes/updateNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, ...updates }),
      });

      if (response.ok) {
        await removePendingUpdate(noteId);
        synced++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error("Failed to sync update:", error);
      failed++;
    }
  }

  return { synced, failed };
}

// Clear all offline data
export async function clearOfflineData(): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      ["pending-notes", "cached-notes", "pending-updates"],
      "readwrite",
    );

    transaction.objectStore("pending-notes").clear();
    transaction.objectStore("cached-notes").clear();
    transaction.objectStore("pending-updates").clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
