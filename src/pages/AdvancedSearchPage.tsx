import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Star, Calendar, Hash, TrendingUp } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import type { Anime } from "@/types";

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Sci-Fi", "Supernatural", "Thriller", "Romance", "Mecha", "Noir", "Psychological", "Historical", "Superhero"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const STUDIOS = ["MAPPA", "Bones", "Madhouse", "WIT Studio", "ufotable", "A-1 Pictures", "Pierrot", "Sunrise", "White Fox", "Toei Animation", "TMS Entertainment", "J.C.Staff", "CloverWorks"];

export function AdvancedSearchPage() {
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(searchParams.get("genres")?.split(",").filter(Boolean) || []);
  const [yearFrom, setYearFrom] = useState(Number(searchParams.get("yearFrom")) || 1990);
  const [yearTo, setYearTo] = useState(Number(searchParams.get("yearTo")) || new Date().getFullYear());
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [studio, setStudio] = useState(searchParams.get("studio") || "");
  const [ratingMin, setRatingMin] = useState(Number(searchParams.get("ratingMin")) || 0);
  const [sortBy, setSortBy] = useState<"rating" | "year" | "title">((searchParams.get("sort") as any) || "rating");

  const filters = { q: query, genres: selectedGenres, yearFrom, yearTo, status, studio, ratingMin, sortBy };

  // Use the anime.list endpoint with search
  const animeQuery = trpc.anime.list.useQuery(
    { limit: 100, search: query || undefined },
    { retry: false }
  );

  const allAnime = (animeQuery.data || []) as unknown as Anime[];

  // Client-side filtering for facets not supported by backend
  const filtered = allAnime.filter((a: any) => {
    if (selectedGenres.length > 0 && !selectedGenres.some((g) => a.genres?.includes(g))) return false;
    if (a.year < yearFrom || a.year > yearTo) return false;
    if (status && a.status !== status) return false;
    if (studio && !a.studio?.includes(studio)) return false;
    const r = typeof a.rating === "number" ? (a.rating > 10 ? a.rating / 10 : a.rating) : 0;
    if (r < ratingMin) return false;
    return true;
  }).sort((a: any, b: any) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "year") return (b.year || 0) - (a.year || 0);
    return (a.title || "").localeCompare(b.title || "");
  });

  const toggleGenre = (g: string) => {
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  };

  const clearFilters = () => {
    setQuery(""); setSelectedGenres([]); setYearFrom(1990); setYearTo(new Date().getFullYear());
    setStatus(""); setStudio(""); setRatingMin(0); setSortBy("rating");
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[24px] font-bold mb-2" style={{ color: "var(--nv-text-primary)" }}>
            {isRTL ? "البحث المتقدم" : "Advanced Search"}
          </h1>
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex-1 relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${isRTL ? "right-3" : "left-3"}`} style={{ color: "var(--nv-text-dim)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={isRTL ? "ابحث عن أنمي..." : "Search anime..."}
                className={`w-full h-11 rounded-xl text-[14px] admin-input ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"}`} />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <motion.div className="lg:col-span-1 space-y-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-xl p-4 space-y-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className="text-[13px] font-semibold flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
                  <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: "var(--nv-gold)"}} />{isRTL ? "الفلاتر" : "Filters"}
                </h3>
                <button onClick={clearFilters} className="text-[10px] flex items-center gap-1 transition-colors hover:text-[#D4AF37]" style={{ color: "var(--nv-text-dim)" }}>
                  <X className="w-3 h-3" />{isRTL ? "مسح" : "Clear"}
                </button>
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-medium block mb-1.5" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "الحالة" : "Status"}</label>
                <div className="flex flex-wrap gap-1">
                  {["Ongoing", "Completed", "Upcoming"].map((s) => (
                    <button key={s} onClick={() => setStatus(status === s ? "" : s)}
                      className="text-[10px] px-2.5 py-1 rounded-full transition-all"
                      style={{ background: status === s ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", color: status === s ? "#D4AF37" : "var(--nv-text-muted)", border: status === s ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="text-[11px] font-medium block mb-1.5" style={{ color: "var(--nv-text-muted)" }}>
                  <Calendar className="w-3 h-3 inline mr-1" />{isRTL ? "السنة" : "Year"}: {yearFrom} - {yearTo}
                </label>
                <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <select value={yearFrom} onChange={(e) => setYearFrom(Number(e.target.value))} className="flex-1 h-8 rounded-lg text-[11px] admin-input">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select value={yearTo} onChange={(e) => setYearTo(Number(e.target.value))} className="flex-1 h-8 rounded-lg text-[11px] admin-input">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-[11px] font-medium block mb-1.5" style={{ color: "var(--nv-text-muted)" }}>
                  <Star className="w-3 h-3 inline mr-1" />{isRTL ? "التقييم الأدنى" : "Min Rating"}: {ratingMin}
                </label>
                <input type="range" min="0" max="10" step="0.5" value={ratingMin} onChange={(e) => setRatingMin(Number(e.target.value))}
                  className="w-full h-1 accent-[#D4AF37] cursor-pointer" />
              </div>

              {/* Studio */}
              <div>
                <label className="text-[11px] font-medium block mb-1.5" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "الاستوديو" : "Studio"}</label>
                <select value={studio} onChange={(e) => setStudio(e.target.value)} className="w-full h-8 rounded-lg text-[11px] admin-input">
                  <option value="">{isRTL ? "الكل" : "All"}</option>
                  {STUDIOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Genres */}
              <div>
                <label className="text-[11px] font-medium block mb-1.5" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "التصنيفات" : "Genres"}</label>
                <div className="flex flex-wrap gap-1">
                  {GENRES.map((g) => (
                    <button key={g} onClick={() => toggleGenre(g)}
                      className="text-[9px] px-2 py-1 rounded-full transition-all"
                      style={{ background: selectedGenres.includes(g) ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", color: selectedGenres.includes(g) ? "#D4AF37" : "var(--nv-text-dim)", border: selectedGenres.includes(g) ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="text-[13px]" style={{ color: "var(--nv-text-muted)" }}>{filtered.length} {isRTL ? "نتيجة" : "results"}</span>
              <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.02)" }}>
                {(["rating", "year", "title"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className="px-3 py-1 rounded-md text-[11px] font-medium transition-all"
                    style={{ background: sortBy === s ? "rgba(212,175,55,0.08)" : "transparent", color: sortBy === s ? "#D4AF37" : "var(--nv-text-muted)" }}>
                    {s === "rating" ? <Star className="w-3 h-3 inline mr-1" /> : s === "year" ? <Calendar className="w-3 h-3 inline mr-1" /> : <Hash className="w-3 h-3 inline mr-1" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
                <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "لا توجد نتائج" : "No results found"}</p>
                <p className="text-[12px] mt-1" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "جرب تغيير الفلاتر" : "Try adjusting your filters"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map((anime, i) => (
                  <AnimeCard key={anime.id} anime={anime as any} index={i} onClick={() => navigate(`/watch/${(anime as any).id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
