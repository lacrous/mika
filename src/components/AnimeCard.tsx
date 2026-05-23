import { useState, useRef } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { Star, Play, Heart } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { useLanguage } from "@/context/LanguageContext";
import type { AnimeCardProps } from "@/types";

export function AnimeCard({ anime, compact = false, index = 0, onClick }: AnimeCardProps) {
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group cursor-pointer flex-shrink-0"
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.04,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="relative rounded-xl overflow-hidden nv-card-bg border border-transparent transition-all duration-300"
        style={{
          borderColor: isHovered ? "rgba(212, 175, 55, 0.3)" : "transparent",
          boxShadow: isHovered
            ? "0 0 30px rgba(212, 175, 55, 0.15), 0 12px 40px rgba(0, 0, 0, 0.25)"
            : "0 4px 20px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Gold shimmer sweep effect on hover */}
        <div
          className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-500"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(212, 175, 55, 0.08) 45%, rgba(240, 216, 120, 0.15) 50%, rgba(212, 175, 55, 0.08) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            backgroundPosition: isHovered ? "-20% 0" : "120% 0",
            transition: "background-position 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
          {/* Skeleton placeholder */}
          {!imgLoaded && (
            <div className="absolute inset-0 nv-skeleton-bg animate-pulse z-10" />
          )}

          <LazyLoadImage
            src={anime.image}
            alt={anime.title}
            effect="opacity"
            afterLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
            threshold={200}
            style={{ opacity: imgLoaded ? 0.95 : 0 }}
          />

          {/* Hover zoom effect */}
          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none" />

          {/* Trending badge */}
          {anime.trending && (
            <motion.div
              className={`absolute top-3 z-20 bg-gradient-to-r from-[#D4AF37] to-[#F0D878] text-[#0a0a0a] text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-sm ${isRTL ? "right-3" : "left-3"}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.04 + 0.2 }}
            >
              {t("trending.trendingBadge")}
            </motion.div>
          )}

          {/* Episode count badge */}
          <div
            className={`absolute bottom-3 z-20 text-[10px] font-medium text-white px-2 py-0.5 rounded-md ${isRTL ? "left-3" : "right-3"}`}
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {anime.episodes} {isRTL ? "حلقة" : "Ep"}
          </div>

          {/* Hover Overlay with quick actions */}
          <div className="absolute inset-0 nv-card-overlay-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10">
            {/* Top: Quick actions */}
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse justify-start" : "justify-end"}`}>
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(212, 175, 55, 0.2)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              </motion.button>
            </div>

            {/* Center: Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "rgba(212, 175, 55, 0.2)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  boxShadow: "0 0 30px rgba(212, 175, 55, 0.2)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37] ml-0.5" />
              </motion.div>
            </div>

            {/* Bottom: Genre pills + Synopsis tooltip */}
            {!compact && (
              <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="text-[10px] nv-genre-text px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                {/* Synopsis snippet on hover */}
                <p className="text-[11px] nv-synopsis-text leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {anime.synopsis}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 pb-1 px-1">
          <h3 className="text-[15px] font-semibold nv-card-title truncate group-hover:text-[#D4AF37] transition-colors duration-200">
            {anime.title}
          </h3>
          <div className={`flex justify-between items-center mt-1.5`}>
            <div className="flex items-center gap-2">
              <span className="text-[12px] nv-year-text">{anime.year}</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(212, 175, 55, 0.1)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212, 175, 55, 0.15)",
                }}
              >
                HD
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[12px] text-[#D4AF37] font-medium">{anime.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
