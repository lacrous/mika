import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Megaphone, ThumbsUp, Plus, Check, X, Clock, Filter } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

export function AnimeRequestsPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const utils = trpc.useUtils();
  const requestsQuery = trpc.requests.list.useQuery({ status: statusFilter, limit: 50 }, { retry: false });
  const createReq = trpc.requests.create.useMutation({ onSuccess: () => { utils.requests.list.invalidate(); setShowForm(false); setTitle(""); setDesc(""); } });
  const voteReq = trpc.requests.vote.useMutation({ onSuccess: () => utils.requests.list.invalidate() });

  const requests = (requestsQuery.data || []) as any[];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[800px] mx-auto">
        <motion.div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[24px] font-bold flex items-center gap-3" style={{ color: "var(--nv-text-primary)" }}>
            <Megaphone className="w-6 h-6" style={{ color: "var(--nv-gold)"}} />{isRTL ? "طلبات الأنمي" : "Anime Requests"}
          </h1>
          {isAuthenticated && (
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}><Plus className="w-4 h-4" />{isRTL ? "طلب جديد" : "New Request"}</button>
          )}
        </motion.div>

        {/* Create Form */}
        {showForm && (
          <motion.div className="rounded-xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isRTL ? "عنوان الأنمي" : "Anime title"}
              className="w-full h-10 rounded-lg text-[13px] px-3 mb-2 admin-input" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={isRTL ? "وصف أو ملاحظات (اختياري)" : "Description or notes (optional)"}
              className="w-full h-20 rounded-lg text-[13px] px-3 py-2 mb-2 admin-input resize-none" />
            <button onClick={() => title.trim() && createReq.mutate({ title: title.trim(), description: desc })}
              disabled={!title.trim() || createReq.isPending}
              className="px-4 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>{isRTL ? "إرسال" : "Submit"}</button>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-full text-[10px] font-medium capitalize transition-all"
              style={{ background: statusFilter === s ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.02)", color: statusFilter === s ? "#D4AF37" : "var(--nv-text-muted)", border: statusFilter === s ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
              {s === "all" ? (isRTL ? "الكل" : "All") : s}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {requests.map((req: any, i: number) => (
            <motion.div key={req.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <h3 className="text-[14px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{req.title}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{
                      background: req.status === "approved" ? "rgba(34,197,94,0.1)" : req.status === "rejected" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                      color: req.status === "approved" ? "#22c55e" : req.status === "rejected" ? "#ef4444" : "#f59e0b",
                    }}>{req.status}</span>
                  </div>
                  {req.description && <p className="text-[12px] mb-2" style={{ color: "var(--nv-text-muted)" }}>{req.description}</p>}
                  <div className={`flex items-center gap-3 text-[10px] ${isRTL ? "flex-row-reverse" : ""}`} style={{ color: "var(--nv-text-dim)" }}>
                    <span>{req.userName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => voteReq.mutate({ requestId: req.id })}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:bg-[rgba(212,175,55,0.1)] ml-2 flex-shrink-0"
                  style={{ color: "#D4AF37", background: "rgba(212,175,55,0.05)" }}>
                  <ThumbsUp className="w-3 h-3" />{req.votes || 0}
                </button>
              </div>
            </motion.div>
          ))}
          {requests.length === 0 && <p className="text-center py-20 text-[13px]" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد طلبات" : "No requests yet"}</p>}
        </div>
      </div>
    </div>
  );
}
