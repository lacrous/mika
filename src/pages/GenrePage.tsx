import { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { useLanguage } from "@/context/LanguageContext";
import { allAnimeList, genreColors } from "@/data/adminData";

const genreDescriptions: Record<string, { en: string; ar: string }> = {
 Action: { en: "High-energy battles, thrilling combat, and adrenaline-pumping sequences.", ar: "معارك عالية الطاقة وقتال مثير ومشاهد مليئة بالأدرينالين." },
 Adventure: { en: "Epic journeys, exploration, and quests to unknown lands.", ar: "رحلات ملحمية واستكشاف ومهام إلى أراضٍ مجهولة." },
 Fantasy: { en: "Magical worlds, mythical creatures, and supernatural powers.", ar: "عوالم سحرية ومخلوقات أسطورية وقوى خارقة." },
 "Sci-Fi": { en: "Futuristic technology, space exploration, and alternate realities.", ar: "تكنولوجيا المستقبل واستكشاف الفضاء وواقع بديل." },
 Romance: { en: "Heartfelt relationships, emotional connections, and love stories.", ar: "علاقات صادقة وروابط عاطفية وقصص حب." },
 Horror: { en: "Dark atmospheres, terrifying creatures, and psychological thrillers.", ar: "أجواء مظلمة ومخلوقات مرعبة وأعمال إثارة نفسية." },
 Comedy: { en: "Humor, witty dialogue, and lighthearted entertainment.", ar: "فكاهة وحوار ساخر وترفيه خفيف." },
 Drama: { en: "Intense storytelling, emotional depth, and character-driven narratives.", ar: "سرد مكثف وعمق عاطفي وسرد يعتمد على الشخصيات." },
};

export function GenrePage() {
 const { genreName } = useParams<{ genreName: string }>();
 const navigate = useNavigate();
 const { isRTL } = useLanguage();

 const genre = genreName || "";
 const decodedGenre = decodeURIComponent(genre);
 const desc = genreDescriptions[decodedGenre] || { en: `Explore the best ${decodedGenre} anime.`, ar: `استكشف أفضل أنمي ${decodedGenre}.` };

 const filtered = useMemo(() => {
 return allAnimeList.filter((a) =>
 a.genres.some((g) => g.toLowerCase() === decodedGenre.toLowerCase())
 );
 }, [decodedGenre]);

 const avgRating = filtered.length > 0 ? (filtered.reduce((s, a) => s + a.rating, 0) / filtered.length).toFixed(1) : "0";
 const color = genreColors[decodedGenre] || "#D4AF37";

 return (
 <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
 {/* Hero Banner */}
 <div className="relative overflow-hidden mb-10" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${color}20, transparent 50%), radial-gradient(circle at 80% 50%, ${color}15, transparent 50%)` }} />
 <div style={{ paddingInline: "clamp(5vw, 8vw, 10vw)" }} className="relative py-12">
 <button onClick={() => navigate("/browse")} className={`flex items-center gap-2 text-[13px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors mb-4`}>
 <ArrowLeft className="w-4 h-4 rtl-flip" />
 {isRTL ? "العودة إلى التصفح" : "Back to Browse"}
 </button>
 <motion.h1 className="text-[36px] font-bold text-white mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
 {decodedGenre}
 </motion.h1>
 <motion.p className="text-[14px] text-[#9CA3AF] max-w-[500px] mb-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
 {isRTL ? desc.ar : desc.en}
 </motion.p>
 <motion.div className={`flex items-center gap-4`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
 <span className="text-[12px] text-[#9CA3AF]">{filtered.length} {isRTL ? "أنمي" : "anime"}</span>
 <span className="flex items-center gap-1 text-[12px] text-[#D4AF37]">
 <Star className="w-3 h-3 fill-[#D4AF37]" />
 {isRTL ? `متوسط التقييم ${avgRating}` : `Avg. Rating ${avgRating}`}
 </span>
 </motion.div>
 </div>
 </div>

 {/* Anime Grid */}
 <div style={{ paddingInline: "clamp(5vw, 8vw, 10vw)" }}>
 {filtered.length > 0 ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
 {filtered.map((anime, i) => (
 <AnimeCard key={anime.id} anime={anime} index={i} onClick={() => navigate(`/anime/${anime.id}`)} />
 ))}
 </div>
 ) : (
 <div className="text-center py-20">
 <p className="text-[18px] text-white mb-2">{isRTL ? "لا يوجد أنمي في هذا التصنيف" : "No anime found in this genre"}</p>
 <p className="text-[14px] text-[#9CA3AF]">{isRTL ? "جرب تصنيفاً آخر" : "Try a different genre"}</p>
 </div>
 )}
 </div>
 </div>
 );
}
