import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, Search, X, Star, Calendar, Hash, Tv } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/context/LanguageContext";

export function AnimeComparePage() {
  const { isRTL } = useLanguage();
  const [leftId, setLeftId] = useState<number | null>(null);
  const [rightId, setRightId] = useState<number | null>(null);
  const [leftQuery, setLeftQuery] = useState("");
  const [rightQuery, setRightQuery] = useState("");

  const leftAnime = trpc.anime.byId.useQuery({ id: leftId || 0 }, { enabled: !!leftId, retry: false });
  const rightAnime = trpc.anime.byId.useQuery({ id: rightId || 0 }, { enabled: !!rightId, retry: false });
  const searchLeft = trpc.anime.search.useQuery({ q: leftQuery, limit: 5 }, { enabled: leftQuery.length > 0, retry: false });
  const searchRight = trpc.anime.search.useQuery({ q: rightQuery, limit: 5 }, { enabled: rightQuery.length > 0, retry: false });

  const l = leftAnime.data as any;
  const r = rightAnime.data as any;

  const fields = [
    { label: "Rating", labelAr: "التقييم", icon: Star, get: (a: any) => typeof a?.rating === "number" ? (a.rating > 10 ? (a.rating / 10).toFixed(1) : a.rating) : "-" },
    { label: "Year", labelAr: "السنة", icon: Calendar, get: (a: any) => a?.year || "-" },
    { label: "Episodes", labelAr: "الحلقات", icon: Hash, get: (a: any) => a?.episodes || "-" },
    { label: "Status", labelAr: "الحالة", icon: Tv, get: (a: any) => a?.status || "-" },
    { label: "Studio", labelAr: "الاستوديو", icon: Tv, get: (a: any) => a?.studio || "-" },
    { label: "Genres", labelAr: "التصنيفات", icon: Hash, get: (a: any) => (a?.genres || []).join(", ") || "-" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1000px] mx-auto">
        <motion.h1 className="text-[24px] font-bold mb-6 text-center" style={{ color: "var(--nv-text-primary)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GitCompare className="w-6 h-6 inline mr-2" style={{ color: "var(--nv-gold)" }} />
          {isRTL ? "مقارنة الأنمي" : "Compare Anime"}
        </motion.h1>

        {/* Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Left Search */}
          <div className="relative">
            <div className={`flex items-center gap-2 rounded-xl p-3 ${isRTL ? "flex-row-reverse" : ""}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nv-text-dim)" }} />
              <input value={leftQuery} onChange={(e) => setLeftQuery(e.target.value)}
                placeholder={isRTL ? "اختر الأنمي الأول..." : "Choose first anime..."}
                className="flex-1 bg-transparent text-[13px] outline-none placeholder-[#555]" style={{ color: "var(--nv-text-primary)" }} />
              {leftId && <button onClick={() => { setLeftId(null); setLeftQuery(""); }}><X className="w-3.5 h-3.5" style={{ color: "var(--nv-text-dim)" }} /></button>}
            </div>
            {searchLeft.data && leftQuery && !leftId && (
              <div className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden" style={{ background: "var(--nv-bg-secondary)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {(searchLeft.data as any[]).map((a: any) => (
                  <button key={a.id} onClick={() => { setLeftId(a.id); setLeftQuery(a.title); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-[rgba(212,175,55,0.06)] transition-colors text-left"
                    style={{ color: "var(--nv-text-primary)" }}>
                    <img src={a.image} alt="" className="w-8 h-10 rounded object-cover" />{a.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Search */}
          <div className="relative">
            <div className={`flex items-center gap-2 rounded-xl p-3 ${isRTL ? "flex-row-reverse" : ""}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nv-text-dim)" }} />
              <input value={rightQuery} onChange={(e) => setRightQuery(e.target.value)}
                placeholder={isRTL ? "اختر الأنمي الثاني..." : "Choose second anime..."}
                className="flex-1 bg-transparent text-[13px] outline-none placeholder-[#555]" style={{ color: "var(--nv-text-primary)" }} />
              {rightId && <button onClick={() => { setRightId(null); setRightQuery(""); }}><X className="w-3.5 h-3.5" style={{ color: "var(--nv-text-dim)" }} /></button>}
            </div>
            {searchRight.data && rightQuery && !rightId && (
              <div className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden" style={{ background: "var(--nv-bg-secondary)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {(searchRight.data as any[]).map((a: any) => (
                  <button key={a.id} onClick={() => { setRightId(a.id); setRightQuery(a.title); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-[rgba(212,175,55,0.06)] transition-colors text-left"
                    style={{ color: "var(--nv-text-primary)" }}>
                    <img src={a.image} alt="" className="w-8 h-10 rounded object-cover" />{a.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison */}
        {l && r && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <img src={l.image} alt={l.title} className="w-24 h-36 object-cover rounded-xl mx-auto mb-2" />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{l.title}</h3>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-[12px] px-3 py-1 rounded-full" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>VS</span>
              </div>
              <div className="text-center">
                <img src={r.image} alt={r.title} className="w-24 h-36 object-cover rounded-xl mx-auto mb-2" />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{r.title}</h3>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-2">
              {fields.map((f) => (
                <div key={f.label} className="grid grid-cols-3 gap-4 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div className="text-[12px] font-medium text-center" style={{ color: "var(--nv-text-secondary)" }}>{f.get(l)}</div>
                  <div className="flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--nv-text-dim)" }}>
                    <f.icon className="w-3 h-3" />{isRTL ? f.labelAr : f.label}
                  </div>
                  <div className="text-[12px] font-medium text-center" style={{ color: "var(--nv-text-secondary)" }}>{f.get(r)}</div>
                </div>
              ))}
            </div>

            {/* Synopsis */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--nv-text-muted)" }}>{l.synopsis}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--nv-text-muted)" }}>{r.synopsis}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!l || !r ? (
          <p className="text-center text-[13px] py-20" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "اختر أنميين للمقارنة" : "Select two anime to compare"}</p>
        ) : null}
      </div>
    </div>
  );
}
