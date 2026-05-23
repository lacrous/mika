import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Tv, Plus, LogIn, Users, Copy, Crown } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

export function WatchPartyPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();
  const [roomCode, setRoomCode] = useState("");
  const [animeId, setAnimeId] = useState("1");
  const [episodeId, setEpisodeId] = useState("1");

  const createParty = trpc.watchParty.create.useMutation({
    onSuccess: (data) => { if (data.roomCode) navigate(`/party/${data.roomCode}`); },
  });
  const joinParty = trpc.watchParty.join.useMutation({
    onSuccess: (data) => { if (data.party) navigate(`/party/${data.party.roomCode}`); },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="text-center">
          <Tv className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
          <p className="text-[16px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "سجل الدخول لاستخدام واتش بارتي" : "Sign in to use Watch Party"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[600px] mx-auto">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Tv className="w-12 h-12 mx-auto mb-3" style={{ color: "#D4AF37" }} />
          <h1 className="text-[24px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "واتش بارتي" : "Watch Party"}</h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "شاهد الأنمي مع أصدقائك" : "Watch anime together with friends"}</p>
        </motion.div>

        {/* Create Room */}
        <motion.div className="rounded-xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
            <Plus className="w-4 h-4" style={{ color: "#D4AF37"}} />{isRTL ? "إنشاء غرفة" : "Create Room"}
          </h2>
          <div className={`flex gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <input value={animeId} onChange={(e) => setAnimeId(e.target.value)} placeholder={isRTL ? "معرف الأنمي" : "Anime ID"}
              className="flex-1 h-10 rounded-lg text-[12px] px-3 admin-input" />
            <input value={episodeId} onChange={(e) => setEpisodeId(e.target.value)} placeholder={isRTL ? "معرف الحلقة" : "Episode ID"}
              className="flex-1 h-10 rounded-lg text-[12px] px-3 admin-input" />
          </div>
          <button onClick={() => createParty.mutate({ animeId: Number(animeId), episodeId: Number(episodeId) })}
            disabled={createParty.isPending}
            className="w-full h-10 rounded-lg text-[13px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
            {createParty.isPending ? (isRTL ? "جاري..." : "Creating...") : (isRTL ? "إنشاء غرفة" : "Create Room")}
          </button>
        </motion.div>

        {/* Join Room */}
        <motion.div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
            <LogIn className="w-4 h-4" style={{ color: "#D4AF37"}} />{isRTL ? "الانضمام لغرفة" : "Join Room"}
          </h2>
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder={isRTL ? "أدخل رمز الغرفة" : "Enter room code"}
              className="flex-1 h-10 rounded-lg text-[12px] px-3 uppercase tracking-widest admin-input" maxLength={8} />
            <button onClick={() => roomCode && joinParty.mutate({ roomCode })}
              disabled={!roomCode || joinParty.isPending}
              className="px-5 h-10 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
              {isRTL ? "انضمام" : "Join"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
