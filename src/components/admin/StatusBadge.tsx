import { motion } from "framer-motion";

type Status = "active" | "inactive" | "pending" | "approved" | "flagged" | "deleted" | "online" | "offline" | "warning" | "error" | "success" | "ongoing" | "completed" | "upcoming";

const statusConfig: Record<Status, { bg: string; color: string; border: string; dot: string }> = {
 active: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)", dot: "#22c55e" },
 online: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)", dot: "#22c55e" },
 success: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)", dot: "#22c55e" },
 completed: { bg: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "rgba(212,175,55,0.2)", dot: "#D4AF37" },
 approved: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)", dot: "#22c55e" },
 ongoing: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)", dot: "#22c55e" },
 inactive: { bg: "rgba(156,163,175,0.1)", color: "#9CA3AF", border: "rgba(156,163,175,0.2)", dot: "#9CA3AF" },
 offline: { bg: "rgba(156,163,175,0.1)", color: "#9CA3AF", border: "rgba(156,163,175,0.2)", dot: "#9CA3AF" },
 pending: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.2)", dot: "#60a5fa" },
 upcoming: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.2)", dot: "#60a5fa" },
 flagged: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.2)", dot: "#ef4444" },
 warning: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.2)", dot: "#f59e0b" },
 error: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.2)", dot: "#ef4444" },
 deleted: { bg: "rgba(100,100,100,0.1)", color: "#666", border: "rgba(100,100,100,0.2)", dot: "#666" },
};

interface StatusBadgeProps {
 status: Status | string;
 pulse?: boolean;
 size?: "sm" | "md";
}

export function StatusBadge({ status, pulse = false, size = "sm" }: StatusBadgeProps) {
 const config = statusConfig[status as Status] || statusConfig.inactive;
 const height = size === "sm" ? "h-5" : "h-6";
 const textSize = size === "sm" ? "text-[10px]" : "text-[11px]";
 const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

 return (
 <span
 className={`inline-flex items-center gap-1.5 px-2 ${height} rounded-full ${textSize} font-medium capitalize`}
 style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
 >
 {pulse && (
 <span className="relative flex">
 <motion.span
 className={`${dotSize} rounded-full`}
 style={{ background: config.dot }}
 animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
 transition={{ duration: 2, repeat: Infinity }}
 />
 </span>
 )}
 {!pulse && <span className={`${dotSize} rounded-full`} style={{ background: config.dot }} />}
 {status}
 </span>
 );
}
