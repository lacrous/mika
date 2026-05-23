import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Heart, Trash2, Search, X, Film } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

export function FavoritesPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const favsQuery = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const removeFav = trpc.favorites.remove.useMutation({
    onSuccess: () => { utils.favorites.list.invalidate(); setConfirmRemove(null); },
  });

  const favorites = (favsQuery.data || []).filter((f: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.animeTitle?.toLowerCase().includes(q) || (f.genres || []).some((g: string) => g.toLowerCase().includes(q));
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="text-center">
          <Heart className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
          <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "سجل الدخول لعرض مفضلتك" : "Sign in to view your favorites"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent mb-2">
            {isRTL ? "المفضلة" : "My Favorites"}
          </h1>
          <p className="text-[14px] mb-8" style={{ color: "var(--nv-text-tertiary)" }}>
            {favorites.length} {isRTL ? "أنمي في المفضلة" : "anime in your collection"}
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 ${isRTL ? "right-4" : "left-4"}`} style={{ color: "var(--nv-text-dim)" }} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "ابحث في المفضلة..." : "Search favorites..."}
            className={`w-full h-12 rounded-xl text-[15px] outline-none transition-all duration-200 focus:border-[rgba(212,175,55,0.5)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"}`}
            style={{ color: "var(--nv-text-primary)" }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"}`}>
              <X className="w-4 h-4" style={{ color: "var(--nv-text-dim)" }} />
            </button>
          )}
        </div>

        {/* Grid */}
        {favsQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)", aspectRatio: "3/4" }} />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {favorites.map((fav: any, i: number) => (
              <motion.div key={fav.id} className="group relative rounded-xl overflow-hidden cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/watch/${fav.animeId}`)}>
                {fav.animeImage ? (
                  <img src={fav.animeImage} alt={fav.animeTitle} className="w-full aspect-[3/4] object-cover" />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center"><Film className="w-8 h-8" style={{ color: "var(--nv-text-dim)" }} /></div>
                )}
                <div className="p-3">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{fav.animeTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]" style={{ color: "#D4AF37" }}>★ {fav.animeRating || "—"}</span>
                  </div>
                </div>
                {/* Remove button */}
                <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(fav.animeId); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(239,68,68,0.8)" }}>
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
                {/* Confirm remove */}
                {confirmRemove === fav.animeId && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)" }}>
                    <div className="text-center p-3">
                      <p className="text-[11px] mb-2" style={{ color: "var(--nv-text-secondary)" }}>{isRTL ? "إزالة من المفضلة؟" : "Remove from favorites?"}</p>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => removeFav.mutate({ animeId: fav.animeId })} className="px-3 py-1 rounded-lg text-[10px] text-white" style={{ background: "#ef4444" }}>{isRTL ? "إزالة" : "Remove"}</button>
                        <button onClick={() => setConfirmRemove(null)} className="px-3 py-1 rounded-lg text-[10px]" style={{ background: "rgba(255,255,255,0.1)", color: "var(--nv-text-secondary)" }}>{isRTL ? "إلغاء" : "Cancel"}</button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--nv-text-dim)" }} />
            <p className="text-[18px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "لا توجد مفضلات" : "No favorites yet"}</p>
            <p className="text-[14px] mt-1" style={{ color: "var(--nv-text-tertiary)" }}>{isRTL ? "أضف أنمي للمفضلة من صفحة التفاصيل" : "Add anime to favorites from the detail page"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
