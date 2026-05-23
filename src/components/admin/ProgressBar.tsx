import { motion } from "framer-motion";

interface ProgressBarProps {
 value: number;
 max?: number;
 color?: string;
 height?: number;
 label?: string;
 showValue?: boolean;
}

export function ProgressBar({ value, max = 100, color = "#D4AF37", height = 6, label, showValue = true }: ProgressBarProps) {
 const pct = Math.min(100, Math.max(0, (value / max) * 100));

 return (
 <div className="w-full">
 {(label || showValue) && (
 <div className="flex items-center justify-between mb-1.5">
 {label && <span className="text-[11px] text-[#9CA3AF]">{label}</span>}
 {showValue && <span className="text-[11px] font-mono text-[#E0E0E0]">{Math.round(pct)}%</span>}
 </div>
 )}
 <div
 className="w-full rounded-full overflow-hidden"
 style={{ height, background: "rgba(255,255,255,0.06)" }}
 dir="ltr"
 >
 <motion.div
 className="h-full rounded-full"
 style={{ background: color }}
 initial={{ width: 0 }}
 animate={{ width: `${pct}%` }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
 />
 </div>
 </div>
 );
}
