import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Film, Star, Hash } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface AnimeSearchProps {
  value: number | null;
  onChange: (id: number | null, anime?: { id: number; title: string; image?: string; episodes?: number }) => void;
  isRTL?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const ITEM_HEIGHT = 56;
const DROPDOWN_HEIGHT = 320;
const VISIBLE_COUNT = Math.ceil(DROPDOWN_HEIGHT / ITEM_HEIGHT) + 2;
const DEBOUNCE_MS = 200;

export function AnimeSearch({ value, onChange, isRTL = false, placeholder, disabled = false }: AnimeSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setHighlightedIndex(0);
      setScrollTop(0);
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // tRPC search query (lightweight)
  const searchQuery = trpc.anime.search.useQuery(
    { q: debouncedQuery, limit: 50 },
    { enabled: debouncedQuery.length > 0 && isOpen, retry: false }
  );

  // Full list for when no search query (client-side filtering)
  const fullListQuery = trpc.anime.list.useQuery(
    { limit: 100 },
    { enabled: isOpen && debouncedQuery.length === 0, retry: false }
  );

  const items = useMemo(() => {
    if (debouncedQuery.length > 0) {
      return (searchQuery.data || []) as Array<{ id: number; title: string; image?: string; episodes?: number; status?: string }>;
    }
    return (fullListQuery.data || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      image: a.image,
      episodes: a.episodes,
      status: a.status,
    }));
  }, [debouncedQuery, searchQuery.data, fullListQuery.data]);

  const selectedAnime = useMemo(() => items.find((a) => a.id === value) || null, [items, value]);

  // Virtual scrolling calculations
  const totalHeight = items.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT));
  const endIndex = Math.min(items.length, startIndex + VISIBLE_COUNT);
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const itemTop = highlightedIndex * ITEM_HEIGHT;
    const itemBottom = itemTop + ITEM_HEIGHT;
    const containerScroll = listRef.current.scrollTop;
    const containerHeight = listRef.current.clientHeight;
    if (itemTop < containerScroll) {
      listRef.current.scrollTop = itemTop;
    } else if (itemBottom > containerScroll + containerHeight) {
      listRef.current.scrollTop = itemBottom - containerHeight;
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          setIsOpen(true);
        }
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case "Enter":
          e.preventDefault();
          if (items[highlightedIndex]) {
            onChange(items[highlightedIndex].id, items[highlightedIndex]);
            setQuery("");
            setDebouncedQuery("");
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, items, highlightedIndex, onChange]
  );

  const handleSelect = (item: typeof items[0]) => {
    onChange(item.id, item);
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange(null);
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  };

  const isLoading = searchQuery.isLoading || fullListQuery.isLoading;

  return (
    <div className="relative w-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Search Input */}
      <div
        className={`
          relative flex items-center w-full h-12 rounded-xl
          border transition-all duration-200 cursor-text
          ${isOpen
            ? "border-[rgba(212,175,55,0.4)] shadow-[0_0_0_3px_rgba(212,175,55,0.08)]"
            : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"
          }
        `}
        style={{
          background: isOpen
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.025)",
        }}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setIsOpen(true);
          }
        }}
      >
        {/* Search Icon */}
        <Search
          className={`absolute w-4 h-4 text-[#555] pointer-events-none ${isRTL ? "right-4" : "left-4"}`}
        />

        {/* Selected value display OR search input */}
        {value && !isOpen ? (
          <div
            className={`flex items-center gap-3 flex-1 ${isRTL ? "mr-11 ml-20" : "ml-11 mr-20"} overflow-hidden`}
          >
            {selectedAnime?.image ? (
              <img
                src={selectedAnime.image}
                alt=""
                className="w-8 h-10 rounded object-cover flex-shrink-0 border border-[rgba(255,255,255,0.06)]"
              />
            ) : (
              <div className="w-8 h-10 rounded flex items-center justify-center flex-shrink-0 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                <Film className="w-3.5 h-3.5 text-[#555]" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[13px] font-medium truncate block" style={{ color: "var(--nv-text-primary)" }}>
                {selectedAnime?.title || "..."}
              </span>
              {selectedAnime?.episodes && (
                <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--nv-text-dim)" }}>
                  <Hash className="w-2.5 h-2.5" />
                  {selectedAnime.episodes} eps
                </span>
              )}
            </div>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder || (isRTL ? "ابحث عن أنمي..." : "Search anime...")}
            disabled={disabled}
            className={`
              flex-1 bg-transparent text-[13px] outline-none placeholder-[#555]
              ${isRTL ? "mr-11 ml-20 text-right" : "ml-11 mr-20 text-left"}
            `}
            style={{ color: "var(--nv-text-primary)" }}
          />
        )}

        {/* Right side actions */}
        <div className={`absolute flex items-center gap-1 ${isRTL ? "left-2" : "right-2"}`}>
          {value && (
            <button
              onClick={(e) => { e.stopPropagation(); clearSelection(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#555] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[70] w-full mt-2 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{
              background: "var(--nv-bg-secondary)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Results count header */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--nv-text-dim)" }}>
                {isLoading
                  ? (isRTL ? "جاري البحث..." : "Searching...")
                  : items.length > 0
                    ? `${items.length} ${isRTL ? "نتيجة" : "results"}`
                    : (isRTL ? "لا توجد نتائج" : "No results")
                }
              </span>
              {debouncedQuery.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: "var(--nv-gold)", background: "rgba(212,175,55,0.08)" }}>
                  {isRTL ? "بحث نشط" : "Active Search"}
                </span>
              )}
            </div>

            {/* Virtual scrolling list */}
            {items.length > 0 ? (
              <div
                ref={listRef}
                className="overflow-y-auto custom-scrollbar"
                style={{ height: Math.min(items.length * ITEM_HEIGHT, DROPDOWN_HEIGHT) }}
                onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
              >
                <div style={{ height: totalHeight, position: "relative" }}>
                  <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, i) => {
                      const actualIndex = startIndex + i;
                      const isHighlighted = actualIndex === highlightedIndex;
                      const isSelected = item.id === value;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setHighlightedIndex(actualIndex)}
                          className={`
                            flex items-center gap-3 px-4 cursor-pointer transition-all duration-100
                            ${isSelected ? "ring-1 ring-inset ring-[rgba(212,175,55,0.3)]" : ""}
                          `}
                          style={{
                            height: ITEM_HEIGHT,
                            background: isHighlighted
                              ? "rgba(212,175,55,0.06)"
                              : isSelected
                                ? "rgba(212,175,55,0.04)"
                                : "transparent",
                            borderBottom: "1px solid rgba(255,255,255,0.02)",
                          }}
                        >
                          {/* Anime image */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="w-9 h-[46px] rounded object-cover flex-shrink-0 border"
                              style={{ borderColor: "rgba(255,255,255,0.06)" }}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="w-9 h-[46px] rounded flex items-center justify-center flex-shrink-0 border"
                              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
                            >
                              <Film className="w-4 h-4 text-[#444]" />
                            </div>
                          )}

                          {/* Anime info */}
                          <div className="flex-1 min-w-0" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                            <span
                              className="text-[13px] font-medium truncate block"
                              style={{ color: isHighlighted ? "var(--nv-gold)" : "var(--nv-text-primary)" }}
                            >
                              {highlightMatch(item.title, debouncedQuery)}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.episodes !== undefined && (
                                <span className="text-[10px] flex items-center gap-0.5" style={{ color: "var(--nv-text-dim)" }}>
                                  <Hash className="w-2.5 h-2.5" />
                                  {item.episodes} eps
                                </span>
                              )}
                              {item.status && (
                                <span
                                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    color: item.status === "Ongoing" ? "#22c55e" : item.status === "Completed" ? "#3b82f6" : "#f59e0b",
                                    background: item.status === "Ongoing" ? "rgba(34,197,94,0.08)" : item.status === "Completed" ? "rgba(59,130,246,0.08)" : "rgba(245,158,11,0.08)",
                                  }}
                                >
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Selected indicator */}
                          {isSelected && (
                            <Star className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--nv-gold)" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-10">
                <Film className="w-10 h-10 mb-3" style={{ color: "var(--nv-text-dim)" }} />
                <p className="text-[13px]" style={{ color: "var(--nv-text-muted)" }}>
                  {debouncedQuery.length > 0
                    ? (isRTL ? `لا توجد نتائج لـ "${debouncedQuery}"` : `No results for "${debouncedQuery}"`)
                    : (isRTL ? "ابدأ بالكتابة للبحث" : "Start typing to search...")
                  }
                </p>
              </div>
            )}

            {/* Footer hint */}
            <div
              className="flex items-center justify-center gap-3 px-4 py-2 border-t"
              style={{ borderColor: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-[9px] flex items-center gap-1" style={{ color: "var(--nv-text-dim)" }}>
                <kbd className="px-1.5 py-0.5 rounded text-[8px] font-mono border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>↑↓</kbd>
                {isRTL ? "للتنقل" : "Navigate"}
              </span>
              <span className="text-[9px] flex items-center gap-1" style={{ color: "var(--nv-text-dim)" }}>
                <kbd className="px-1.5 py-0.5 rounded text-[8px] font-mono border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>Enter</kbd>
                {isRTL ? "للاختيار" : "Select"}
              </span>
              <span className="text-[9px] flex items-center gap-1" style={{ color: "var(--nv-text-dim)" }}>
                <kbd className="px-1.5 py-0.5 rounded text-[8px] font-mono border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>Esc</kbd>
                {isRTL ? "للإغلاق" : "Close"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Highlight the matching portion of the text */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "i"));
  return parts.map((part, i) => {
    const isMatch = part.toLowerCase() === query.toLowerCase();
    return isMatch ? (
      <span key={i} className="font-bold underline underline-offset-2" style={{ color: "#D4AF37" }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}
