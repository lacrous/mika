import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Star, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight,
  Search, Clock, ThumbsUp, AlertTriangle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useUIStore } from "@/stores/useUIStore";

const ITEMS_PER_PAGE = 10;

export function AdminReviewsPage() {
  const { isRTL } = useLanguage();
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "flagged">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Real tRPC queries
  const adminStats = trpc.admin.stats.useQuery(undefined, { retry: false });
  const reviewsQuery = trpc.admin.reviews.list.useQuery(
    { page, limit: ITEMS_PER_PAGE, status: statusFilter },
    { retry: false }
  );
  const utils = trpc.useUtils();

  const moderate = trpc.admin.reviews.moderate.useMutation({
    onSuccess: (_, vars) => {
      utils.admin.reviews.list.invalidate();
      utils.admin.stats.invalidate();
      const actionLabel = vars.action === "approve" ? (isRTL ? "تمت الموافقة" : "Approved") : vars.action === "flag" ? (isRTL ? "تم الإبلاغ" : "Flagged") : (isRTL ? "تم الحذف" : "Deleted");
      addToast({ message: `${actionLabel}`, type: "success" });
      setDeleteConfirm(null);
    },
    onError: (err) => {
      addToast({ message: err.message, type: "error" });
    },
  });

  const stats = adminStats.data || { totalReviews: 0 };
  const allReviews: any[] = reviewsQuery.data || [];

  // Client-side search filter
  const filtered = search.trim()
    ? allReviews.filter((r) =>
        r.userName?.toLowerCase().includes(search.toLowerCase()) ||
        r.animeTitle?.toLowerCase().includes(search.toLowerCase()) ||
        r.content?.toLowerCase().includes(search.toLowerCase())
      )
    : allReviews;

  const approvedCount = allReviews.filter((r) => r.isApproved === "approved").length;
  const flaggedCount = allReviews.filter((r) => r.isApproved === "flagged").length;

  const handleModerate = (reviewId: number, action: "approve" | "flag" | "delete") => {
    if (action === "delete") {
      setDeleteConfirm(reviewId);
      return;
    }
    moderate.mutate({ reviewId, action });
  };

  const confirmDelete = () => {
    if (deleteConfirm !== null) {
      moderate.mutate({ reviewId: deleteConfirm, action: "delete" });
    }
  };

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard icon={MessageSquare} label="Total Reviews" labelAr="إجمالي التقييمات" value={stats.totalReviews || allReviews.length} change={12} changeLabel={isRTL ? "+8 هذا الشهر" : "+8 this month"} color="#60a5fa" index={0} sparklineData={[20, 25, 30, 28, 35, 38, 42]} isRTL={isRTL} />
        <AdminStatCard icon={CheckCircle} label="Approved" labelAr="المعتمد" value={approvedCount} color="#22c55e" index={1} isRTL={isRTL} />
        <AdminStatCard icon={AlertTriangle} label="Flagged" labelAr="المبلغ عنه" value={flaggedCount} color="#ef4444" index={2} isRTL={isRTL} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={isRTL ? "البحث في التقييمات..." : "Search reviews..."}
            className="w-full h-10 rounded-lg text-[13px] placeholder-[#555] outline-none bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] transition-colors ps-10 pe-4" />
        </div>
        <div className="flex gap-2">
          {(["all", "approved", "flagged"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{ background: statusFilter === s ? "rgba(212, 175, 55, 0.1)" : "rgba(255, 255, 255, 0.03)", color: statusFilter === s ? "#D4AF37" : "#555", border: statusFilter === s ? "1px solid rgba(212, 175, 55, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)" }}>
              {s === "all" ? (isRTL ? "الكل" : "All") : s === "approved" ? (isRTL ? "معتمد" : "Approved") : (isRTL ? "مبلغ" : "Flagged")}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-3">
        {reviewsQuery.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="h-4 w-32 rounded bg-[rgba(255,255,255,0.03)] animate-pulse mb-3" />
              <div className="h-3 w-full rounded bg-[rgba(255,255,255,0.03)] animate-pulse mb-2" />
              <div className="h-3 w-2/3 rounded bg-[rgba(255,255,255,0.03)] animate-pulse" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <MessageSquare className="w-12 h-12 text-[#333] mx-auto mb-3" />
            <p className="text-[14px] text-[#555]">{isRTL ? "لا توجد تقييمات" : "No reviews found"}</p>
          </div>
        ) : (
          filtered.map((review: any, i: number) => (
            <motion.div
              key={review.id}
              className="rounded-xl p-5 transition-all hover:border-[rgba(212,175,55,0.15)]"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[14px] font-bold" style={{ background: "linear-gradient(135deg, #D4AF3720, #F0D87820)", border: "1px solid rgba(212,175,55,0.15)", color: "#D4AF37" }}>
                    {review.userName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{review.userName || "Unknown"}</span>
                      <StatusBadge status={(review.isApproved === "approved" ? "approved" : review.isApproved === "flagged" ? "flagged" : "pending") as any} />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#555] mb-2">
                      <span className="text-[#D4AF37] font-medium">{review.animeTitle}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed max-w-[600px]" style={{ color: "var(--nv-text-muted)" }}>{review.content}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(212,175,55,0.08)" }}>
                    <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    <span className="text-[13px] font-bold text-[#D4AF37]">{review.rating}</span>
                    <span className="text-[10px] text-[#555]">/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {review.isApproved !== "approved" && (
                      <button onClick={() => handleModerate(review.id, "approve")} disabled={moderate.isPending}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#22c55e] hover:bg-[rgba(34,197,94,0.08)] transition-all disabled:opacity-50" title={isRTL ? "موافقة" : "Approve"}>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {review.isApproved !== "flagged" && (
                      <button onClick={() => handleModerate(review.id, "flag")} disabled={moderate.isPending}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)] transition-all disabled:opacity-50" title={isRTL ? "إبلاغ" : "Flag"}>
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleModerate(review.id, "delete")} disabled={moderate.isPending}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all disabled:opacity-50" title={isRTL ? "حذف" : "Delete"}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[rgba(255,255,255,0.03)]">
                <span className="flex items-center gap-1 text-[10px] text-[#555]">
                  <ThumbsUp className="w-3 h-3" />{review.helpfulCount || 0} {isRTL ? "مفيد" : "helpful"}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-[11px] text-[#555]">{filtered.length} {isRTL ? "تقييم" : "reviews"}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4 rtl-flip" />
          </button>
          <span className="text-[11px] text-[#888] font-mono px-2">{page}</span>
          <button onClick={() => setPage(page + 1)} disabled={filtered.length < ITEMS_PER_PAGE} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <motion.div className="relative w-full max-w-[360px] rounded-2xl p-6" style={{ background: "linear-gradient(180deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.08)" }}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Trash2 className="w-6 h-6 text-[#ef4444]" />
            </div>
            <h3 className="text-[16px] font-bold text-center mb-1" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "حذف التقييم" : "Delete Review"}</h3>
            <p className="text-[12px] text-[#888] text-center mb-6">{isRTL ? "هل أنت متأكد؟ لا يمكن التراجع." : "Are you sure? This cannot be undone."}</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} disabled={moderate.isPending}
                className="flex-1 h-10 rounded-lg text-[13px] font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors disabled:opacity-50">
                {moderate.isPending ? (isRTL ? "جاري..." : "Deleting...") : (isRTL ? "حذف" : "Delete")}
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg text-[13px] font-medium text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                {isRTL ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
