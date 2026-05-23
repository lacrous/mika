import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const schedule = [
 { day: 1, anime: "Demon Slayer", episode: "S4 Ep. 8", time: "18:00", image: "/hero-bg.jpg", animeId: "1" },
 { day: 1, anime: "Spy x Family", episode: "S2 Ep. 12", time: "20:30", image: "/poster-3.jpg", animeId: "3" },
 { day: 2, anime: "Jujutsu Kaisen", episode: "S3 Ep. 5", time: "19:00", image: "/poster-1.jpg", animeId: "301" },
 { day: 3, anime: "One Piece", episode: "Ep. 1120", time: "17:30", image: "/poster-5.jpg", animeId: "5" },
 { day: 3, anime: "My Hero Academia", episode: "S7 Ep. 15", time: "21:00", image: "/poster-6.jpg", animeId: "6" },
 { day: 4, anime: "Solo Leveling", episode: "S2 Ep. 7", time: "18:30", image: "/poster-7.jpg", animeId: "7" },
 { day: 5, anime: "Vinland Saga", episode: "S3 Ep. 3", time: "19:30", image: "/poster-9.jpg", animeId: "9" },
 { day: 6, anime: "Attack on Titan", episode: "OVA Ep. 2", time: "20:00", image: "/poster-2.jpg", animeId: "2" },
 { day: 0, anime: "Hunter x Hunter", episode: "Rewatch Ep. 45", time: "16:00", image: "/poster-8.jpg", animeId: "8" },
];

export function SchedulePage() {
 const navigate = useNavigate();
 const { isRTL } = useLanguage();
 const today = new Date().getDay();
 const days = isRTL ? daysAr : daysEn;

 const getScheduleForDay = (day: number) => schedule.filter((s) => s.day === day);

 return (
 <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
 <div style={{ paddingInline: "clamp(5vw, 8vw, 10vw)" }}>
 {/* Header */}
 <motion.div className={`flex items-center gap-3 mb-2`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <Calendar className="w-8 h-8 text-[#D4AF37]" />
 <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#F0D878] via-[#D4AF37] to-[#F0D878] bg-clip-text text-transparent">
 {isRTL ? "جدول الإصدارات" : "Release Schedule"}
 </h1>
 </motion.div>
 <p className="text-[14px] text-[#9CA3AF] mb-8">
 {isRTL ? "تابع أحدث حلقات الأنمي الأسبوعي" : "Track the latest weekly anime episodes"}
 </p>

 {/* Airing Now Banner */}
 <motion.div
 className="rounded-xl p-4 mb-8 flex items-center gap-4"
 style={{
 background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.02))",
 border: "1px solid rgba(212, 175, 55, 0.15)",
 }}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 >
 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
 <span className="text-[14px] text-[#D4AF37] font-medium">
 {isRTL ? `اليوم: ${daysAr[today]} — ${getScheduleForDay(today).length} حلقة جديدة` : `Today: ${daysEn[today]} — ${getScheduleForDay(today).length} new episodes`}
 </span>
 </motion.div>

 {/* Weekly Grid */}
 <div className="space-y-6">
 {days.map((dayName, dayIdx) => {
 const daySchedule = getScheduleForDay(dayIdx);
 const isToday = dayIdx === today;

 return (
 <motion.div
 key={dayIdx}
 className="rounded-xl overflow-hidden"
 style={{
 background: isToday ? "rgba(212, 175, 55, 0.03)" : "rgba(255, 255, 255, 0.02)",
 border: isToday ? "1px solid rgba(212, 175, 55, 0.15)" : "1px solid rgba(255, 255, 255, 0.05)",
 }}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 + dayIdx * 0.05 }}
 >
 {/* Day Header */}
 <div className={`px-5 py-3 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between`}>
 <div className={`flex items-center gap-3`}>
 <h3 className={`text-[15px] font-semibold ${isToday ? "text-[#D4AF37]" : "text-white"}`}>{dayName}</h3>
 {isToday && (
 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
 {isRTL ? "اليوم" : "Today"}
 </span>
 )}
 </div>
 <span className="text-[12px] text-[#9CA3AF]">
 {daySchedule.length} {isRTL ? "حلقة" : "episodes"}
 </span>
 </div>

 {/* Episodes */}
 {daySchedule.length > 0 ? (
 <div className="divide-y divide-[rgba(255,255,255,0.04)]">
 {daySchedule.map((item, i) => (
 <motion.button
 key={`${item.animeId}-${i}`}
 onClick={() => navigate(`/watch/${item.animeId}`)}
 className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-[rgba(255,255,255,0.04)] text-left`}
 initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2 + i * 0.03 }}
 >
 <img src={item.image} alt={item.anime} className="w-16 h-10 rounded object-cover flex-shrink-0" />
 <div className={`flex-1 min-w-0 ${isRTL ? "text-end" : ""}`}>
 <p className="text-[14px] text-white font-medium truncate">{item.anime}</p>
 <p className="text-[12px] text-[#9CA3AF]">{item.episode}</p>
 </div>
 <div className={`flex items-center gap-1 text-[12px] text-[#9CA3AF] flex-shrink-0`}>
 <Clock className="w-3 h-3" />
 {item.time}
 </div>
 </motion.button>
 ))}
 </div>
 ) : (
 <p className="text-center py-6 text-[13px] text-[#666]">
 {isRTL ? "لا يوجد إصدارات هذا اليوم" : "No releases this day"}
 </p>
 )}
 </motion.div>
 );
 })}
 </div>
 </div>
 </div>
 );
}
