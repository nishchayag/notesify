"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOfflineNotes } from "@/hooks/useOfflineNotes";

type SyncStatus = "idle" | "syncing" | "success" | "error";

export function SyncIndicator() {
  const {
    isOffline,
    hasPendingChanges,
    pendingNotes,
    pendingUpdates,
    syncAll,
  } = useOfflineNotes();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  const handleSync = async () => {
    if (isOffline || !hasPendingChanges) return;

    setSyncStatus("syncing");
    try {
      const result = await syncAll();
      if (result.failed === 0) {
        setSyncStatus("success");
      } else {
        setSyncStatus("error");
      }
    } catch {
      setSyncStatus("error");
    }

    // Reset status after delay
    setTimeout(() => setSyncStatus("idle"), 3000);
  };

  const totalPending = pendingNotes.length + pendingUpdates.length;

  if (!hasPendingChanges && !isOffline) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="flex items-center gap-2 rounded-full bg-background border shadow-lg px-4 py-2">
        {isOffline ? (
          <>
            <CloudOff className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Offline</span>
            {hasPendingChanges && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                {totalPending} pending
              </span>
            )}
          </>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {syncStatus === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Cloud className="h-4 w-4 text-blue-500" />
                </motion.div>
              )}
              {syncStatus === "syncing" && (
                <motion.div
                  key="syncing"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  exit={{ scale: 0 }}
                  transition={{ rotate: { repeat: Infinity, duration: 1 } }}
                >
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                </motion.div>
              )}
              {syncStatus === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              )}
              {syncStatus === "error" && (
                <motion.div
                  key="error"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </motion.div>
              )}
            </AnimatePresence>

            {hasPendingChanges && (
              <>
                <span className="text-sm text-muted-foreground">
                  {totalPending} unsaved
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  onClick={handleSync}
                  disabled={syncStatus === "syncing"}
                >
                  {syncStatus === "syncing" ? "Syncing..." : "Sync now"}
                </Button>
              </>
            )}

            {!hasPendingChanges && syncStatus === "success" && (
              <span className="text-sm text-green-600 dark:text-green-400">
                All synced!
              </span>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
