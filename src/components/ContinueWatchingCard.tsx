import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { useLanguage } from "@/context/LanguageContext";
import type { ContinueWatchingCardProps } from "@/types";

export function ContinueWatchingCard({ item, index = 0 }: ContinueWatchingCardProps) {
 const [imgLoaded, setImgLoaded] = useState(false);
 const { t, isRTL } = useLanguage();

 return (
 <motion.div
 className="group cursor-pointer flex-shrink-0 w-[280px]"
 initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{
 delay: index * 0.05,
 duration: 0.5,
 ease: [0.22, 1, 0.36, 1],
 }}
 >
 <div className="relative rounded-xl overflow-hidden bg-[var(--nv-bg-secondary)] border border-transparent group-hover:border-[rgba(212,175,55,0.25)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
 {/* Image with Lazy Loading */}
 <div className="relative aspect-video overflow-hidden rounded-xl">
 {!imgLoaded && (
 <div className="absolute inset-0 bg-[var(--nv-bg-tertiary)] animate-pulse z-10" />
 )}

 <LazyLoadImage
 src={item.image}
 alt={item.title}
 effect="opacity"
 afterLoad={() => setImgLoaded(true)}
 className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
 wrapperClassName="w-full h-full"
 threshold={200}
 />

 {/* Play Overlay */}
 <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-250 z-10">
 <div
 className="w-10 h-10 rounded-full flex items-center justify-center"
 style={{
 background: "rgba(212, 175, 55, 0.15)",
 backdropFilter: "blur(12px)",
 border: "1px solid rgba(212, 175, 55, 0.3)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 20px rgba(212, 175, 55, 0.1)",
 }}
 >
 <Play className="w-[18px] h-[18px] text-[#D4AF37] fill-[#D4AF37] ml-0.5" />
 </div>
 </div>
 </div>

 {/* Info */}
 <div className="pt-3 px-1 pb-1">
 <div className={`flex justify-between items-start`}>
 <h3 className="text-[13px] text-white font-medium truncate max-w-[200px]">
 {item.title}
 </h3>
 <span className="text-[11px] text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded-full flex-shrink-0 mx-2">
 {item.episode}
 </span>
 </div>

 {/* Progress */}
 <div className="mt-2.5">
 <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
 <div
 className="h-full rounded-full relative overflow-hidden"
 style={{
 width: `${item.progress}%`,
 background: "linear-gradient(to right, #D4AF37, #F0D878)",
 }}
 >
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
 animation: "shimmer 2s infinite",
 transform: "translateX(-100%)",
 }}
 />
 </div>
 </div>
 <div className={`flex justify-between mt-1.5`}>
 <span className="text-[11px] text-[#9CA3AF]">{item.progress}% {t("continue.watched")}</span>
 <span className="text-[11px] text-[#9CA3AF]">
 {t("continue.ep")} {item.currentEpisode} / {item.totalEpisodes}
 </span>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 );
}

export function ContinueWatchingSkeleton() {
 return (
 <div className="flex-shrink-0 w-[280px]">
 <div className="rounded-xl overflow-hidden bg-[var(--nv-bg-secondary)]">
 {/* Image skeleton */}
 <div className="aspect-video bg-[var(--nv-bg-tertiary)] animate-pulse" />
 {/* Title skeleton */}
 <div className="pt-3 px-1 pb-1">
 <div className="h-3 bg-[var(--nv-bg-tertiary)] rounded animate-pulse w-3/4" />
 {/* Progress skeleton */}
 <div className="h-1 bg-[var(--nv-bg-tertiary)] rounded-full mt-3 animate-pulse w-full" />
 <div className="flex justify-between mt-2">
 <div className="h-2.5 bg-[var(--nv-bg-tertiary)] rounded animate-pulse w-16" />
 <div className="h-2.5 bg-[var(--nv-bg-tertiary)] rounded animate-pulse w-20" />
 </div>
 </div>
 </div>
 </div>
 );
}
