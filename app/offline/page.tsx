"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-muted-foreground">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry,
            your notes are safely stored and will sync when you&apos;re back online.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-3">
            While offline, you can:
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li>✅ View previously loaded notes</li>
            <li>✅ Create new notes (they&apos;ll sync later)</li>
            <li>✅ Edit existing cached notes</li>
            <li>❌ Access notes not yet cached</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-input bg-background text-foreground hover:bg-accent transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/notes"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Notes
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Your changes will automatically sync when you reconnect.
        </p>
      </div>
    </div>
  );
}
