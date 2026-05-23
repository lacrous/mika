import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Users, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

interface LiveChatProps {
  roomId: string;
  isRTL?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function LiveChat({ roomId, isRTL = false, isOpen, onToggle }: LiveChatProps) {
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Poll messages every 3 seconds
  const messagesQuery = trpc.chat.messages.useQuery(
    { roomId, limit: 50 },
    { refetchInterval: 3000, retry: false }
  );
  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: () => {
      setMessage("");
      messagesQuery.refetch();
    },
  });

  const messages = messagesQuery.data || [];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim() || !isAuthenticated) return;
    sendMessage.mutate({ roomId, content: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <>
      {/* Toggle Button */}
      <button onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)", boxShadow: "0 4px 20px rgba(212,175,55,0.3)" }}>
        {isOpen ? <X className="w-5 h-5 text-[#0a0a0a]" /> : <MessageCircle className="w-5 h-5 text-[#0a0a0a]" />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] rounded-xl overflow-hidden flex flex-col"
            style={{ height: 480, background: "var(--nv-bg-secondary)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-10 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5" style={{ color: "#D4AF37" }} />
                <span className="text-[12px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>Live Chat</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" style={{ color: "var(--nv-text-dim)" }} />
                <span className="text-[10px]" style={{ color: "var(--nv-text-dim)" }}>{messages.length}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[11px] text-center" style={{ color: "var(--nv-text-dim)" }}>
                    {isRTL ? "لا توجد رسائل بعد. كن أول من يرسل!" : "No messages yet. Be the first to send!"}
                  </p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMe = user?.name === msg.userName;
                  return (
                    <div key={msg.id} className={`${isMe ? (isRTL ? "text-right" : "text-left") : (isRTL ? "text-left" : "text-right")}`}>
                      <div className={`inline-block max-w-[85%] ${isMe ? (isRTL ? "mr-0" : "ml-0") : (isRTL ? "ml-0" : "mr-0")}`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-semibold" style={{ color: isMe ? "#D4AF37" : "var(--nv-text-muted)" }}>{msg.userName}</span>
                          <span className="text-[8px]" style={{ color: "var(--nv-text-dim)" }}>{formatTime(msg.timestamp)}</span>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-lg text-[12px] leading-relaxed" style={{
                          background: isMe ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                          color: "var(--nv-text-secondary)",
                          border: isMe ? "1px solid rgba(212,175,55,0.1)" : "1px solid rgba(255,255,255,0.03)",
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {isAuthenticated ? (
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input ref={inputRef} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder={isRTL ? "اكتب رسالة..." : "Type a message..."}
                    className="flex-1 h-8 rounded-lg text-[12px] px-3 admin-input"
                    style={{ background: "rgba(255,255,255,0.03)", color: "var(--nv-text-primary)" }} />
                  <button onClick={handleSend} disabled={!message.trim() || sendMessage.isPending}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: message.trim() ? "rgba(212,175,55,0.15)" : "transparent" }}>
                    <Send className="w-3.5 h-3.5" style={{ color: message.trim() ? "#D4AF37" : "var(--nv-text-dim)" }} />
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-center py-1" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "سجل الدخول للمشاركة في الدردشة" : "Sign in to join the chat"}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
