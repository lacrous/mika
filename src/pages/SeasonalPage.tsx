import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Calendar, Snowflake, Sun, Leaf, Flower2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/context/LanguageContext";

const SEASONS = [
  { key: "winter", icon: Snowflake, color: "#60a5fa", months: [12, 1, 2] },
  { key: "spring", icon: Flower2, color: "#f472b6", months: [3, 4, 5] },
  { key: "summer", icon: Sun, color: "#f59e0b", months: [6, 7, 8] },
  { key: "fall", icon: Leaf, color: "#f97316", months: [9, 10, 11] },
];

export function SeasonalPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = SEASONS.find((s) => s.months.includes(currentMonth)) || SEASONS[0];
  const [activeSeason, setActiveSeason] = useState(currentSeason.key);
  const [year, setYear] = useState(new Date().getFullYear());

  const animeQuery = trpc.anime.list.useQuery({ limit: 100 }, { retry: false });
  const allAnime = (animeQuery.data || []) as any[];

  const activeSeasonData = SEASONS.find((s) => s.key === activeSeason)!;

  // Filter anime by season (based on year for demo — real data would have season fields)
  const filtered = allAnime.filter((a: any) => {
    const animeYear = a.year || 0;
    return animeYear === year || animeYear === year - 1;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1200px] mx-auto">
        <motion.h1 className="text-[24px] font-bold mb-6 flex items-center gap-3" style={{ color: "var(--nv-text-primary)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Calendar className="w-6 h-6" style={{ color: "var(--nv-gold)" }} />{isRTL ? "المواسم" : "Seasonal Anime"} {year}
        </motion.h1>

        {/* Season Tabs */}
        <div className="flex gap-2 mb-6">
          {SEASONS.map((s) => (
            <button key={s.key} onClick={() => setActiveSeason(s.key)}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-[13px] font-medium transition-all"
              style={{
                background: activeSeason === s.key ? `${s.color}15` : "rgba(255,255,255,0.02)",
                color: activeSeason === s.key ? s.color : "var(--nv-text-muted)",
                border: activeSeason === s.key ? `1px solid ${s.color}30` : "1px solid rgba(255,255,255,0.05)",
              }}>
              <s.icon className="w-4 h-4" />{isRTL ? (s.key === "winter" ? "شتاء" : s.key === "spring" ? "ربيع" : s.key === "summer" ? "صيف" : "خريف") : s.key.charAt(0).toUpperCase() + s.key.slice(1)}
            </button>
          ))}
        </div>

        {/* Year selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[2026, 2025, 2024, 2023, 2022].map((y) => (
            <button key={y} onClick={() => setYear(y)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
              style={{
                background: year === y ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.02)",
                color: year === y ? "#D4AF37" : "var(--nv-text-muted)",
              }}>{y}</button>
          ))}
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((a: any, i: number) => (
            <motion.div key={a.id} className="rounded-xl overflow-hidden cursor-pointer hover:brightness-110 transition-all"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
              onClick={() => navigate(`/watch/${a.id}`)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              {a.image ? (
                <img src={a.image} alt={a.title} className="w-full aspect-[3/4] object-cover" />
              ) : (
                <div className="w-full aspect-[3/4] flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Calendar className="w-8 h-8" style={{ color: "var(--nv-text-dim)" }} />
                </div>
              )}
              <div className="p-2.5">
                <p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{a.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--nv-text-dim)" }}>{a.studio} · {a.year}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-20 text-[13px]" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد نتائج" : "No anime found for this season"}</p>
        )}
      </div>
    </div>
  );
}
