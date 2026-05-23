import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Calendar, Film, Hash, Clock, Share2, Heart } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LiveChat } from "@/components/LiveChat";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

export function WatchPage() {
  const { animeId: animeIdParam } = useParams<{ animeId: string }>();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const animeId = Number(animeIdParam) || 1;

  const [currentEpId, setCurrentEpId] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch anime details
  const animeQuery = trpc.anime.byId.useQuery({ id: animeId }, { retry: false });
  // Fetch episodes
  const episodesQuery = trpc.episodes.list.useQuery({ animeId }, { retry: false });

  const anime = animeQuery.data;
  const episodes = episodesQuery.data || [];

  // Set first episode as default
  useEffect(() => {
    if (episodes.length > 0 && currentEpId === null) {
      setCurrentEpId(episodes[0].id);
    }
  }, [episodes, currentEpId]);

  const currentEpisode = episodes.find((e: any) => e.id === currentEpId) || episodes[0];

  const handleEpisodeChange = (ep: any) => {
    setCurrentEpId(ep.id);
  };

  if (animeQuery.isLoading || episodesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center">
          <Film className="w-12 h-12 text-[#333] mx-auto mb-3" />
          <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "لم يتم العثور على الأنمي" : "Anime not found"}</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 rounded-lg text-[12px] font-medium text-[#0a0a0a]" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
            {isRTL ? "العودة للرئيسية" : "Back to Home"}
          </button>
        </div>
      </div>
    );
  }

  const videoSrc = currentEpisode?.videoUrl || "";
  const ratingDisplay = typeof anime.rating === "number" && anime.rating > 10 ? (anime.rating / 10).toFixed(1) : anime.rating;

  return (
    <div className="min-h-screen" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Video Player */}
      <div className="w-full bg-black">
        {videoSrc ? (
          <VideoPlayer
            src={videoSrc}
            animeTitle={anime.title}
            animeId={animeId}
            animeImage={anime.image}
            currentEpisode={currentEpisode}
            episodes={episodes}
            onEpisodeChange={handleEpisodeChange}
            isRTL={isRTL}
          />
        ) : (
          <div className="w-full flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
            <div className="text-center">
              <Film className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
              <p className="text-[14px]" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "لا يوجد رابط فيديو لهذه الحلقة" : "No video URL for this episode"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Anime Info */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {anime.image && (
                  <img src={anime.image} alt={anime.title} className="w-20 h-28 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-[20px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{anime.title}</h1>
                  <p className="text-[13px] mt-1 line-clamp-2" style={{ color: "var(--nv-text-muted)" }}>{anime.synopsis}</p>
                  <div className={`flex flex-wrap items-center gap-3 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--nv-gold)" }}><Star className="w-3.5 h-3.5 fill-[#D4AF37]" />{ratingDisplay}</span>
                    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--nv-text-muted)" }}><Calendar className="w-3.5 h-3.5" />{anime.year}</span>
                    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--nv-text-muted)" }}><Film className="w-3.5 h-3.5" />{anime.studio}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: anime.status === "Ongoing" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)", color: anime.status === "Ongoing" ? "#22c55e" : "#3b82f6" }}>{anime.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Episode Grid */}
            <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}><Hash className="w-4 h-4" style={{ color: "var(--nv-gold)"}} />{isRTL ? "جميع الحلقات" : "All Episodes"} ({episodes.length})</h3>
              {episodes.length === 0 ? (
                <p className="text-[13px] text-center py-8" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد حلقات متاحة" : "No episodes available"}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {episodes.map((ep: any) => {
                    const isActive = ep.id === currentEpId;
                    return (
                      <button key={ep.id} onClick={() => handleEpisodeChange(ep)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${isActive ? "ring-1" : "hover:bg-[rgba(255,255,255,0.03)]"}`}
                        style={{
                          background: isActive ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.015)",
                          color: isActive ? "#D4AF37" : "var(--nv-text-secondary)",
                          border: isActive ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.04)",
                          ringColor: isActive ? "rgba(212,175,55,0.3)" : "transparent",
                        }}>
                        <span className="text-[11px] font-mono opacity-50">{ep.number}</span>
                        <span className="truncate">{ep.title || `${isRTL ? "حلقة" : "Ep"} ${ep.number}`}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Genres */}
            <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "التصنيفات" : "Genres"}</h3>
              <div className="flex flex-wrap gap-1.5">
                {(anime.genres || []).map((g: string) => (
                  <span key={g} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: "rgba(212,175,55,0.06)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.12)" }}>{g}</span>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] flex items-center gap-2" style={{ color: "var(--nv-text-muted)" }}><Hash className="w-3.5 h-3.5" />{isRTL ? "إجمالي الحلقات" : "Total Episodes"}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{anime.episodes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] flex items-center gap-2" style={{ color: "var(--nv-text-muted)" }}><Clock className="w-3.5 h-3.5" />{isRTL ? "المدة/الحلقة" : "Duration/Ep"}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{currentEpisode?.duration || 24}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] flex items-center gap-2" style={{ color: "var(--nv-text-muted)" }}><Star className="w-3.5 h-3.5" />{isRTL ? "التقييم" : "Rating"}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#D4AF37" }}>{ratingDisplay}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Live Chat */}
      <LiveChat
        roomId={`anime-${animeId}`}
        isRTL={isRTL}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />
    </div>
  );
}
