import { useEffect, useState, useRef } from "react";

interface SearchResult {
  id: string;
  data: () => Promise<{
    url: string;
    content: string;
    meta: {
      title: string;
      image?: string;
    };
    excerpt: string;
  }>;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  initialQuery = "",
}: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagefind, setPagefind] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load Pagefind (only when modal is opened and in production)
  useEffect(() => {
    async function loadPagefind() {
      if (!isOpen || typeof window === "undefined" || pagefind) return;
      
      try {
        // Dynamically construct path to avoid Vite static analysis in dev mode
        const pagefindPath = '/pagefind/pagefind.js';
        // @ts-ignore - Dynamic import
        const pagefindModule = await import(/* @vite-ignore */ pagefindPath).catch(() => null);
        
        if (pagefindModule) {
          setPagefind(pagefindModule);
        } else {
          console.warn('Search is only available in built site. Run: npm run build && npm run preview');
        }
      } catch (error) {
        // Silently handle errors in dev mode
      }
    }
    loadPagefind();
  }, [isOpen, pagefind]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    async function search() {
      if (!pagefind || !query || query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await pagefind.search(query);
        setResults(searchResults.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, pagefind]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-black rounded-lg shadow-2xl border border-gray-200 dark:border-gray-900 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-900 px-4">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none py-4 px-4 text-lg"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            id="search-title"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-600 p-1"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:block ml-2 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-900 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isSearching && (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}

          {!isSearching &&
            query &&
            query.length >= 2 &&
            results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No results found for "
                <span className="font-medium text-gray-900 dark:text-white">
                  {query}
                </span>
                "
              </div>
            )}

          {!isSearching && query && query.length < 2 && (
            <div className="p-8 text-center text-gray-500">
              Type at least 2 characters to search
            </div>
          )}

          {!query && (
            <div className="p-8 text-center text-gray-500">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-white mb-2">
                Search articles
              </p>
              <p className="text-sm">
                Start typing to find what you're looking for
              </p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <SearchResults results={results} onResultClick={onClose} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-900 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-900 rounded">
                ↵
              </kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-900 rounded">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </div>
          </div>
          <div className="text-gray-400">Powered by Pagefind</div>
        </div>
      </div>
    </div>
  );
}

function SearchResults({
  results,
  onResultClick,
}: {
  results: SearchResult[];
  onResultClick: () => void;
}) {
  const [loadedResults, setLoadedResults] = useState<any[]>([]);

  useEffect(() => {
    async function loadResults() {
      const loaded = await Promise.all(
        results.slice(0, 10).map(async (result) => {
          try {
            const data = await result.data();
            return data;
          } catch (error) {
            console.error("Error loading result:", error);
            return null;
          }
        })
      );
      setLoadedResults(loaded.filter(Boolean));
    }
    loadResults();
  }, [results]);

  return (
    <div className="py-2">
      {loadedResults.map((result, index) => (
        <a
          key={result.url}
          href={result.url}
          onClick={onResultClick}
          className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-black border-b border-gray-100 dark:border-gray-900 last:border-b-0 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {result.meta.title}
              </h3>
              <p
                className="mt-1 text-sm text-gray-600 dark:text-white line-clamp-2"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-white">
                {result.url}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
