import { motion } from "framer-motion";
import { Play, Heart, ChevronDown } from "lucide-react";
import { heroAnime } from "@/data/anime";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
 const { t, isRTL } = useLanguage();
 const titleWords = heroAnime.title.split(" ");

 return (
 <section className="relative min-h-[85vh] overflow-hidden">
 <div className="absolute inset-0">
 <img
 src={heroAnime.image}
 alt={heroAnime.title}
 className="w-full h-full object-cover"
 />
 </div>

 <div
 className="absolute inset-0 pointer-events-none z-[1]"
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
 backgroundRepeat: "repeat",
 backgroundSize: "256px 256px",
 opacity: 0.04,
 mixBlendMode: "overlay",
 }}
 />

 <div
 className="absolute inset-0 z-[2]"
 style={{
 background:
 "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 40%, transparent 70%)",
 }}
 />
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background: isRTL
 ? "linear-gradient(to left, rgba(10,10,10,0.7) 0%, transparent 50%)"
 : "linear-gradient(to right, rgba(10,10,10,0.7) 0%, transparent 50%)",
 }}
 />

 <div
 className="absolute bottom-0 z-[3] pb-[8vh]"
 style={{
 left: isRTL ? "auto" : 0,
 right: isRTL ? 0 : "auto",
 paddingLeft: isRTL ? "5vw" : "clamp(5vw, 8vw, 10vw)",
 paddingRight: isRTL ? "clamp(5vw, 8vw, 10vw)" : "5vw",
 }}
 >
 <div className={`flex gap-5 items-start`}>
 <motion.div
 className="w-px bg-[#D4AF37] opacity-40 flex-shrink-0 mt-2"
 style={{ height: 60 }}
 initial={{ scaleY: 0, opacity: 0 }}
 animate={{ scaleY: 1, opacity: 0.4 }}
 transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
 />

 <div className="max-w-[640px]">
 <motion.div
 className="inline-flex items-center bg-gradient-to-r from-[#D4AF37] to-[#F0D878] text-[#0a0a0a] text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-sm mb-4"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
 >
 {t("hero.trendingNow")}
 </motion.div>

 <h1 className="text-[32px] md:text-[64px] font-normal text-white leading-[1.1] tracking-[-0.02em] font-mono" dir="ltr">
 {titleWords.map((word, i) => (
 <motion.span
 key={i}
 className="inline-block mx-[0.15em]"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{
 duration: 0.6,
 delay: 0.3 + i * 0.08,
 ease: [0.22, 1, 0.36, 1],
 }}
 >
 {word}
 </motion.span>
 ))}
 </h1>

 <motion.p
 className="text-[15px] mt-3 bg-gradient-to-r from-[#F0D878] to-[#D4AF37] bg-clip-text text-transparent"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
 >
 Season 4 &middot; Action &middot; Adventure
 </motion.p>

 <motion.p
 className="text-[16px] text-[#E0E0E0] leading-relaxed mt-4 line-clamp-3 max-w-[500px]"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
 >
 {heroAnime.synopsis}
 </motion.p>

 <motion.div
 className={`flex gap-4 mt-8`}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.86, ease: [0.22, 1, 0.36, 1] }}
 >
 <button
 className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-[16px] transition-all duration-300 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.12)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
 }}
 >
 <Play className="w-4 h-4 fill-white" />
 {t("hero.playNow")}
 </button>

 <button
 className="flex items-center gap-2 px-6 py-3 rounded-lg text-[#9CA3AF] font-semibold text-[16px] transition-all duration-300 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.12)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
 }}
 >
 <Heart className="w-4 h-4" />
 {t("hero.addFavorites")}
 </button>
 </motion.div>
 </div>
 </div>
 </div>

 <motion.div
 className="absolute bottom-[4vh] z-[3] w-9 h-9 rounded-full flex items-center justify-center"
 style={{
 right: isRTL ? "auto" : "5vw",
 left: isRTL ? "5vw" : "auto",
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 animate={{ y: [0, 6, 0] }}
 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
 >
 <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
 </motion.div>
 </section>
 );
}
