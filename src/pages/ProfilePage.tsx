import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Award, Clock, Eye, Heart, Star, TrendingUp, Flame, Calendar, Film, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { AchievementsPanel } from "@/components/AchievementsPanel";

export function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isRTL } = useLanguage();

  const favsQuery = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const historyQuery = trpc.history.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const reviewsQuery = trpc.reviews.myReview.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const reviews = (reviewsQuery.data ? [reviewsQuery.data] : []) as any[];

  const favorites = (favsQuery.data || []) as any[];
  const history = (historyQuery.data || []) as any[];

  const totalWatchTime = history.reduce((sum: number, h: any) => sum + (h.progress || 0), 0);
  const watchHours = Math.floor(totalWatchTime / 3600);
  const watchMins = Math.floor((totalWatchTime % 3600) / 60);

  const stats = [
    { label: isRTL ? "الحلقات" : "Episodes", labelAr: "الحلقات", value: history.length, icon: Film, color: "#D4AF37" },
    { label: isRTL ? "المفضلة" : "Favorites", labelAr: "المفضلة", value: favorites.length, icon: Heart, color: "#ef4444" },
    { label: isRTL ? "المراجعات" : "Reviews", labelAr: "المراجعات", value: reviews.length, icon: Star, color: "#3b82f6" },
    { label: isRTL ? "ساعات المشاهدة" : "Watch Hours", labelAr: "ساعات المشاهدة", value: `${watchHours}h ${watchMins}m`, icon: Clock, color: "#22c55e" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="text-center">
          <Eye className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
          <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "سجل الدخول لعرض ملفك" : "Sign in to view your profile"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <motion.div className={`flex items-center gap-4 mb-8 ${isRTL ? "flex-row-reverse" : ""}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-[24px] font-bold" style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "2px solid rgba(212,175,55,0.3)" }}>
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-[22px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{user?.name || "User"}</h1>
            <p className="text-[12px]" style={{ color: "var(--nv-text-muted)" }}>{user?.email}</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <p className="text-[20px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{s.value}</p>
              <p className="text-[11px]" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? s.labelAr : s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AchievementsPanel isRTL={isRTL} />
        </motion.div>

        {/* Continue Watching */}
        {history.length > 0 && (
          <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-[16px] font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
              <Flame className="w-4 h-4" style={{ color: "#D4AF37" }} />{isRTL ? "متابعة المشاهدة" : "Continue Watching"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {history.slice(0, 4).map((h: any, i) => (
                <motion.div key={i} className="rounded-xl p-3 cursor-pointer hover:brightness-110 transition-all"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onClick={() => navigate(`/watch/${h.animeId}`)} whileHover={{ y: -2 }}>
                  <div className="w-full aspect-video rounded-lg mb-2 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Film className="w-6 h-6" style={{ color: "var(--nv-text-dim)" }} />
                  </div>
                  <p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{h.animeTitle}</p>
                  <p className="text-[10px]" style={{ color: "var(--nv-text-dim)" }}>Ep {h.episodeNumber || "?"}</p>
                  <div className="w-full h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (h.progress || 0) / (h.totalEpisodes || 24) * 100)}%`, background: "#D4AF37" }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-[16px] font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
              <Heart className="w-4 h-4" style={{ color: "#ef4444" }} />{isRTL ? "المفضلة" : "Favorites"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {favorites.slice(0, 4).map((f: any, i) => (
                <motion.div key={i} className="rounded-xl p-3 cursor-pointer hover:brightness-110 transition-all"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onClick={() => navigate(`/watch/${f.animeId}`)} whileHover={{ y: -2 }}>
                  <div className="w-full aspect-video rounded-lg mb-2 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Film className="w-6 h-6" style={{ color: "var(--nv-text-dim)" }} />
                  </div>
                  <p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{f.animeTitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
