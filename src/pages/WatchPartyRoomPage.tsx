import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tv, Users, Send, Crown, Copy, LogOut, Play, Pause, SkipForward, Volume2, Settings, X, ChevronLeft, Clock, Wifi,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  id: string;
  userName: string;
  content: string;
  timestamp: number;
}

export function WatchPartyRoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { isRTL, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [chatOpen, setChatOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = (en: string, ar: string) => language === "ar" ? ar : en;

  // Get party data
  const partyQuery = trpc.watchParty.get.useQuery(
    { roomCode: roomCode || "" },
    { enabled: !!roomCode && isAuthenticated, retry: false, refetchInterval: 3000 }
  );
  const party = partyQuery.data as any;

  // Sync mutation
  const syncMutation = trpc.watchParty.sync.useMutation();
  const leaveMutation = trpc.watchParty.leave.useMutation({
    onSuccess: () => navigate("/party"),
  });

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate receiving time sync
  useEffect(() => {
    if (party?.currentTime !== undefined) {
      setCurrentTime(party.currentTime);
    }
    if (party?.isPlaying !== undefined) {
      setIsPlaying(!!party.isPlaying);
    }
  }, [party?.currentTime, party?.isPlaying]);

  const sendMessage = () => {
    if (!message.trim() || !user) return;
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      userName: user.name || "Guest",
      content: message.trim(),
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const togglePlayback = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    if (roomCode) {
      syncMutation.mutate({ roomCode, currentTime, isPlaying: newPlaying });
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
        <div className="text-center">
          <Tv className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
          <p className="text-[16px]" style={{ color: "var(--nv-text-primary)" }}>{t("Sign in to join the watch party", "سجل الدخول للانضمام")}</p>
        </div>
      </div>
    );
  }

  const participants = party?.participants || [];
  const isHost = party?.hostId === user?.id;

  return (
    <div className="h-screen flex flex-col" style={{ background: "#0a0a0a" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 h-12 border-b flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`} style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(10,10,10,0.9)" }}>
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <button onClick={() => { leaveMutation.mutate({ roomCode: roomCode || "" }); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5">
            <ChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} style={{ color: "var(--nv-text-muted)" }} />
          </button>
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span className="text-[13px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{t("Watch Party", "واتش بارتي")}</span>
          </div>
          <button onClick={copyCode} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all hover:bg-white/5"
            style={{ background: "rgba(212,175,55,0.08)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.15)" }}>
            <Copy className="w-3 h-3" />{roomCode}
            {showCopied && <span className="ml-1 text-[9px]" style={{ color: "#22c55e" }}>✓</span>}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--nv-text-muted)" }}>
            <Users className="w-3.5 h-3.5" />{participants.length}
          </div>
          <button onClick={() => setChatOpen(!chatOpen)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 lg:hidden">
            {chatOpen ? <X className="w-4 h-4" style={{ color: "var(--nv-text-muted)" }} /> : <Wifi className="w-4 h-4" style={{ color: "var(--nv-text-muted)" }} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Video Player Placeholder */}
          <div className="flex-1 flex items-center justify-center relative" style={{ background: "#000" }}>
            <div className="text-center">
              <Tv className="w-16 h-16 mx-auto mb-4" style={{ color: "rgba(212,175,55,0.3)" }} />
              <p className="text-[14px] font-medium mb-1" style={{ color: "var(--nv-text-primary)" }}>{party?.animeTitle || t("Loading...", "جاري التحميل...")}</p>
              <p className="text-[12px]" style={{ color: "var(--nv-text-muted)" }}>{t("Synchronized playback", "تشغيل متزامن")}</p>
              {isHost && <span className="inline-flex items-center gap-1 text-[10px] mt-2 px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}><Crown className="w-2.5 h-2.5" />{t("Host", "المضيف")}</span>}
            </div>
          </div>

          {/* Player Controls */}
          <div className="h-14 flex items-center justify-between px-4 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(10,10,10,0.95)" }}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button onClick={togglePlayback} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.15)" }}>
                {isPlaying ? <Pause className="w-4 h-4" style={{ color: "#D4AF37" }} /> : <Play className="w-4 h-4 ml-0.5" style={{ color: "#D4AF37" }} />}
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5">
                <SkipForward className="w-4 h-4" style={{ color: "var(--nv-text-muted)" }} />
              </button>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-1 rounded-full overflow-hidden cursor-pointer" style={{ background: "rgba(255,255,255,0.08)" }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  const newTime = pct * 1440;
                  setCurrentTime(newTime);
                  if (roomCode) syncMutation.mutate({ roomCode, currentTime: newTime, isPlaying });
                }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(currentTime / 1440) * 100}%`, background: "linear-gradient(90deg, #D4AF37, #F0D878)" }} />
              </div>
              <div className={`flex justify-between mt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-[9px] font-mono" style={{ color: "var(--nv-text-dim)" }}>{formatTime(currentTime)}</span>
                <span className="text-[9px] font-mono" style={{ color: "var(--nv-text-dim)" }}>24:00</span>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5">
                <Volume2 className="w-4 h-4" style={{ color: "var(--nv-text-muted)" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div className="w-72 border-l flex flex-col flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(10,10,10,0.95)" }}
              initial={{ width: 0, opacity: 0 }} animate={{ width: 288, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}>

              {/* Participants */}
              <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "var(--nv-text-dim)" }}>{t("Participants", "المشاركون")} ({participants.length})</p>
                <div className="flex flex-wrap gap-1">
                  {participants.map((p: any) => (
                    <span key={p.userId} className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(255,255,255,0.04)", color: "var(--nv-text-muted)" }}>
                      {p.userId === party?.hostId && <Crown className="w-2 h-2" style={{ color: "#D4AF37" }} />}{p.userName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.length === 0 ? (
                  <p className="text-[11px] text-center py-8" style={{ color: "var(--nv-text-dim)" }}>{t("Start chatting!", "ابدأ الدردشة!")}</p>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-semibold" style={{ color: "#D4AF37" }}>{msg.userName}</span>
                        <span className="text-[8px]" style={{ color: "var(--nv-text-dim)" }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-[12px]" style={{ color: "var(--nv-text-secondary)" }}>{msg.content}</p>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex gap-1.5">
                  <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={t("Type a message...", "اكتب رسالة...")}
                    className="flex-1 h-8 rounded-lg text-[12px] px-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(212,175,55,0.3)]"
                    style={{ color: "var(--nv-text-primary)" }} />
                  <button onClick={sendMessage} disabled={!message.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: message.trim() ? "rgba(212,175,55,0.15)" : "transparent" }}>
                    <Send className="w-3.5 h-3.5" style={{ color: message.trim() ? "#D4AF37" : "var(--nv-text-dim)" }} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
