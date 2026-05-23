/**
 * NUROVIA CINEMATIC HERO
 * The centerpiece experience: layered motion, parallax depth, cinematic reveals.
 * Inspired by Linear, Apple, and Framer's approach to hero design.
 */
import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { heroSlides } from "@/data/heroSlides";
import { useLanguage } from "@/context/LanguageContext";
import { easings } from "@/core/tokens";
import { fadeUp, wordReveal, staggerContainer } from "@/core/motion";

/* Lazy particles for performance */
const ParticlesBackground = lazy(() =>
 import("@/components/ParticlesBackground").then((m) => ({
 default: m.ParticlesBackground,
 }))
);

export function NuroviaHero() {
 const navigate = useNavigate();
 const { t, isRTL } = useLanguage();
 const [current, setCurrent] = useState(0);
 const [direction, setDirection] = useState(0);
 const [titleWords, setTitleWords] = useState<string[]>([]);

 const slides = heroSlides;
 const slide = slides[current];

 useEffect(() => {
 setTitleWords(slide.title.split(" "));
 }, [slide.title]);

 const paginate = useCallback(
 (dir: number) => {
 setDirection(dir);
 setCurrent((prev) => (prev + dir + slides.length) % slides.length);
 },
 [slides.length]
 );

 /* Auto-play */
 useEffect(() => {
 const timer = setInterval(() => paginate(1), 7000);
 return () => clearInterval(timer);
 }, [paginate]);

 // In RTL, slide directions are reversed: "next" enters from left (-100%), not right (+100%)
 const bgVariants = {
 enter: (dir: number) => ({
 x: isRTL
 ? (dir > 0 ? "-100%" : "100%")
 : (dir > 0 ? "100%" : "-100%"),
 opacity: 0,
 }),
 center: { x: 0, opacity: 1 },
 exit: (dir: number) => ({
 x: isRTL
 ? (dir > 0 ? "100%" : "-100%")
 : (dir > 0 ? "-100%" : "100%"),
 opacity: 0,
 }),
 };

 return (
 <section className="relative w-full h-screen overflow-hidden" style={{ background: "var(--nv-bg-body)" }}>
 {/* Background Image with Ken Burns */}
 <AnimatePresence initial={false} custom={direction}>
 <motion.div
 key={slide.id}
 className="absolute inset-0"
 custom={direction}
 variants={bgVariants}
 initial="enter"
 animate="center"
 exit="exit"
 transition={{ duration: 0.8, ease: easings.smooth }}
 >
 <motion.img
 src={slide.image}
 alt={slide.title}
 className="w-full h-full object-cover"
 initial={{ scale: 1.1, x: isRTL ? "1%" : "-1%" }}
 animate={{ scale: 1.02, x: isRTL ? "-1%" : "1%" }}
 transition={{ duration: 8, ease: "linear" }}
 style={{ opacity: 0.7 }}
 />
 </motion.div>
 </AnimatePresence>

 {/* 3D Particles */}
 <Suspense fallback={null}>
 <ParticlesBackground />
 </Suspense>

 {/* Vignette Overlays for Readability */}
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background: isRTL
 ? "radial-gradient(ellipse 80% 70% at 25% 60%, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.4) 40%, transparent 75%)"
 : "radial-gradient(ellipse 80% 70% at 75% 60%, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.4) 40%, transparent 75%)",
 }}
 />
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background:
 "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.7) 30%, transparent 55%)",
 }}
 />
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background: isRTL
 ? "linear-gradient(to left, rgba(10,10,10,0.5) 0%, transparent 40%)"
 : "linear-gradient(to right, rgba(10,10,10,0.5) 0%, transparent 40%)",
 }}
 />

 {/* Content */}
 <div
 className="absolute inset-0 z-10 flex items-center"
 style={{ paddingInline: "clamp(5vw, 8vw, 10vw)" }}
 >
 <motion.div
 className={`max-w-[620px] ${isRTL ? "mr-auto text-right items-end" : "ml-auto items-start"} flex flex-col`}
 style={{ transformOrigin: isRTL ? "right" : "left" }}
 variants={staggerContainer}
 initial="hidden"
 animate="visible"
 key={slide.id}
 >
 {/* Trending Badge with pulse */}
 <motion.div
 className="relative inline-flex items-center mb-5"
 variants={fadeUp}
 >
 <motion.div
 className="absolute inset-0 rounded-sm"
 style={{
 background:
 "linear-gradient(to right, #D4AF37, #F0D878)",
 filter: "blur(10px)",
 opacity: 0.3,
 }}
 animate={{
 opacity: [0.2, 0.45, 0.2],
 scale: [1, 1.06, 1],
 }}
 transition={{
 duration: 2.5,
 repeat: Infinity,
 ease: "easeInOut",
 }}
 />
 <div
 className="relative flex items-center gap-2 px-3 py-1.5 rounded-sm"
 style={{
 background:
 "linear-gradient(to right, #D4AF37, #F0D878)",
 }}
 >
 <Sparkles className="w-3 h-3 text-[#0a0a0a]" />
 <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0a0a0a]">
 {slide.trending
 ? t("hero.trendingNow")
 : `\u2605 ${slide.rating}`}
 </span>
 </div>
 </motion.div>

 {/* Title — Word by Word with 3D depth */}
 <h1
 className="text-[36px] md:text-[72px] font-normal text-white leading-[1.05] tracking-[-0.02em] mb-4"
 style={{
 fontFamily:
 '"SF Pro Display", -apple-system, sans-serif',
 perspective: 800,
 transformStyle: "preserve-3d",
 textShadow:
 "0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)",
 }}
 >
 {titleWords.map((word, i) => (
 <motion.span
 key={`${slide.id}-w-${i}`}
 className="inline-block mx-[0.12em]"
 style={{ transformStyle: "preserve-3d" }}
 custom={i}
 variants={wordReveal}
 >
 {word}
 </motion.span>
 ))}
 </h1>

 {/* Synopsis */}
 <motion.p
 className="text-[16px] text-[#E0E0E0] leading-relaxed max-w-[480px] mb-6 line-clamp-3"
 style={{
 textShadow: "0 1px 10px rgba(0,0,0,0.6)",
 }}
 variants={fadeUp}
 >
 {slide.synopsis}
 </motion.p>

 {/* CTA Buttons */}
 <motion.div
 className={`flex gap-4`}
 variants={fadeUp}
 >
 <motion.button
 onClick={() => navigate(`/watch/${slide.id}`)}
 className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-[#0a0a0a] cursor-pointer"
 style={{
 background:
 "linear-gradient(135deg, #D4AF37, #F0D878)",
 boxShadow:
 "0 4px 20px rgba(212, 175, 55, 0.3)",
 }}
 whileHover={{
 scale: 1.05,
 boxShadow:
 "0 8px 30px rgba(212, 175, 55, 0.4)",
 }}
 whileTap={{ scale: 0.97 }}
 transition={{ duration: 0.2 }}
 >
 <Play className="w-4 h-4 fill-[#0a0a0a]" />
 {t("hero.playNow")}
 </motion.button>

 <motion.button
 className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-[#E0E0E0] cursor-pointer"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 whileHover={{
 scale: 1.05,
 background: "rgba(212, 175, 55, 0.1)",
 borderColor: "rgba(212, 175, 55, 0.3)",
 color: "#D4AF37",
 }}
 whileTap={{ scale: 0.97 }}
 transition={{ duration: 0.2 }}
 >
 <Heart className="w-4 h-4" />
 {t("hero.addFavorites")}
 </motion.button>
 </motion.div>
 </motion.div>
 </div>

 {/* Slide Indicators */}
 <div
 className={`absolute bottom-10 z-10 flex items-center gap-3 ${isRTL ? "left-10" : "right-10"}`}
 >
 <button
 onClick={() => paginate(-1)}
 className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
 >
 <ChevronLeft className="w-5 h-5" />
 </button>

 <div className="flex gap-2">
 {slides.map((_, i) => (
 <button
 key={i}
 onClick={() => {
 setDirection(i > current ? 1 : -1);
 setCurrent(i);
 }}
 className="relative h-1 rounded-full overflow-hidden transition-all"
 style={{
 width: i === current ? 32 : 12,
 background:
 i === current
 ? "rgba(212, 175, 55, 0.3)"
 : "rgba(255,255,255,0.15)",
 }}
 >
 {i === current && (
 <motion.div
 className={`absolute inset-y-0 ${isRTL ? "right-0" : "left-0"} rounded-full`}
 style={{
 background:
 isRTL
 ? "linear-gradient(to left, #D4AF37, #F0D878)"
 : "linear-gradient(to right, #D4AF37, #F0D878)",
 }}
 initial={{ width: "0%" }}
 animate={{ width: "100%" }}
 transition={{ duration: 7, ease: "linear" }}
 />
 )}
 </button>
 ))}
 </div>

 <button
 onClick={() => paginate(1)}
 className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
 >
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 </section>
 );
}
