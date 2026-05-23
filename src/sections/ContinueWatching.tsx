import { useRef } from "react";
import { motion } from "framer-motion";
import { ContinueWatchingCard, ContinueWatchingSkeleton } from "@/components/ContinueWatchingCard";
import { continueWatchingData } from "@/data/anime";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";

interface ContinueWatchingProps {
 isLoading?: boolean;
}

export function ContinueWatching({ isLoading = false }: ContinueWatchingProps) {
 const scrollRef = useRef<HTMLDivElement>(null);
 const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
 const { t, isRTL } = useLanguage();

 return (
 <motion.section
 ref={sectionRef}
 id="continue"
 className="relative py-[60px]" style={{ background: "var(--nv-bg-secondary)" }}
 dir={isRTL ? "rtl" : "ltr"}
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
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
 <div className={`mb-6 ${isRTL ? "text-end" : "text-start"}`}>
 <h2 className="text-[22px] font-bold bg-gradient-to-r from-[#F0D878] to-[#D4AF37] bg-clip-text text-transparent">
 {t("continue.title")}
 </h2>
 <p className="text-[14px] text-[#9CA3AF] mt-1">
 {t("continue.subtitle")}
 </p>
 </div>
 </div>

 <div
 ref={scrollRef}
 className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
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
 Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="snap-start flex-shrink-0 w-[280px]">
 <ContinueWatchingSkeleton />
 </div>
 ))
 ) : (
 continueWatchingData.map((item, i) => (
 <div key={item.id} className="snap-start flex-shrink-0 w-[280px]">
 {isInView && <ContinueWatchingCard item={item} index={i} />}
 </div>
 ))
 )}
 </div>
 </motion.section>
 );
}
