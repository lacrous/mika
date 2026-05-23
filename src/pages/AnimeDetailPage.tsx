import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
 Play,
 Star,
 Heart,
 Clock,
 Calendar,
 ArrowLeft,
 Plus,
 ChevronRight,
 Tv,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { ReviewsSection } from "@/components/ReviewsSection";
import { CommentsSection } from "@/components/CommentsSection";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { CastSection } from "@/components/CastSection";
import { TrailerModal } from "@/components/TrailerModal";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { CalendarView } from "@/components/CalendarView";
import { trendingAnime, topPicksAnime } from "@/data/anime";
import { seasonAnimeData } from "@/data/seasonAnime";
import { getSeasonsForAnime } from "@/data/animeSeasons";
import type { Anime } from "@/types";

// Map season anime data to full Anime type
const seasonAnimeMapped: Anime[] = seasonAnimeData.map((s) => ({
 id: s.id,
 title: s.title,
 year: s.year,
 rating: s.rating,
 genres: s.genres,
 image: s.image,
 synopsis: `${s.title} — ${s.season} season anime with ${s.episodes} episodes.`,
 episodes: s.episodes,
 status: s.status,
 studio: "Various",
}));

// Combine ALL anime data sources
const allAnime = [...trendingAnime, ...topPicksAnime, ...seasonAnimeMapped];

export function AnimeDetailPage() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const { isRTL } = useLanguage();
 const { isAuthenticated } = useAuth();

 // Find the anime
 const anime = allAnime.find((a) => String(a.id) === id);

 if (!anime) {
 return (
 <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
 <p className="text-white text-xl">Anime not found</p>
 </div>
 );
 }

 // Related anime (same genres)
 const related = allAnime
 .filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)))
 .slice(0, 6);

 // Get seasons for this anime
 const seasons = getSeasonsForAnime(anime.title);

 return (
 <div className="min-h-screen bg-[#0a0a0a]">
 {/* ── Hero Banner ── */}
 <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
 <img
 src={anime.image}
 alt={anime.title}
 className="w-full h-full object-cover"
 />
 <div
 className="absolute inset-0"
 style={{
 background:
 "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.3) 100%)",
 }}
 />

 {/* Back Button */}
 <button
 onClick={() => navigate("/")}
 className={`absolute top-6 z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] text-[#E0E0E0] transition-all duration-200 hover:text-[#D4AF37] ${isRTL ? "right-6" : "left-6"}`}
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 >
 <ArrowLeft className="w-4 h-4 rtl-flip" />
 {isRTL ? "العودة" : "Back"}
 </button>

 {/* Content */}
 <div
 className="absolute bottom-0 left-0 right-0"
 style={{
 paddingInline: "clamp(5vw, 8vw, 10vw)",
 paddingBottom: "40px",
 }}
 >
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Genres */}
 <div className={`flex flex-wrap gap-2 mb-4`}>
 {anime.genres.map((g) => (
 <button
 key={g}
 onClick={() => navigate(`/genre/${g}`)}
 className="text-[12px] text-[#D4AF37] px-3 py-1 rounded-full cursor-pointer hover:bg-[rgba(212,175,55,0.25)] hover:scale-105 transition-all"
 style={{
 background: "rgba(212, 175, 55, 0.12)",
 border: "1px solid rgba(212, 175, 55, 0.2)",
 }}
 >
 {g}
 </button>
 ))}
 </div>

 {/* Title */}
 <h1
 className="text-[32px] md:text-[48px] font-bold text-white leading-[1.1] mb-3"
 dir="ltr"
 >
 {anime.title}
 </h1>

 {/* Meta Row */}
 <div className={`flex items-center gap-5 text-[14px]`}>
 <div className="flex items-center gap-1.5">
 <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
 <span className="text-[#D4AF37] font-medium">{anime.rating}</span>
 </div>
 <div className="flex items-center gap-1.5 text-[#9CA3AF]">
 <Calendar className="w-4 h-4" />
 <span>{anime.year}</span>
 </div>
 <div className="flex items-center gap-1.5 text-[#9CA3AF]">
 <Clock className="w-4 h-4" />
 <span>
 {anime.episodes} {isRTL ? "حلقة" : "Episodes"}
 </span>
 </div>
 <span
 className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
 style={{
 background:
 anime.status === "Ongoing"
 ? "rgba(34, 197, 94, 0.15)"
 : "rgba(212, 175, 55, 0.15)",
 color:
 anime.status === "Ongoing" ? "#22c55e" : "#D4AF37",
 border:
 anime.status === "Ongoing"
 ? "1px solid rgba(34, 197, 94, 0.3)"
 : "1px solid rgba(212, 175, 55, 0.3)",
 }}
 >
 {anime.status}
 </span>
 </div>

 {/* CTA Buttons */}
 <div className={`flex gap-3 mt-6`}>
 <button
 onClick={() => navigate(`/watch/${anime.id}`)}
 className="flex items-center gap-2 px-8 py-3 rounded-lg text-[#0a0a0a] font-semibold text-[15px] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] cursor-pointer"
 style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}
 >
 <Play className="w-5 h-5 fill-[#0a0a0a]" />
 {isRTL ? "شاهد الآن" : "Watch Now"}
 </button>

 <button
 className="flex items-center gap-2 px-6 py-3 rounded-lg text-[#E0E0E0] font-medium text-[14px] transition-all duration-300 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)] hover:border-[rgba(212,175,55,0.3)]"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 >
 <Heart className="w-4 h-4" />
 {isRTL ? "المفضلة" : "Favorite"}
 </button>

 {isAuthenticated && (
 <button
 className="flex items-center gap-2 px-6 py-3 rounded-lg text-[#E0E0E0] font-medium text-[14px] transition-all duration-300 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)]"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 >
 <Plus className="w-4 h-4" />
 {isRTL ? "قائمتي" : "My List"}
 </button>
 )}
 </div>
 </motion.div>
 </div>
 </section>

 {/* ── Info Grid ── */}
 <section
 className="py-10"
 style={{
 paddingInline: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Synopsis */}
 <motion.div
 className="lg:col-span-2"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1, duration: 0.5 }}
 >
 <h2 className="text-[20px] font-bold text-white mb-4">
 {isRTL ? "القصة" : "Synopsis"}
 </h2>
 <p className="text-[15px] text-[#E0E0E0] leading-relaxed">
 {anime.synopsis}
 </p>

 {/* Studio & Info */}
 <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
 {[
 { label: isRTL ? "الاستوديو" : "Studio", value: anime.studio },
 { label: isRTL ? "الحالة" : "Status", value: anime.status },
 { label: isRTL ? "السنة" : "Year", value: String(anime.year) },
 { label: isRTL ? "التقييم" : "Rating", value: String(anime.rating) },
 ].map((item) => (
 <div
 key={item.label}
 className="rounded-xl p-4"
 style={{
 background: "rgba(255, 255, 255, 0.04)",
 border: "1px solid rgba(255, 255, 255, 0.06)",
 }}
 >
 <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1">
 {item.label}
 </p>
 <p className="text-[15px] text-white font-medium">{item.value}</p>
 </div>
 ))}
 </div>
 </motion.div>

 {/* Episodes Preview */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2, duration: 0.5 }}
 >
 <h2 className="text-[20px] font-bold text-white mb-4">
 {isRTL ? "الحلقات" : "Episodes"}
 </h2>
 <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
 {Array.from({ length: Math.min(anime.episodes, 12) }).map((_, i) => (
 <button
 key={i}
 onClick={() => navigate(`/watch/${anime.id}`)}
 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)] group text-left cursor-pointer"
 style={{
 background: i === 0 ? "rgba(212, 175, 55, 0.08)" : "rgba(255, 255, 255, 0.03)",
 border: i === 0 ? "1px solid rgba(212, 175, 55, 0.2)" : "1px solid rgba(255, 255, 255, 0.04)",
 }}
 >
 <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
 {i === 0 ? (
 <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
 ) : (
 <span className="text-[11px] text-[#9CA3AF] font-mono">
 {String(i + 1).padStart(2, "0")}
 </span>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[13px] text-white truncate">
 {isRTL ? "الحلقة" : "Episode"} {i + 1}
 </p>
 {i === 0 && (
 <p className="text-[11px] text-[#D4AF37] mt-0.5">
 {isRTL ? "متابعة" : "Continue"}
 </p>
 )}
 </div>
 <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-[#D4AF37] transition-colors" />
 </button>
 ))}
 {anime.episodes > 12 && (
 <button
 onClick={() => navigate(`/watch/${anime.id}`)}
 className="w-full text-center py-2 text-[13px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors cursor-pointer"
 >
 {isRTL ? "عرض الكل" : `View all ${anime.episodes} episodes`} →
 </button>
 )}
 </div>
 </motion.div>
 </div>
 </section>

 {/* ── Seasons ── */}
 {seasons && seasons.length > 0 && (
 <section
 className="pb-10"
 style={{
 paddingInline: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 <div className="h-px bg-[#2a2a2a] mb-10" />
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 <div className={`flex items-center gap-3 mb-6`}>
 <Tv className="w-6 h-6 text-[#D4AF37]" />
 <h2 className="text-[22px] font-bold bg-gradient-to-r from-[#F0D878] to-[#D4AF37] bg-clip-text text-transparent">
 {isRTL ? "المواسم" : "Seasons"}
 </h2>
 <span className="font-mono text-[12px] text-[#9CA3AF] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.06)]">
 {seasons.length} {isRTL ? "موسم" : "Seasons"}
 </span>
 </div>

 {/* Season Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {seasons.map((s, i) => (
 <motion.div
 key={s.seasonNumber}
 className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.04)",
 border: i === seasons.length - 1 && s.status === "Ongoing"
 ? "1px solid rgba(212, 175, 55, 0.3)"
 : "1px solid rgba(255, 255, 255, 0.06)",
 }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.05 * i, duration: 0.4 }}
 >
 {/* Ongoing Badge */}
 {s.status === "Ongoing" && (
 <div
 className={`absolute top-3 z-10 text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-sm ${isRTL ? "right-3" : "left-3"}`}
 style={{
 background: "rgba(34, 197, 94, 0.2)",
 color: "#22c55e",
 border: "1px solid rgba(34, 197, 94, 0.3)",
 }}
 >
 {isRTL ? "يعرض الآن" : "Airing"}
 </div>
 )}
 {s.status === "Upcoming" && (
 <div
 className={`absolute top-3 z-10 text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-sm ${isRTL ? "right-3" : "left-3"}`}
 style={{
 background: "rgba(59, 130, 246, 0.2)",
 color: "#60a5fa",
 border: "1px solid rgba(59, 130, 246, 0.3)",
 }}
 >
 {isRTL ? "قريباً" : "Upcoming"}
 </div>
 )}

 <div className="flex gap-4 p-4">
 {/* Thumbnail */}
 <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
 <img
 src={s.image}
 alt={s.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] to-transparent" />
 {/* Season Number Overlay */}
 <div className="absolute bottom-1 left-1 right-1 text-center">
 <span className="text-[10px] font-bold text-white bg-[rgba(0,0,0,0.6)] px-1.5 py-0.5 rounded">
 S{s.seasonNumber}
 </span>
 </div>
 </div>

 {/* Info */}
 <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
 <div>
 <h3 className="text-[14px] font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors duration-200">
 {s.title}
 </h3>
 <div className={`flex items-center gap-3 mt-2 text-[12px] text-[#9CA3AF]`}>
 <span className="flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 {s.year}
 </span>
 <span className="flex items-center gap-1">
 <Play className="w-3 h-3" />
 {s.episodes} {isRTL ? "حلقة" : "Ep"}
 </span>
 </div>
 </div>

 <div className={`flex items-center justify-between mt-3`}>
 <div className="flex items-center gap-1">
 <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
 <span className="text-[13px] text-[#D4AF37] font-medium">{s.rating}</span>
 </div>
 <span
 className="text-[11px] px-2 py-0.5 rounded-full"
 style={{
 background: s.status === "Completed"
 ? "rgba(212, 175, 55, 0.1)"
 : s.status === "Ongoing"
 ? "rgba(34, 197, 94, 0.1)"
 : "rgba(59, 130, 246, 0.1)",
 color: s.status === "Completed"
 ? "#D4AF37"
 : s.status === "Ongoing"
 ? "#22c55e"
 : "#60a5fa",
 border: `1px solid ${s.status === "Completed"
 ? "rgba(212, 175, 55, 0.2)"
 : s.status === "Ongoing"
 ? "rgba(34, 197, 94, 0.2)"
 : "rgba(59, 130, 246, 0.2)"}`,
 }}
 >
 {s.status}
 </span>
 </div>
 </div>
 </div>

 {/* Bottom accent line */}
 <div
 className="h-[2px] transition-all duration-300 group-hover:w-full"
 style={{
 width: s.status === "Ongoing" ? "100%" : "0%",
 background: "linear-gradient(to right, #D4AF37, #F0D878)",
 }}
 />
 </motion.div>
 ))}
 </div>
 </motion.div>
 </section>
 )}

 {/* ── Reviews Section ── */}
 <section
 className="pb-16"
 style={{
 paddingInline: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 <div className="h-px bg-[#2a2a2a] mb-10" />
 <ReviewsSection animeId={String(anime.id)} animeTitle={anime.title} />

            {/* Comments */}
            <CommentsSection animeId={anime.id} isRTL={isRTL} />

            {/* Recommendations */}
            <RecommendationsSection animeId={anime.id} isRTL={isRTL} />

            {/* Cast & Characters */}
            <CastSection animeId={anime.id} isRTL={isRTL} />
 </section>

 {/* ── Related Anime ── */}
 {related.length > 0 && (
 <section
 className="pb-16"
 style={{
 paddingInline: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 <div className="h-px bg-[#2a2a2a] mb-10" />
 <h2 className="text-[22px] font-bold bg-gradient-to-r from-[#F0D878] to-[#D4AF37] bg-clip-text text-transparent mb-6">
 {isRTL ? "أنميات مشابهة" : "You Might Also Like"}
 </h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
 {related.map((a, i) => (
 <motion.button
 key={a.id}
 onClick={() => navigate(`/anime/${a.id}`)}
 className="group text-left"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05, duration: 0.4 }}
 >
 <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
 <img
 src={a.image}
 alt={a.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 </div>
 <h3 className="text-[13px] font-medium text-white truncate group-hover:text-[#D4AF37] transition-colors">
 {a.title}
 </h3>
 <div className="flex items-center gap-1 mt-0.5">
 <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
 <span className="text-[11px] text-[#D4AF37]">{a.rating}</span>
 </div>
 </motion.button>
 ))}
 </div>
 </section>
 )}
 </div>
 );
}
