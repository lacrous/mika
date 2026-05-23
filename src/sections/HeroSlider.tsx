import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/heroSlides";
import { useLanguage } from "@/context/LanguageContext";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export function HeroSlider() {
 const [current, setCurrent] = useState(0);
 const [direction, setDirection] = useState(1);
 const [isPaused, setIsPaused] = useState(false);
 const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const { t, isRTL } = useLanguage();

 const slideCount = heroSlides.length;

 const goTo = useCallback(
 (index: number) => {
 setDirection(index > current ? 1 : -1);
 setCurrent((index + slideCount) % slideCount);
 },
 [current, slideCount]
 );

 const next = useCallback(() => {
 setDirection(1);
 setCurrent((prev) => (prev + 1) % slideCount);
 }, [slideCount]);

 const prev = useCallback(() => {
 setDirection(-1);
 setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
 }, [slideCount]);

 // Auto-play
 useEffect(() => {
 if (isPaused) return;
 intervalRef.current = setInterval(next, 6000);
 return () => {
 if (intervalRef.current) clearInterval(intervalRef.current);
 };
 }, [isPaused, next]);

 const slide = heroSlides[current];
 const titleWords = slide.title.split(" ");

 // Slide variants for background
 const bgVariants = {
 enter: (dir: number) => ({
 x: dir > 0 ? "100%" : "-100%",
 opacity: 0,
 scale: 1.1,
 }),
 center: {
 x: 0,
 opacity: 1,
 scale: 1,
 },
 exit: (dir: number) => ({
 x: dir > 0 ? "-100%" : "100%",
 opacity: 0,
 scale: 1.05,
 }),
 };

 // Text content variants
 const contentVariants = {
 enter: { opacity: 0, y: 30 },
 center: { opacity: 1, y: 0 },
 exit: { opacity: 0, y: -20 },
 };

 return (
 <section
 className="relative min-h-[85vh] overflow-hidden"
 onMouseEnter={() => setIsPaused(true)}
 onMouseLeave={() => setIsPaused(false)}
 >
 {/* Background Images with Slide Transition */}
 <AnimatePresence initial={false} custom={direction} mode="popLayout">
 <motion.div
 key={slide.id}
 className="absolute inset-0"
 custom={direction}
 variants={bgVariants}
 initial="enter"
 animate="center"
 exit="exit"
 transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Ken Burns slow zoom + pan */}
 <motion.img
 src={slide.image}
 alt={slide.title}
 className="w-full h-full object-cover"
 initial={{ scale: 1.08, x: isRTL ? "1%" : "-1%" }}
 animate={{ scale: 1.02, x: isRTL ? "-1%" : "1%" }}
 transition={{ duration: 8, ease: "linear" }}
 />
 </motion.div>
 </AnimatePresence>

 {/* Dither Noise Overlay */}
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

 {/* Strong radial vignette for text readability */}
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background: isRTL
 ? "radial-gradient(ellipse 80% 70% at 25% 60%, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 40%, transparent 75%)"
 : "radial-gradient(ellipse 80% 70% at 75% 60%, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 40%, transparent 75%)",
 }}
 />
 {/* Bottom gradient fade */}
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background:
 "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.7) 30%, transparent 55%)",
 }}
 />
 {/* Side gradient */}
 <div
 className="absolute inset-0 z-[2]"
 style={{
 background: isRTL
 ? "linear-gradient(to left, rgba(10,10,10,0.6) 0%, transparent 40%)"
 : "linear-gradient(to right, rgba(10,10,10,0.6) 0%, transparent 40%)",
 }}
 />

 {/* 3D Particles Background */}
 <Suspense fallback={null}>
 <ParticlesBackground />
 </Suspense>

 {/* Navigation Arrows */}
 <div className="absolute inset-y-0 left-0 right-0 z-[4] flex items-center justify-between pointer-events-none"
 style={{
 paddingLeft: "clamp(3vw, 5vw, 8vw)",
 paddingRight: "clamp(3vw, 5vw, 8vw)",
 }}
 >
 <button
 onClick={prev}
 className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.4)] hover:scale-110"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.12)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 24px rgba(0,0,0,0.3)",
 }}
 aria-label="Previous slide"
 >
 <ChevronLeft className="w-5 h-5 text-white" />
 </button>
 <button
 onClick={next}
 className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.4)] hover:scale-110"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.12)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 24px rgba(0,0,0,0.3)",
 }}
 aria-label="Next slide"
 >
 <ChevronRight className="w-5 h-5 text-white" />
 </button>
 </div>

 {/* Content */}
 <div
 className="absolute bottom-0 z-[3] pb-[10vh]"
 style={{
 left: isRTL ? "auto" : 0,
 right: isRTL ? 0 : "auto",
 paddingLeft: isRTL ? "5vw" : "clamp(5vw, 8vw, 10vw)",
 paddingRight: isRTL ? "clamp(5vw, 8vw, 10vw)" : "5vw",
 }}
 >
 <AnimatePresence mode="wait" key={slide.id}>
 <motion.div
 className={`flex gap-5 items-start`}
 variants={contentVariants}
 initial="enter"
 animate="center"
 exit="exit"
 transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Decorative Vertical Line with 3D glow */}
 <motion.div
 className="w-px flex-shrink-0 mt-2 relative"
 style={{
 height: 60,
 background: "linear-gradient(to bottom, transparent, #D4AF37, #F0D878, transparent)",
 boxShadow: "0 0 12px rgba(212, 175, 55, 0.4), 0 0 4px rgba(240, 216, 120, 0.6)",
 }}
 initial={{ scaleY: 0, opacity: 0, rotateY: 90 }}
 animate={{ scaleY: 1, opacity: 1, rotateY: 0 }}
 transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
 />

 <div className="max-w-[640px]">
 {/* Trending Badge with pulse glow */}
 <motion.div
 className="relative inline-flex items-center bg-gradient-to-r from-[#D4AF37] to-[#F0D878] text-[#0a0a0a] text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-sm mb-4"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Pulse glow behind badge */}
 <motion.div
 className="absolute inset-0 rounded-sm"
 style={{
 background: "linear-gradient(to right, #D4AF37, #F0D878)",
 filter: "blur(8px)",
 opacity: 0.4,
 }}
 animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
 />
 <span className="relative z-10">
 {slide.trending ? t("hero.trendingNow") : `\u2605 ${slide.rating}`}
 </span>
 </motion.div>

 {/* Title - Word by Word with 3D depth + text shadow for readability */}
 <h1
 className="text-[32px] md:text-[64px] font-normal text-white leading-[1.1] tracking-[-0.02em] font-mono"
 dir="ltr"
 style={{
 perspective: 800,
 transformStyle: "preserve-3d",
 textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)",
 }}
 >
 {titleWords.map((word, i) => (
 <motion.span
 key={`${slide.id}-word-${i}`}
 className="inline-block mx-[0.15em]"
 style={{ transformStyle: "preserve-3d" }}
 initial={{
 opacity: 0,
 y: 30,
 rotateX: -45,
 translateZ: -50,
 }}
 animate={{
 opacity: 1,
 y: 0,
 rotateX: 0,
 translateZ: i * 8,
 }}
 transition={{
 duration: 0.7,
 delay: 0.3 + i * 0.08,
 ease: [0.22, 1, 0.36, 1],
 }}
 >
 {word}
 </motion.span>
 ))}
 </h1>

 {/* Subtitle */}
 <motion.p
 className="text-[15px] mt-3 bg-gradient-to-r from-[#F0D878] to-[#D4AF37] bg-clip-text text-transparent"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
 >
 {slide.subtitle}
 </motion.p>

 {/* Synopsis */}
 <motion.p
 className="text-[16px] text-[#E0E0E0] leading-relaxed mt-4 line-clamp-3 max-w-[500px]"
 style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
 >
 {slide.synopsis}
 </motion.p>

 {/* CTA Row */}
 <motion.div
 className={`flex gap-4 mt-8`}
 style={{ perspective: 600, transformStyle: "preserve-3d" }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.86, ease: [0.22, 1, 0.36, 1] }}
 >
 <motion.button
 className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-[16px] transition-all duration-300 hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.12)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
 transformStyle: "preserve-3d",
 }}
 whileHover={{
 scale: 1.05,
 translateZ: 30,
 boxShadow: "0 10px 40px rgba(212, 175, 55, 0.2)",
 }}
 transition={{ duration: 0.3 }}
 >
 <Play className="w-4 h-4 fill-white" />
 {t("hero.playNow")}
 </motion.button>

 <motion.button
 className="flex items-center gap-2 px-6 py-3 rounded-lg text-[#9CA3AF] font-semibold text-[16px] transition-all duration-300 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.12)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
 transformStyle: "preserve-3d",
 }}
 whileHover={{
 scale: 1.05,
 translateZ: 30,
 boxShadow: "0 10px 40px rgba(212, 175, 55, 0.15)",
 }}
 transition={{ duration: 0.3 }}
 >
 <Heart className="w-4 h-4" />
 {t("hero.addFavorites")}
 </motion.button>
 </motion.div>
 </div>
 </motion.div>
 </AnimatePresence>
 </div>

 {/* Bottom Navigation Dots */}
 <div className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 z-[4] flex items-center gap-3">
 {heroSlides.map((_, index) => (
 <button
 key={index}
 onClick={() => goTo(index)}
 className="group relative"
 aria-label={`Go to slide ${index + 1}`}
 >
 {/* Track */}
 <div
 className="h-1 rounded-full overflow-hidden transition-all duration-500"
 style={{
 width: index === current ? 40 : 20,
 background: "rgba(255, 255, 255, 0.15)",
 }}
 >
 {/* Fill */}
 <div
 className="h-full rounded-full transition-all duration-500"
 style={{
 width: index === current ? "100%" : "0%",
 background: index === current
 ? "linear-gradient(to right, #D4AF37, #F0D878)"
 : "transparent",
 }}
 />
 </div>
 {/* Hover glow */}
 {index !== current && (
 <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
 style={{
 background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
 transform: "scale(2)",
 }}
 />
 )}
 </button>
 ))}
 </div>

 {/* Slide Counter */}
 <div className="absolute bottom-[4vh] z-[4] font-mono text-[12px] text-[#9CA3AF]"
 style={{
 right: isRTL ? "auto" : "clamp(5vw, 8vw, 10vw)",
 left: isRTL ? "clamp(5vw, 8vw, 10vw)" : "auto",
 }}
 >
 <span className="text-[#D4AF37] font-medium">
 {String(current + 1).padStart(2, "0")}
 </span>
 <span className="mx-1.5 opacity-50">/</span>
 <span>{String(slideCount).padStart(2, "0")}</span>
 </div>
 </section>
 );
}
