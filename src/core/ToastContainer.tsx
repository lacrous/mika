/**
 * MIKA TOAST CONTAINER
 * Premium notification system with smooth animations.
 */
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

const icons = {
 success: CheckCircle,
 error: AlertCircle,
 warning: AlertTriangle,
 info: Info,
};

const colors = {
 success: "#22C55E",
 error: "#EF4444",
 warning: "#F59E0B",
 info: "#3B82F6",
};

export function ToastContainer() {
 const toasts = useUIStore((s) => s.toasts);
 const removeToast = useUIStore((s) => s.removeToast);

 return (
 <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
 <AnimatePresence mode="popLayout">
 {toasts.map((toast) => {
 const Icon = icons[toast.type];
 return (
 <motion.div
 key={toast.id}
 layout
 initial={{ opacity: 0, x: 40, scale: 0.9 }}
 animate={{ opacity: 1, x: 0, scale: 1 }}
 exit={{ opacity: 0, x: 40, scale: 0.9 }}
 transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
 className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl min-w-[280px] max-w-[400px]"
 style={{
 background: "rgba(20, 20, 20, 0.9)",
 backdropFilter: "blur(20px)",
 border: `1px solid ${colors[toast.type]}30`,
 boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${colors[toast.type]}15`,
 }}
 >
 <Icon className="w-4 h-4 flex-shrink-0" style={{ color: colors[toast.type] }} />
 <span className="text-[13px] text-white flex-1">{toast.message}</span>
 <button
 onClick={() => removeToast(toast.id)}
 className="w-6 h-6 rounded-full flex items-center justify-center text-[#666] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
 >
 <X className="w-3 h-3" />
 </button>
 </motion.div>
 );
 })}
 </AnimatePresence>
 </div>
 );
}
