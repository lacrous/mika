import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, Clock, Monitor, Smartphone, Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { useLanguage } from "@/context/LanguageContext";

const monthlyViews = [
 { month: "Jan", views: 45000, users: 12000 },
 { month: "Feb", views: 52000, users: 14500 },
 { month: "Mar", views: 48000, users: 13200 },
 { month: "Apr", views: 61000, users: 16800 },
 { month: "May", views: 72000, users: 21000 },
];

const hourlyActivity = [
 { hour: "00:00", users: 120 },
 { hour: "03:00", users: 80 },
 { hour: "06:00", users: 200 },
 { hour: "09:00", users: 580 },
 { hour: "12:00", users: 720 },
 { hour: "15:00", users: 650 },
 { hour: "18:00", users: 890 },
 { hour: "21:00", users: 760 },
];

const deviceData = [
 { name: "Desktop", value: 58, icon: Monitor },
 { name: "Mobile", value: 35, icon: Smartphone },
 { name: "Tablet", value: 7, icon: Globe },
];

const topCountries = [
 { country: "Saudi Arabia", views: 18400, pct: 35 },
 { country: "Egypt", views: 11200, pct: 22 },
 { country: "UAE", views: 8400, pct: 16 },
 { country: "Morocco", views: 5200, pct: 10 },
 { country: "Algeria", views: 3800, pct: 7 },
];

export function AdminAnalyticsPage() {
 const { isRTL } = useLanguage();

 return (
 <AdminLayout>
 {/* Stats */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
 <AdminStatCard icon={Eye} label="Total Views" labelAr="إجمالي المشاهدات" value="72.4K" change={18.2} changeLabel={isRTL ? "هذا الشهر" : "this month"} color="#D4AF37" index={0} sparklineData={[40, 45, 42, 50, 55, 60, 72]} isRTL={isRTL} />
 <AdminStatCard icon={Users} label="Active Users" labelAr="المستخدمون النشطون" value="21.0K" change={12.8} changeLabel={isRTL ? "هذا الشهر" : "this month"} color="#60a5fa" index={1} sparklineData={[10, 12, 11, 14, 16, 18, 21]} isRTL={isRTL} />
 <AdminStatCard icon={TrendingUp} label="Avg. Session" labelAr="متوسط الجلسة" value="24m" change={5.4} changeLabel={isRTL ? "هذا الشهر" : "this month"} color="#22c55e" index={2} isRTL={isRTL} />
 <AdminStatCard icon={Clock} label="Watch Time" labelAr="وقت المشاهدة" value="1.2M min" change={22.1} changeLabel={isRTL ? "هذا الشهر" : "this month"} color="#ef4444" index={3} isRTL={isRTL} />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Monthly Traffic Chart */}
 <motion.div
 className="lg:col-span-2 rounded-xl p-6"
 style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.15 }}
 >
 <div className={`flex items-center justify-between mb-6`}>
 <div>
 <h3 className="text-[15px] font-bold admin-text-primary">{isRTL ? "حركة المرور الشهرية" : "Monthly Traffic"}</h3>
 <p className="text-[11px] admin-text-dim mt-0.5">{isRTL ? "آخر 5 أشهر" : "Last 5 months"}</p>
 </div>
 <div className={`flex items-center gap-4 text-[11px]`}>
 <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><span className="admin-text-muted">{isRTL ? "المشاهدات" : "Views"}</span></span>
 <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#60a5fa]" /><span className="admin-text-muted">{isRTL ? "المستخدمون" : "Users"}</span></span>
 </div>
 </div>
 <ResponsiveContainer width="100%" height={280}>
 <BarChart data={monthlyViews} barGap={4}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
 <XAxis dataKey="month" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
 <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
 <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
 <Bar dataKey="views" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={28} />
 <Bar dataKey="users" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={28} />
 </BarChart>
 </ResponsiveContainer>
 </motion.div>

 {/* Device Breakdown */}
 <motion.div
 className="rounded-xl p-6"
 style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 >
 <h3 className="text-[15px] font-bold admin-text-primary mb-1">{isRTL ? "الأجهزة" : "Device Breakdown"}</h3>
 <p className="text-[11px] admin-text-dim mb-5">{isRTL ? "حسب نوع الجهاز" : "By device type"}</p>
 <div className="space-y-5">
 {deviceData.map((d, i) => (
 <div key={d.name}>
 <div className={`flex items-center justify-between mb-2`}>
 <div className={`flex items-center gap-2`}>
 <d.icon className="w-4 h-4 admin-text-muted" />
 <span className="text-[12px] admin-text-secondary">{d.name}</span>
 </div>
 <span className="text-[12px] admin-text-primary font-medium">{d.value}%</span>
 </div>
 <ProgressBar value={d.value} color={i === 0 ? "#D4AF37" : i === 1 ? "#60a5fa" : "#22c55e"} height={5} showValue={false} />
 </div>
 ))}
 </div>
 </motion.div>

 {/* Hourly Activity */}
 <motion.div
 className="lg:col-span-2 rounded-xl p-6"
 style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.25 }}
 >
 <div className={`flex items-center justify-between mb-6`}>
 <div>
 <h3 className="text-[15px] font-bold admin-text-primary">{isRTL ? "النشاط حسب الساعة" : "Hourly Activity"}</h3>
 <p className="text-[11px] admin-text-dim mt-0.5">{isRTL ? "المستخدمون النشطون على مدار اليوم" : "Active users throughout the day"}</p>
 </div>
 </div>
 <ResponsiveContainer width="100%" height={220}>
 <AreaChart data={hourlyActivity}>
 <defs>
 <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.25} />
 <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
 <XAxis dataKey="hour" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
 <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
 <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
 <Area type="monotone" dataKey="users" stroke="#D4AF37" strokeWidth={2} fill="url(#hourGrad)" />
 </AreaChart>
 </ResponsiveContainer>
 </motion.div>

 {/* Top Countries */}
 <motion.div
 className="rounded-xl p-6"
 style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 >
 <h3 className="text-[15px] font-bold admin-text-primary mb-1">{isRTL ? "أعلى الدول" : "Top Countries"}</h3>
 <p className="text-[11px] admin-text-dim mb-5">{isRTL ? "حسب عدد المشاهدات" : "By view count"}</p>
 <div className="space-y-4">
 {topCountries.map((c, i) => (
 <div key={c.country}>
 <div className={`flex items-center justify-between mb-1.5`}>
 <span className="text-[12px] admin-text-secondary">{c.country}</span>
 <span className="text-[11px] admin-text-muted font-mono">{(c.views / 1000).toFixed(1)}k</span>
 </div>
 <ProgressBar value={c.pct} color={i === 0 ? "#D4AF37" : "#555"} height={4} showValue={false} />
 </div>
 ))}
 </div>
 </motion.div>
 </div>
 </AdminLayout>
 );
}
