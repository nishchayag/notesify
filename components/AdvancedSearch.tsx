import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchableItem {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SearchProps<T extends SearchableItem> {
  items: T[];
  onResults: (results: T[]) => void;
  placeholder?: string;
  className?: string;
}

export default function AdvancedSearch<T extends SearchableItem>({
  items,
  onResults,
  placeholder = "Search notes...",
  className = "",
}: SearchProps<T>) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Advanced search with scoring
  const searchResults = useMemo(() => {
    if (!query.trim()) return items;

    setIsSearching(true);

    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    const scoredResults = items.map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      const tagsLower = item.tags?.join(" ").toLowerCase() || "";

      searchTerms.forEach((term) => {
        // Title matches (highest priority)
        if (titleLower.includes(term)) {
          score += titleLower.indexOf(term) === 0 ? 10 : 5; // Bonus for starting with term
        }

        // Content matches
        const contentMatches = (contentLower.match(new RegExp(term, "g")) || [])
          .length;
        score += contentMatches * 2;

        // Tag matches
        if (tagsLower.includes(term)) {
          score += 3;
        }

        // Exact phrase bonus
        if (titleLower.includes(query.toLowerCase())) {
          score += 15;
        }
        if (contentLower.includes(query.toLowerCase())) {
          score += 8;
        }
      });

      return { item, score };
    });

    const filtered = scoredResults
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);

    setTimeout(() => setIsSearching(false), 200);
    return filtered;
  }, [items, query]);

  useEffect(() => {
    onResults(searchResults);
  }, [searchResults, onResults]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search Status */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 p-2 bg-background border rounded-md shadow-sm text-sm text-muted-foreground z-10"
          >
            {isSearching
              ? "Searching..."
              : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} found`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Search highlighting utility
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
  );
}
