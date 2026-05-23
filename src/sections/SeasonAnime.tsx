import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeCardSkeleton } from "@/components/AnimeCardSkeleton";
import { seasonAnimeData } from "@/data/seasonAnime";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";
import type { Anime } from "@/types";

interface SeasonAnimeProps {
 onAnimeClick: (anime: Anime) => void;
 isLoading?: boolean;
}

export function SeasonAnime({ onAnimeClick, isLoading = false }: SeasonAnimeProps) {
 const scrollRef = useRef<HTMLDivElement>(null);
 const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
 const { isRTL } = useLanguage();

 const scroll = (direction: "left" | "right") => {
 if (!scrollRef.current) return;
 const container = scrollRef.current;
 const scrollAmount = container.clientWidth * 0.8;
 // In RTL mode, scrollLeft semantics are reversed.
 // "left" visually = scroll toward the LEFT edge = scrollLeft increases (toward 0)
 // "right" visually = scroll toward the RIGHT edge = scrollLeft decreases (more negative)
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

 return (
 <motion.section
 ref={sectionRef}
 className="relative pt-16 pb-10" style={{ background: "var(--nv-bg-body)" }}
 dir={isRTL ? "rtl" : "ltr"}
 initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Section gradient divider */}
 <div className="absolute top-0 left-0 right-0 h-px" style={{
 background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)",
 }} />

 {/* Dither noise band at top */}
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
 {/* Header Row */}
 <div className={`flex items-center justify-between mb-6`}>
 <div className={`flex items-center gap-3`}>
 <Calendar className="w-6 h-6 text-[#D4AF37]" />
 <motion.h2
 className="text-[28px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent"
 style={{ perspective: 600 }}
 initial={{ opacity: 0, rotateY: isRTL ? -15 : 15 }}
 whileInView={{ opacity: 1, rotateY: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 >
 {isRTL ? "أنميات الموسم" : "Season Anime"}
 </motion.h2>
 <span className="font-mono text-[12px] text-[#9CA3AF] hidden sm:block bg-[rgba(255,255,255,0.04)] px-2 py-1 rounded-md border border-[rgba(255,255,255,0.06)]">
 Spring 2024
 </span>
 </div>

 {/* Navigation Arrows */}
 <div className={`flex gap-2`}>
 <button
 onClick={() => scroll("left")}
 className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.3)] hover:scale-110"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 aria-label="Scroll left"
 >
 <ChevronLeft
 className="w-4 h-4 text-white rtl-flip"
 />
 </button>
 <button
 onClick={() => scroll("right")}
 className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.3)] hover:scale-110"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 aria-label="Scroll right"
 >
 <ChevronRight
 className="w-4 h-4 text-white rtl-flip"
 />
 </button>
 </div>
 </div>
 </div>

 {/* Horizontal Scroll Container */}
 <div
 ref={scrollRef}
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
 {isLoading ? (
 Array.from({ length: 5 }).map((_, i) => (
 <div
 key={i}
 className="flex-shrink-0"
 style={{ width: "calc((min(90vw, 1400px) - 80px) / 5)", minWidth: 160 }}
 >
 <AnimeCardSkeleton />
 </div>
 ))
 ) : (
 seasonAnimeData.map((item, i) => {
 const anime: Anime = {
 id: item.id,
 title: item.title,
 year: item.year,
 rating: item.rating,
 genres: item.genres,
 image: item.image,
 synopsis: `${item.title} - ${item.season} season anime with ${item.episodes} episodes.`,
 episodes: item.episodes,
 status: item.status,
 studio: "Various",
 };
 return (
 <div
 key={item.id}
 className="flex-shrink-0"
 style={{ width: "calc((min(90vw, 1400px) - 80px) / 5)", minWidth: 160 }}
 >
 {isInView && (
 <AnimeCard
 anime={anime}
 index={i}
 onClick={() => onAnimeClick(anime)}
 />
 )}
 </div>
 );
 })
 )}
 </div>
 </motion.section>
 );
}
