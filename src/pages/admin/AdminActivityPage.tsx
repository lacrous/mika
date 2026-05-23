import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, UserPlus, MessageSquare, Shield, Film, Trash2, CheckCircle,
  XCircle, AlertTriangle, Search, ChevronLeft, ChevronRight, Clock,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";

interface ActivityLog {
  id: number;
  action: "user_register" | "review_create" | "review_approve" | "review_flag" | "review_delete" | "anime_create" | "anime_update" | "anime_delete" | "user_promote" | "user_demote" | "login" | "settings_change";
  actor: string;
  target: string;
  details: string;
  timestamp: string;
}

const mockLogs: ActivityLog[] = [
  { id: 1, action: "user_register", actor: "System", target: "Ahmed Hassan", details: "New user registered via email", timestamp: "2025-05-23T10:30:00" },
  { id: 2, action: "review_create", actor: "Ahmed K.", target: "Attack on Titan", details: "Posted a review with 10/10 rating", timestamp: "2025-05-23T10:25:00" },
  { id: 3, action: "review_approve", actor: "Admin", target: "Review #42", details: "Approved a pending review", timestamp: "2025-05-23T10:20:00" },
  { id: 4, action: "anime_create", actor: "Admin", target: "Solo Leveling S2", details: "Added new anime to the library", timestamp: "2025-05-23T09:45:00" },
  { id: 5, action: "user_promote", actor: "Admin", target: "Sara Ali", details: "Promoted to admin role", timestamp: "2025-05-23T09:30:00" },
  { id: 6, action: "review_flag", actor: "System", target: "Review #38", details: "Auto-flagged for containing spam", timestamp: "2025-05-23T09:15:00" },
  { id: 7, action: "anime_update", actor: "Admin", target: "Demon Slayer", details: "Updated episode count from 26 to 28", timestamp: "2025-05-23T08:50:00" },
  { id: 8, action: "settings_change", actor: "Admin", target: "Site Settings", details: "Changed default language to Arabic", timestamp: "2025-05-23T08:30:00" },
  { id: 9, action: "review_delete", actor: "Admin", target: "Review #35", details: "Deleted inappropriate review", timestamp: "2025-05-22T18:20:00" },
  { id: 10, action: "user_demote", actor: "Admin", target: "Omar R.", details: "Demoted from admin to user", timestamp: "2025-05-22T16:10:00" },
  { id: 11, action: "login", actor: "Sara M.", target: "Account", details: "User logged in successfully", timestamp: "2025-05-22T14:45:00" },
  { id: 12, action: "anime_delete", actor: "Admin", target: "Test Anime", details: "Removed duplicate entry", timestamp: "2025-05-22T12:30:00" },
];

const actionConfig: Record<ActivityLog["action"], { icon: any; label: string; labelAr: string; color: string }> = {
  user_register: { icon: UserPlus, label: "User Registration", labelAr: "تسجيل مستخدم", color: "#60a5fa" },
  review_create: { icon: MessageSquare, label: "New Review", labelAr: "تقييم جديد", color: "#D4AF37" },
  review_approve: { icon: CheckCircle, label: "Review Approved", labelAr: "موافقة على تقييم", color: "#22c55e" },
  review_flag: { icon: AlertTriangle, label: "Review Flagged", labelAr: "تقييم مبلغ", color: "#f59e0b" },
  review_delete: { icon: Trash2, label: "Review Deleted", labelAr: "حذف تقييم", color: "#ef4444" },
  anime_create: { icon: Film, label: "Anime Added", labelAr: "إضافة أنمي", color: "#a855f7" },
  anime_update: { icon: Film, label: "Anime Updated", labelAr: "تحديث أنمي", color: "#a855f7" },
  anime_delete: { icon: Trash2, label: "Anime Deleted", labelAr: "حذف أنمي", color: "#ef4444" },
  user_promote: { icon: Shield, label: "User Promoted", labelAr: "ترقية مستخدم", color: "#D4AF37" },
  user_demote: { icon: Shield, label: "User Demoted", labelAr: "تخفيض مستخدم", color: "#f59e0b" },
  login: { icon: UserPlus, label: "User Login", labelAr: "دخول مستخدم", color: "#60a5fa" },
  settings_change: { icon: ClipboardList, label: "Settings Changed", labelAr: "تغيير إعدادات", color: "#9CA3AF" },
};

const ITEMS_PER_PAGE = 10;

export function AdminActivityPage() {
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>("all");

  const filtered = mockLogs.filter((log) => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return log.actor.toLowerCase().includes(q) || log.target.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return isRTL ? "الآن" : "Just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <AdminStatCard icon={ClipboardList} label="Total Logs" labelAr="إجمالي السجلات" value={mockLogs.length} color="#D4AF37" index={0} isRTL={isRTL} />
        <AdminStatCard icon={UserPlus} label="Today" labelAr="اليوم" value={mockLogs.filter((l) => l.timestamp.startsWith("2025-05-23")).length} color="#60a5fa" index={1} isRTL={isRTL} />
        <AdminStatCard icon={MessageSquare} label="Reviews" labelAr="التقييمات" value={mockLogs.filter((l) => l.action.startsWith("review_")).length} color="#22c55e" index={2} isRTL={isRTL} />
        <AdminStatCard icon={Shield} label="Admin Actions" labelAr="إجراءات الأدمن" value={mockLogs.filter((l) => l.actor === "Admin").length} color="#ef4444" index={3} isRTL={isRTL} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={isRTL ? "البحث في السجلات..." : "Search logs..."}
            className="w-full h-10 rounded-lg text-[13px] placeholder-[#555] outline-none bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] transition-colors ps-10 pe-4" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(["all", "user_register", "review_create", "review_approve", "review_flag", "review_delete", "anime_create", "anime_update", "anime_delete", "user_promote", "login", "settings_change"] as const).map((a) => (
            <button key={a} onClick={() => setActionFilter(a)} className="px-3 py-2 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap"
              style={{ background: actionFilter === a ? "rgba(212, 175, 55, 0.1)" : "rgba(255, 255, 255, 0.03)", color: actionFilter === a ? "#D4AF37" : "#555", border: actionFilter === a ? "1px solid rgba(212, 175, 55, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)" }}>
              {a === "all" ? (isRTL ? "الكل" : "All") : isRTL ? actionConfig[a].labelAr : actionConfig[a].label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 w-px bg-[rgba(255,255,255,0.05)]" style={{ insetInlineStart: 24 }} />

        <div className="space-y-4">
          {paginated.map((log, i) => {
            const config = actionConfig[log.action];
            const Icon = config.icon;
            return (
              <motion.div
                key={log.id}
                className="flex items-start gap-4 relative"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Icon dot */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10" style={{ background: `${config.color}12`, border: `1px solid ${config.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium" style={{ color: config.color }}>{isRTL ? config.labelAr : config.label}</span>
                      <span className="text-[10px] text-[#555]">· {log.actor}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-[#555]">
                      <Clock className="w-3 h-3" />{timeAgo(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-[13px]" style={{ color: "var(--nv-text-secondary)" }}>
                    <span className="font-medium" style={{ color: "var(--nv-text-primary)" }}>{log.target}</span> — {log.details}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {paginated.length === 0 && (
            <div className="text-center py-16">
              <ClipboardList className="w-12 h-12 text-[#333] mx-auto mb-3" />
              <p className="text-[14px] text-[#555]">{isRTL ? "لا توجد سجلات" : "No activity logs found"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-[11px] text-[#555]">{filtered.length} {isRTL ? "سجل" : "logs"}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4 rtl-flip" />
          </button>
          <span className="text-[11px] text-[#888] font-mono px-2">{page} / {totalPages || 1}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
