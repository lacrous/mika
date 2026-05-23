import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface CalendarViewProps {
  isRTL?: boolean;
}

export function CalendarView({ isRTL = false }: CalendarViewProps) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const episodesQuery = trpc.episodes.list.useQuery({ animeId: 0 }, { retry: false, enabled: false });

  const monthNames = isRTL
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dayNames = isRTL
    ? ["أحد", "إثن", "ثلاث", "أرب", "خميس", "جمعة", "سبت"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDay }, () => null);

  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h3 className="text-[14px] font-semibold flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
          <Calendar className="w-4 h-4" style={{ color: "var(--nv-gold)" }} />
          {isRTL ? "جدول الحلقات" : "Episode Schedule"}
        </h3>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all" style={{ color: "var(--nv-text-muted)" }}>
            <ChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
          <span className="text-[12px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{monthNames[month]} {year}</span>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all" style={{ color: "var(--nv-text-muted)" }}>
            <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[9px] uppercase tracking-wider font-semibold py-1" style={{ color: "var(--nv-text-dim)" }}>{d}</div>
        ))}
        {emptySlots.map((_, i) => <div key={`e${i}`} />)}
        {days.map((day) => {
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          return (
            <motion.div key={day} className="aspect-square rounded-lg flex items-center justify-center text-[11px] cursor-pointer transition-all hover:bg-white/5"
              style={{
                background: isToday ? "rgba(212,175,55,0.1)" : "transparent",
                color: isToday ? "#D4AF37" : "var(--nv-text-muted)",
                border: isToday ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
              }}
              whileHover={{ scale: 1.05 }}>
              {day}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
