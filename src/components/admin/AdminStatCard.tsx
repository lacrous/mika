import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Sparkline } from "./Sparkline";

interface AdminStatCardProps {
 icon: LucideIcon;
 label: string;
 labelAr: string;
 value: string | number;
 change?: number;
 changeLabel?: string;
 color?: string;
 index?: number;
 sparklineData?: number[];
 isRTL?: boolean;
}

export function AdminStatCard({
 icon: Icon,
 label,
 labelAr,
 value,
 change,
 changeLabel,
 color = "#D4AF37",
 index = 0,
 sparklineData,
 isRTL = false,
}: AdminStatCardProps) {
 const isPositive = (change ?? 0) >= 0;

 return (
 <motion.div
 className="rounded-xl p-5 relative overflow-hidden group"
 style={{
 background: "rgba(255, 255, 255, 0.03)",
 border: "1px solid rgba(255, 255, 255, 0.06)",
 }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.08, duration: 0.4 }}
 whileHover={{
 borderColor: `${color}30`,
 boxShadow: `0 0 20px ${color}08`,
 }}
 >
 {/* Top row: icon + change badge */}
 <div className={`flex items-start justify-between mb-4`}>
 <div
 className="w-11 h-11 rounded-xl flex items-center justify-center"
 style={{ background: `${color}12`, border: `1px solid ${color}20` }}
 >
 <Icon className="w-5 h-5" style={{ color }} />
 </div>
 {change !== undefined && (
 <span
 className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPositive ? "text-emerald-400" : "text-red-400"}`}
 style={{ background: isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}
 >
 {isPositive ? "+" : ""}
 {change}%
 </span>
 )}
 </div>

 {/* Value */}
 <p className="text-[28px] font-bold text-white tracking-tight">{value}</p>

 {/* Label */}
 <p className="text-[12px] text-[#9CA3AF] mt-0.5">{isRTL ? labelAr : label}</p>

 {/* Change sub-label */}
 {changeLabel && (
 <p className="text-[10px] text-[#666] mt-1">{changeLabel}</p>
 )}

 {/* Sparkline */}
 {sparklineData && (
 <div className="mt-3 -mx-1">
 <Sparkline data={sparklineData} color={color} height={36} />
 </div>
 )}
 </motion.div>
 );
}
