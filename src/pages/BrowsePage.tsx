import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeGridSkeleton } from "@/components/AnimeCardSkeleton";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";

const filterCategories = ["All", "Action", "Adventure", "Romance", "Fantasy", "Sci-Fi", "Horror", "Slice of Life", "Supernatural", "Comedy", "Drama", "Historical"];

const sortOptions = [
  { key: "rating-desc", labelAr: "الأعلى تقييماً", labelEn: "Highest Rated" },
  { key: "rating-asc", labelAr: "الأقل تقييماً", labelEn: "Lowest Rated" },
  { key: "year-desc", labelAr: "الأحدث", labelEn: "Newest" },
  { key: "year-asc", labelAr: "الأقدم", labelEn: "Oldest" },
  { key: "title-asc", labelAr: "أ-ي", labelEn: "A-Z" },
  { key: "episodes-desc", labelAr: "الأكثر حلقات", labelEn: "Most Episodes" },
];

const statusFilters = ["All", "Ongoing", "Completed", "Upcoming"];

export function BrowsePage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("rating-desc");
  const [showFilters, setShowFilters] = useState(false);

  // Real API data
  const animeQuery = trpc.anime.list.useQuery(
    { limit: 500 },
    { retry: false }
  );

  const allAnimeList = (animeQuery.data || []) as any[];

  const filtered = useMemo(() => {
    let result = [...allAnimeList];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          (a.genres || []).some((g: string) => g.toLowerCase().includes(q)) ||
          (a.studio || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((a) =>
        (a.genres || []).some((g: string) => g.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((a) => a.status === selectedStatus);
    }

    // Sort
    switch (sortBy) {
      case "rating-desc":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-asc":
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "year-desc":
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "year-asc":
        result.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "title-asc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "episodes-desc":
        result.sort((a, b) => (b.episodes || 0) - (a.episodes || 0));
        break;
    }

    return result;
  }, [allAnimeList, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) + (selectedStatus !== "All" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSearchQuery("");
    setSortBy("rating-desc");
  };

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--nv-bg-body)" }}>
      <div style={{ paddingInline: "clamp(5vw, 8vw, 10vw)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent mb-2">
            {isRTL ? "استكشف" : "Browse"}
          </h1>
          <p className="text-[14px] mb-8" style={{ color: "var(--nv-text-tertiary)" }}>
            {isRTL ? `اكتشف ${allAnimeList.length}+ أنمي في مكتبتنا` : `Discover ${allAnimeList.length}+ anime in our library`}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div className="relative mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 ${isRTL ? "right-4" : "left-4"}`} style={{ color: "var(--nv-text-dim)" }} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "ابحث عن أنمي، تصنيف، استوديو..." : "Search anime, genre, studio..."}
            className={`w-full h-12 rounded-xl text-[15px] outline-none transition-all duration-200 focus:border-[rgba(212,175,55,0.5)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"}`}
            style={{ color: "var(--nv-text-primary)", boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)" }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors ${isRTL ? "left-3" : "right-3"}`}>
              <X className="w-4 h-4" style={{ color: "var(--nv-text-dim)" }} />
            </button>
          )}
        </motion.div>

        {/* Filters Row */}
        <motion.div className="flex flex-wrap items-center gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <button onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)]"
            style={{ background: showFilters ? "rgba(212, 175, 55, 0.1)" : "rgba(255, 255, 255, 0.04)", border: showFilters ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)", color: "var(--nv-text-secondary)" }}>
            <SlidersHorizontal className="w-4 h-4" />
            {isRTL ? "الفلاتر" : "Filters"}
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)", color: "#0a0a0a" }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[12px]" style={{ color: "var(--nv-text-tertiary)" }}>{isRTL ? "ترتيب:" : "Sort:"}</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-lg text-[13px] outline-none cursor-pointer transition-all duration-200 focus:border-[rgba(212,175,55,0.5)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
              style={{ color: "var(--nv-text-secondary)" }}>
              {sortOptions.map((opt) => (<option key={opt.key} value={opt.key}>{isRTL ? opt.labelAr : opt.labelEn}</option>))}
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-[13px] transition-colors hover:text-[#D4AF37]" style={{ color: "var(--nv-text-tertiary)" }}>
              {isRTL ? "مسح الكل" : "Clear all"}
            </button>
          )}

          <span className={`ml-auto text-[12px] ${isRTL ? "mr-auto ml-0" : ""}`} style={{ color: "var(--nv-text-tertiary)" }}>
            {filtered.length} {isRTL ? "نتيجة" : "results"}
          </span>
        </motion.div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div className="mb-8 p-5 rounded-xl space-y-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
            <div>
              <p className="text-[12px] uppercase tracking-wider mb-2" style={{ color: "var(--nv-text-tertiary)" }}>{isRTL ? "التصنيف" : "Category"}</p>
              <div className="flex flex-wrap gap-2">
                {filterCategories.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className="px-3 py-1.5 rounded-lg text-[13px] transition-all duration-200"
                    style={{ background: selectedCategory === cat ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.04)", color: selectedCategory === cat ? "#D4AF37" : "var(--nv-text-secondary)", border: selectedCategory === cat ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-wider mb-2" style={{ color: "var(--nv-text-tertiary)" }}>{isRTL ? "الحالة" : "Status"}</p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((s) => (
                  <button key={s} onClick={() => setSelectedStatus(s)}
                    className="px-3 py-1.5 rounded-lg text-[13px] transition-all duration-200"
                    style={{ background: selectedStatus === s ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.04)", color: selectedStatus === s ? "#D4AF37" : "var(--nv-text-secondary)", border: selectedStatus === s ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Anime Grid */}
        {animeQuery.isLoading ? (
          <AnimeGridSkeleton count={12} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filtered.map((anime, i) => (
              <AnimeCard key={`${anime.id}-${i}`} anime={anime} index={i} onClick={() => navigate(`/watch/${anime.id}`)} />
            ))}
          </div>
        ) : (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--nv-text-dim)" }} />
            <p className="text-[18px] mb-2" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "لا توجد نتائج" : "No results found"}</p>
            <p className="text-[14px] mb-4" style={{ color: "var(--nv-text-tertiary)" }}>{isRTL ? "جرب بحث مختلف أو فلاتر أخرى" : "Try a different search or adjust your filters"}</p>
            <button onClick={clearFilters} className="px-6 py-2.5 rounded-lg text-[14px] font-medium text-[#0a0a0a] transition-all duration-200 hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
              {isRTL ? "مسح الفلاتر" : "Clear Filters"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
