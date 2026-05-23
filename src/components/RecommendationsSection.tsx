import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/context/LanguageContext";

interface RecommendationsSectionProps {
  animeId: number;
  isRTL?: boolean;
}

export function RecommendationsSection({ animeId, isRTL = false }: RecommendationsSectionProps) {
  const navigate = useNavigate();
  const { isRTL: contextRTL } = useLanguage();
  const rtl = isRTL || contextRTL;

  const similarQuery = trpc.recommendations.similar.useQuery({ animeId, limit: 6 }, { retry: false });
  const trendingQuery = trpc.recommendations.trending.useQuery({ limit: 6 }, { retry: false });

  const similar = (similarQuery.data || []) as any[];
  const trending = (trendingQuery.data || []) as any[];

  if (similar.length === 0 && trending.length === 0) return null;

  return (
    <div className="mt-8 space-y-8" dir={rtl ? "rtl" : "ltr"}>
      {similar.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
            <Sparkles className="w-4 h-4" style={{ color: "var(--nv-gold)" }} />
            {rtl ? "المزيد مثل هذا" : "More Like This"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {similar.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} compact onClick={() => navigate(`/watch/${anime.id}`)} />
            ))}
          </div>
        </motion.div>
      )}

      {trending.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
            <TrendingUp className="w-4 h-4" style={{ color: "var(--nv-gold)" }} />
            {rtl ? "الأكثر رواجاً" : "Trending Now"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {trending.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} compact onClick={() => navigate(`/watch/${anime.id}`)} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
