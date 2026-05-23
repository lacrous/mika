import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeCardSkeleton } from "@/components/AnimeCardSkeleton";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import type { Anime } from "@/types";

interface TrendingCarouselProps {
 onAnimeClick: (anime: Anime) => void;
 isLoading?: boolean;
}

export function TrendingCarousel({ onAnimeClick, isLoading = false }: TrendingCarouselProps) {
 const scrollRef = useRef<HTMLDivElement>(null);
 const [currentIndex, setCurrentIndex] = useState(0);
 const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
 const { t, isRTL } = useLanguage();

 const trendingQuery = trpc.anime.trending.useQuery(undefined, { retry: false });
 const trendingAnime: Anime[] = trendingQuery.data?.map((a: any) => ({
 ...a,
 rating: typeof a.rating === "number" && a.rating > 10 ? a.rating / 10 : a.rating,
 id: a.id,
 })) || [];

 const cardWidth = 196;
 const visibleCards = 5;

 const scroll = (direction: "left" | "right") => {
 if (!scrollRef.current) return;
 const container = scrollRef.current;
 const scrollAmount = container.clientWidth * 0.8;
 if (isRTL) {
 container.scrollBy({
 left: direction === "left" ? scrollAmount : -scrollAmount,
 behavior: "smooth",
 });
 } else {
 container.scrollBy({
 left: direction === "left" ? -scrollAmount : scrollAmount,
 behavior: "smooth",
 });
 }
 };

 const handleScroll = () => {
 if (!scrollRef.current) return;
 const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth);
 setCurrentIndex(Math.max(0, Math.min(newIndex, trendingAnime.length - visibleCards)));
 };

 const isEmpty = !isLoading && trendingAnime.length === 0;

 return (
 <motion.section
 ref={sectionRef}
 id="trending"
 className="relative pt-20 pb-10" style={{ background: "var(--nv-bg-body)" }}
 dir={isRTL ? "rtl" : "ltr"}
 initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Section gradient divider */}
 <div className="absolute top-0 left-0 right-0 h-px" style={{
 background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)",
 }} />
 <div
 className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
 backgroundRepeat: "repeat",
 backgroundSize: "256px 256px",
 opacity: 0.04,
 mixBlendMode: "overlay",
 maskImage: "linear-gradient(to bottom, black, transparent)",
 WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
 }}
 />

 <div
 style={{
 paddingInlineStart: "clamp(5vw, 8vw, 10vw)",
 paddingInlineEnd: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 <div className={`flex items-center justify-between mb-6`}>
 <motion.div
 className={`flex items-center gap-4`}
 style={{ perspective: 600 }}
 initial={{ opacity: 0, rotateY: isRTL ? -15 : 15 }}
 whileInView={{ opacity: 1, rotateY: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 >
 <h2 className="text-[28px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent">
 {t("trending.title")}
 </h2>
 <span className="font-mono text-[12px] text-[#9CA3AF] hidden sm:block">
 <span className="text-[#D4AF37]">
 {String(currentIndex + 1).padStart(2, "0")}
 </span>
 <span className="mx-1">/</span>
 <span>{String(Math.max(1, trendingAnime.length - visibleCards + 1)).padStart(2, "0")}</span>
 </span>
 </motion.div>

 <div className={`flex items-center gap-3`}>
 <a
 href="/browse"
 className="text-[14px] font-medium text-[#D4AF37] hover:underline hidden sm:block"
 >
 {isRTL ? `\u2190 ${t("trending.viewAll")}` : `${t("trending.viewAll")} \u2192`}
 </a>

 <div className={`flex gap-2`}>
 <button
 onClick={() => scroll("left")}
 className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.3)]"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 >
 <ChevronLeft className="w-4 h-4 text-white rtl-flip" />
 </button>
 <button
 onClick={() => scroll("right")}
 className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.3)]"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 >
 <ChevronRight className="w-4 h-4 text-white rtl-flip" />
 </button>
 </div>
 </div>
 </div>
 </div>

 <div
 ref={scrollRef}
 onScroll={handleScroll}
 className="flex gap-5 overflow-x-auto scrollbar-hide"
 style={{
 paddingInlineStart: "clamp(5vw, 8vw, 10vw)",
 paddingInlineEnd: "clamp(5vw, 8vw, 10vw)",
 scrollBehavior: "smooth",
 scrollbarWidth: "none",
 msOverflowStyle: "none",
 direction: isRTL ? "rtl" : "ltr",
 }}
 >
 {isLoading || trendingQuery.isLoading ? (
 Array.from({ length: 5 }).map((_, i) => (
 <div key={i} className="flex-shrink-0" style={{ width: "calc((100% - 80px) / 5)", minWidth: 160 }}>
 <AnimeCardSkeleton />
 </div>
 ))
 ) : isEmpty ? (
 <div className="w-full text-center py-8">
 <p className="text-[#9CA3AF] text-[14px]">{isRTL ? "لا يوجد أنمي شائع" : "No trending anime"}</p>
 </div>
 ) : (
 trendingAnime.map((anime, i) => (
 <div
 key={anime.id}
 className="flex-shrink-0"
 style={{ width: "calc((min(90vw, 1400px) - 80px) / 5)", minWidth: 160 }}
 >
 {isInView && (
 <AnimeCard
 anime={anime}
 compact
 index={i}
 onClick={() => onAnimeClick(anime)}
 />
 )}
 </div>
 ))
 )}
 </div>
 </motion.section>
 );
}
