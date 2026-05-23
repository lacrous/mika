import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Filter } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/context/LanguageContext";

export function ReviewsHubPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [sort, setSort] = useState<"newest" | "top">("newest");
  const [filterRating, setFilterRating] = useState(0);

  // Get all reviews by querying multiple anime (simplified - get recent reviews)
  const reviewsQuery = trpc.reviews.list.useQuery({ animeId: "0" }, { retry: false });
  const allReviews = (reviewsQuery.data || []) as any[];

  const filtered = allReviews
    .filter((r: any) => filterRating === 0 || r.rating >= filterRating)
    .sort((a: any, b: any) => sort === "top" ? (b.helpfulCount || 0) - (a.helpfulCount || 0) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Rating distribution
  const dist = allReviews.reduce((acc: Record<number, number>, r: any) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});
  const total = allReviews.length;
  const avg = total > 0 ? (allReviews.reduce((s: number, r: any) => s + r.rating, 0) / total).toFixed(1) : "0";

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1000px] mx-auto">
        <motion.h1 className="text-[24px] font-bold mb-6 flex items-center gap-3" style={{ color: "var(--nv-text-primary)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <MessageSquare className="w-6 h-6" style={{ color: "var(--nv-gold)"}} />{isRTL ? "جميع المراجعات" : "Reviews Hub"}
        </motion.h1>

        {/* Rating Overview */}
        <motion.div className="rounded-xl p-5 mb-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <p className="text-[48px] font-bold" style={{ color: "#D4AF37" }}>{avg}</p>
              <p className="text-[13px]" style={{ color: "var(--nv-text-muted)" }}>{total} {isRTL ? "مراجعة" : "reviews"}</p>
            </div>
            <div className="space-y-1.5">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((r) => {
                const count = dist[r] || 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={r} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] w-3" style={{ color: "var(--nv-text-dim)" }}>{r}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: r >= 8 ? "#22c55e" : r >= 5 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <span className="text-[9px] w-6 text-right" style={{ color: "var(--nv-text-dim)" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.02)" }}>
            {(["newest", "top"] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)}
                className="px-3 py-1 rounded-md text-[11px] font-medium transition-all"
                style={{ background: sort === s ? "rgba(212,175,55,0.08)" : "transparent", color: sort === s ? "#D4AF37" : "var(--nv-text-muted)" }}>
                {s === "top" ? (isRTL ? "الأعلى" : "Top") : (isRTL ? "الأحدث" : "Newest")}
              </button>
            ))}
          </div>
          <select value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))}
            className="h-8 rounded-lg text-[11px] px-2 admin-input">
            <option value="0">{isRTL ? "كل التقييمات" : "All Ratings"}</option>
            {[10, 9, 8, 7, 6, 5].map((r) => <option key={r} value={r}>{r}+</option>)}
          </select>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          {filtered.map((review: any, i: number) => (
            <motion.div key={review.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
                    {(review.userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{review.userName}</p>
                    <p className="text-[10px]" style={{ color: "var(--nv-text-dim)" }}>{review.animeTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{ color: i < (review.rating || 0) ? "#D4AF37" : "var(--nv-text-dim)", fill: i < (review.rating || 0) ? "#D4AF37" : "none" }} />
                  ))}
                </div>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--nv-text-secondary)" }}>{review.content}</p>
              <div className={`flex items-center gap-3 mt-2 text-[10px] ${isRTL ? "flex-row-reverse" : ""}`} style={{ color: "var(--nv-text-dim)" }}>
                <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5" />{review.helpfulCount || 0}</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-center py-20 text-[13px]" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد مراجعات" : "No reviews yet"}</p>}
        </div>
      </div>
    </div>
  );
}
