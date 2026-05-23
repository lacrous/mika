import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Clock, Play, Trash2, Film, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

export function HistoryPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const utils = trpc.useUtils();
  const historyQuery = trpc.history.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const removeHistory = trpc.history.remove.useMutation({
    onSuccess: () => utils.history.list.invalidate(),
  });

  const history = (historyQuery.data || []) as any[];

  // Group by date
  const grouped = history.reduce((groups: Record<string, any[]>, item: any) => {
    const date = new Date(item.updatedAt).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
          <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "سجل الدخول لعرض السجل" : "Sign in to view history"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[800px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent mb-2">
            {isRTL ? "سجل المشاهدة" : "Watch History"}
          </h1>
          <p className="text-[14px] mb-8" style={{ color: "var(--nv-text-tertiary)" }}>
            {history.length} {isRTL ? "حلقة مشاهدة" : "episodes watched"}
          </p>
        </motion.div>

        {historyQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <p className="text-[11px] uppercase tracking-wider font-semibold mb-2 px-1" style={{ color: "var(--nv-text-dim)" }}>{date}</p>
                <div className="space-y-2">
                  {(items as any[]).map((item, i) => (
                    <motion.div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.03)] ${isRTL ? "flex-row-reverse" : ""}`}
                      style={{ border: "1px solid rgba(255,255,255,0.04)" }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                      onClick={() => navigate(`/watch/${item.animeId}`)}>
                      {item.animeImage ? (
                        <img src={item.animeImage} alt="" className="w-16 h-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <Film className="w-4 h-4" style={{ color: "var(--nv-text-dim)" }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{item.animeTitle}</p>
                        <p className="text-[11px]" style={{ color: "var(--nv-text-muted)" }}>
                          {isRTL ? "حلقة" : "Ep"} {item.episodeNumber || "?"} · {Math.round((item.progress || 0) / 60)}m {isRTL ? "متبقي" : "left"}
                        </p>
                        <div className="w-full h-1 rounded-full mt-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.progress || 0) / (item.totalEpisodes || 24) * 100)}%`, background: "#D4AF37" }} />
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/watch/${item.animeId}`); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(212,175,55,0.1)] transition-all">
                          <Play className="w-4 h-4" style={{ color: "#D4AF37" }} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removeHistory.mutate({ animeId: String(item.animeId) }); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(239,68,68,0.1)] transition-all">
                          <Trash2 className="w-3.5 h-3.5" style={{ color: "var(--nv-text-dim)" }} />
                        </button>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`} style={{ color: "var(--nv-text-dim)" }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--nv-text-dim)" }} />
            <p className="text-[18px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "لا يوجد سجل مشاهدة" : "No watch history"}</p>
            <p className="text-[14px] mt-1" style={{ color: "var(--nv-text-tertiary)" }}>{isRTL ? "ابدأ بمشاهدة بعض الأنمي" : "Start watching some anime"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
