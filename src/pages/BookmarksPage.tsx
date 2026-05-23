import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Bookmark, Bell, BellOff, Trash2, Film, Plus } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

export function BookmarksPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const utils = trpc.useUtils();
  const bookmarksQuery = trpc.bookmarks.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const deleteBookmark = trpc.bookmarks.delete.useMutation({ onSuccess: () => utils.bookmarks.list.invalidate() });

  const bookmarks = (bookmarksQuery.data || []) as any[];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
          <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "سجل الدخول لعرض قائمتك" : "Sign in to view your watchlist"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1000px] mx-auto">
        <motion.h1 className="text-[24px] font-bold mb-6 flex items-center gap-3" style={{ color: "var(--nv-text-primary)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Bookmark className="w-6 h-6" style={{ color: "var(--nv-gold)"}} />{isRTL ? "قائمة المشاهدة" : "My Watchlist"} ({bookmarks.length})
        </motion.h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--nv-text-dim)" }} />
            <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "قائمتك فارغة" : "Your watchlist is empty"}</p>
            <p className="text-[13px] mt-1" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "أضف أنمي للمتابعة" : "Bookmark anime to track them"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookmarks.map((b: any, i: number) => (
              <motion.div key={b.id} className="rounded-xl p-4 cursor-pointer hover:brightness-110 transition-all"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
                onClick={() => navigate(`/watch/${b.animeId}`)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {b.animeImage ? (
                    <img src={b.animeImage} alt="" className="w-14 h-20 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <Film className="w-6 h-6" style={{ color: "var(--nv-text-dim)" }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold truncate" style={{ color: "var(--nv-text-primary)" }}>{b.animeTitle}</h3>
                    {b.note && <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "var(--nv-text-muted)" }}>{b.note}</p>}
                    <div className={`flex items-center gap-2 mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {b.notifyNewEpisodes ? (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "#22c55e" }}><Bell className="w-2.5 h-2.5" />{isRTL ? "إشعارات مفعلة" : "Notifying"}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--nv-text-dim)" }}><BellOff className="w-2.5 h-2.5" />{isRTL ? "بدون إشعارات" : "Silent"}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteBookmark.mutate({ id: b.id }); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(239,68,68,0.1)] transition-all flex-shrink-0" style={{ color: "var(--nv-text-dim)" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
