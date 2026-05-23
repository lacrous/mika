import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeGridSkeleton } from "@/components/AnimeCardSkeleton";
import { FilterDropdown } from "@/components/FilterDropdown";
import { SortToggle } from "@/components/SortToggle";
import { filterCategories } from "@/data/anime";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import type { Anime } from "@/types";

interface TopPicksGridProps {
 onAnimeClick: (anime: Anime) => void;
 isLoading?: boolean;
}

export function TopPicksGrid({ onAnimeClick, isLoading = false }: TopPicksGridProps) {
 const [selectedCategory, setSelectedCategory] = useState("All");
 const [sort, setSort] = useState<"popular" | "latest">("popular");
 const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.05 });
 const { t, isRTL } = useLanguage();

 const animeQuery = trpc.anime.list.useQuery({ limit: 100 }, { retry: false });
 const allAnime: Anime[] = (animeQuery.data || []).map((a: any) => ({
 ...a,
 rating: typeof a.rating === "number" && a.rating > 10 ? a.rating / 10 : a.rating,
 id: a.id,
 }));

 const filteredAnime = useMemo(() => {
 let result = [...allAnime];
 if (selectedCategory !== "All") {
 result = result.filter((anime) =>
 anime.genres.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
 );
 }
 if (sort === "popular") {
 result.sort((a, b) => b.rating - a.rating);
 } else {
 result.sort((a, b) => b.year - a.year);
 }
 return result;
 }, [allAnime, selectedCategory, sort]);

 const isEmpty = !isLoading && !animeQuery.isLoading && filteredAnime.length === 0;

 return (
 <motion.section
 ref={sectionRef}
 id="top-picks"
 className="relative py-[60px]" style={{ background: "var(--nv-bg-body)" }}
 dir={isRTL ? "rtl" : "ltr"}
 initial={{ opacity: 0, y: 50, scale: 0.98 }}
 whileInView={{ opacity: 1, y: 0, scale: 1 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
 >
 <div className="absolute top-0 left-0 right-0 h-px" style={{
 background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)",
 }} />

 <div
 style={{
 paddingInlineStart: "clamp(5vw, 8vw, 10vw)",
 paddingInlineEnd: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 <motion.h2
 className={`text-[28px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent mb-6 ${isRTL ? "text-end" : "text-start"}`}
 style={{ perspective: 600 }}
 initial={{ opacity: 0, rotateX: -10 }}
 whileInView={{ opacity: 1, rotateX: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 >
 {t("topPicks.title")}
 </motion.h2>

 <div className={`flex items-center justify-between mb-8 flex-wrap gap-3`}>
 <FilterDropdown
 label={t("topPicks.category")}
 categories={filterCategories}
 selected={selectedCategory}
 onSelect={setSelectedCategory}
 />
 <SortToggle
 popularLabel={t("topPicks.popular")}
 latestLabel={t("topPicks.latest")}
 sort={sort}
 onToggle={() => setSort(sort === "popular" ? "latest" : "popular")}
 />
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
 {isLoading || animeQuery.isLoading ? (
 <AnimeGridSkeleton count={10} />
 ) : (
 filteredAnime.map((anime, i) => (
 <div key={`${anime.id}-${i}`}>
 {isInView && (
 <AnimeCard
 anime={anime}
 index={i}
 onClick={() => onAnimeClick(anime)}
 />
 )}
 </div>
 ))
 )}
 </div>

 {isEmpty && (
 <motion.div
 className="text-center py-16"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 >
 <p className="text-[#9CA3AF] text-[16px]">{t("topPicks.noResults")}</p>
 <button
 onClick={() => setSelectedCategory("All")}
 className="mt-3 text-[#D4AF37] text-[14px] hover:underline"
 >
 {t("topPicks.showAll")}
 </button>
 </motion.div>
 )}
 </div>
 </motion.section>
 );
}
