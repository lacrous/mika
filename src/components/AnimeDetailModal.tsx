import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Play, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { AnimeDetailModalProps } from "@/types";

export function AnimeDetailModal({ anime, isOpen, onClose }: AnimeDetailModalProps) {
 const { t, isRTL } = useLanguage();

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = "hidden";
 } else {
 document.body.style.overflow = "";
 }
 return () => {
 document.body.style.overflow = "";
 };
 }, [isOpen]);

 useEffect(() => {
 const handleEsc = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 };
 window.addEventListener("keydown", handleEsc);
 return () => window.removeEventListener("keydown", handleEsc);
 }, [onClose]);

 if (!anime) return null;

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center">
 <motion.div
 className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 onClick={onClose}
 />

 <motion.div
 className="relative z-10 w-[calc(100%-2rem)] max-w-[520px] bg-[var(--nv-bg-secondary)] border border-[var(--nv-border)] rounded-2xl overflow-hidden"
 style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.6)" }}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
 >
 <div className="relative h-[240px] overflow-hidden">
 <img
 src={anime.image}
 alt={anime.title}
 className="w-full h-full object-cover"
 />
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(to top, #111111 0%, transparent 60%)",
 }}
 />

 <button
 onClick={onClose}
 className={`absolute top-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(212,175,55,0.2)] group ${isRTL ? "left-4" : "right-4"}`}
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(12px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <X className="w-4 h-4 text-white group-hover:text-[#D4AF37] transition-colors" />
 </button>
 </div>

 <div className="px-6 pb-6 -mt-12 relative z-10">
 <h2 className="text-[24px] font-bold text-white">{anime.title}</h2>

 <div className={`flex items-center gap-3 mt-2`}>
 <div className="flex items-center gap-1">
 <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
 <span className="text-[#D4AF37] font-medium text-[14px]">{anime.rating}</span>
 </div>
 <span className="text-[#9CA3AF] text-[14px]">{anime.year}</span>
 <span className="text-[#9CA3AF] text-[14px]">{anime.episodes} {t("modal.episodes")}</span>
 </div>

 <div className="flex flex-wrap gap-2 mt-4">
 {anime.genres.map((genre) => (
 <span
 key={genre}
 className="text-[12px] text-[#E0E0E0] px-3 py-1 rounded-full"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(8px)",
 border: "1px solid rgba(255, 255, 255, 0.08)",
 }}
 >
 {genre}
 </span>
 ))}
 </div>

 <div className="h-px bg-[#2a2a2a] my-5" />

 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider">{t("modal.status")}</p>
 <p className="text-[14px] text-white mt-0.5">{anime.status}</p>
 </div>
 <div>
 <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider">{t("modal.studio")}</p>
 <p className="text-[14px] text-white mt-0.5">{anime.studio}</p>
 </div>
 </div>

 <p className="text-[14px] text-[#E0E0E0] leading-relaxed mt-5">{anime.synopsis}</p>

 <div className={`flex gap-3 mt-6`}>
 <button
 className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[#D4AF37] font-semibold text-[14px] transition-all duration-300 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <Play className="w-4 h-4 fill-[#D4AF37]" />
 {t("modal.watchNow")}
 </button>
 <button
 className="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <Heart className="w-5 h-5 text-[#9CA3AF] hover:text-[#D4AF37] transition-colors" />
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
