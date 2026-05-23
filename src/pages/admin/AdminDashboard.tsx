import { Suspense, lazy } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Film, Users, MessageSquare, Heart, Eye, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, Zap, Clock, Globe, BarChart3,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Sparkline } from "@/components/admin/Sparkline";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";

const Admin3DHero = lazy(() => import("@/components/admin/Admin3DHero").then((m) => ({ default: m.Admin3DHero })));

const weeklyData = [
  { day: "Mon", views: 4200, users: 1200 },
  { day: "Tue", views: 5100, users: 1500 },
  { day: "Wed", views: 4800, users: 1350 },
  { day: "Thu", views: 6200, users: 1800 },
  { day: "Fri", views: 7500, users: 2200 },
  { day: "Sat", views: 9100, users: 2800 },
  { day: "Sun", views: 8600, users: 2600 },
];

const genreDist = [
  { name: "Action", value: 35 },
  { name: "Adventure", value: 20 },
  { name: "Fantasy", value: 15 },
  { name: "Sci-Fi", value: 12 },
  { name: "Drama", value: 10 },
  { name: "Other", value: 8 },
];
const GENRE_COLORS = ["#D4AF37", "#22c55e", "#60a5fa", "#ef4444", "#a855f7", "#78716c"];

const topAnime = [
  { title: "Attack on Titan", views: 12400, rating: 9.5, trend: 12, img: "/poster-2.jpg" },
  { title: "Demon Slayer", views: 11200, rating: 9.4, trend: 8, img: "/hero-bg.jpg" },
  { title: "Jujutsu Kaisen", views: 10800, rating: 9.2, trend: -3, img: "/poster-1.jpg" },
  { title: "Solo Leveling", views: 9600, rating: 9.1, trend: 24, img: "/poster-7.jpg" },
  { title: "One Piece", views: 8900, rating: 9.0, trend: 5, img: "/poster-5.jpg" },
];

const activity = [
  { user: "Ahmed K.", action: "favorited", target: "Attack on Titan", time: "2 min ago", icon: Heart, color: "#ef4444" },
  { user: "Sarah M.", action: "watched", target: "JJK Ep. 12", time: "5 min ago", icon: Eye, color: "#60a5fa" },
  { user: "Omar R.", action: "reviewed", target: "Demon Slayer", time: "12 min ago", icon: MessageSquare, color: "#D4AF37" },
  { user: "Laila A.", action: "joined", target: "", time: "20 min ago", icon: Users, color: "#22c55e" },
  { user: "Mohammed S.", action: "completed", target: "FMAB", time: "1h ago", icon: Activity, color: "#a855f7" },
  { user: "Youssef D.", action: "watched", target: "Spy x Family Ep.5", time: "2h ago", icon: Eye, color: "#60a5fa" },
];

function StatCard({ icon: Icon, label, labelAr, value, change, sublabel, color, delay = 0 }: {
  icon: any; label: string; labelAr: string; value: string | number; change?: number; sublabel?: string; color: string; delay?: number;
}) {
  const { isRTL } = useLanguage();
  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      className="admin-panel rounded-xl p-5 relative overflow-hidden group hover:border-opacity-30 transition-all duration-300"
      style={{ borderColor: `${color}15` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      whileHover={{ borderColor: `${color}30`, boxShadow: `0 0 20px ${color}08` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPositive ? "text-emerald-400" : "text-red-400"}`} style={{ background: isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-[28px] font-bold admin-text-primary tracking-tight">{value}</p>
      <p className="text-[12px] admin-text-tertiary mt-0.5">{isRTL ? labelAr : label}</p>
      {sublabel && <p className="text-[10px] admin-text-dim mt-1">{sublabel}</p>}
      <div className="mt-3 -mx-1">
        <Sparkline data={[30, 45, 32, 50, 48, 55, value as number > 100 ? 80 : (value as number)]} color={color} height={32} />
      </div>
    </motion.div>
  );
}

function QuickAction({ icon: Icon, title, titleAr, desc, descAr, href, delay = 0 }: {
  icon: any; title: string; titleAr: string; desc: string; descAr: string; href: string; delay?: number;
}) {
  const { isRTL } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + delay * 0.05 }}>
      <Link to={href} className="admin-panel rounded-xl p-4 flex items-center gap-4 group hover:bg-[var(--nv-bg-card-hover)] transition-all duration-200 cursor-pointer">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.1)" }}>
          <Icon className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] admin-text-primary font-semibold group-hover:text-[#D4AF37] transition-colors">{isRTL ? titleAr : title}</p>
          <p className="text-[11px] admin-text-dim">{isRTL ? descAr : desc}</p>
        </div>
        <ArrowUpRight className="w-4 h-4 admin-text-dim group-hover:text-[#D4AF37] transition-all opacity-0 group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { isRTL } = useLanguage();
  const statsQuery = trpc.admin.stats.useQuery(undefined, { retry: false });
  const animeStatsQuery = trpc.anime.stats.useQuery(undefined, { retry: false });
  const stats = statsQuery.data || { totalUsers: 0, totalReviews: 0, totalFavorites: 0 };
  const animeStats = animeStatsQuery.data || { total: 0, trending: 0, ongoing: 0, completed: 0 };

  const actions = [
    { icon: Film, title: "Add Anime", titleAr: "إضافة أنمي", desc: "Add a new title to the library", descAr: "إضافة عمل جديد للمكتبة", href: "/admin/anime" },
    { icon: Users, title: "Manage Users", titleAr: "إدارة المستخدمين", desc: "View and manage all users", descAr: "عرض وإدارة جميع المستخدمين", href: "/admin/users" },
    { icon: MessageSquare, title: "Moderate Reviews", titleAr: "مراجعة التقييمات", desc: "Approve or delete user reviews", descAr: "الموافقة على أو حذف التقييمات", href: "/admin/reviews" },
    { icon: BarChart3, title: "View Analytics", titleAr: "عرض التحليلات", desc: "Detailed traffic and usage data", descAr: "بيانات حركة المرور والاستخدام", href: "/admin/analytics" },
  ];

  return (
    <AdminLayout>
      {/* 3D Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-[200px] rounded-2xl admin-panel animate-pulse" />}>
            <Admin3DHero className="h-[200px]" />
          </Suspense>
          {/* Overlay text on 3D */}
          <div className="relative -mt-[200px] h-[200px] flex flex-col justify-center px-8 pointer-events-none z-10">
            <motion.h2 className="text-[24px] font-bold admin-text-primary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {isRTL ? "لوحة تحكم NUROVIA" : "NUROVIA Control Panel"}
            </motion.h2>
            <motion.p className="text-[13px] admin-text-tertiary mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {isRTL ? "مراقبة وإدارة منصتك" : "Monitor and manage your platform"}
            </motion.p>
            <motion.div className="flex gap-4 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <span className="flex items-center gap-1.5 text-[11px] admin-text-muted">
                <Zap className="w-3 h-3 text-[#D4AF37]" /> {isRTL ? "الكل يعمل" : "All systems operational"}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] admin-text-muted">
                <Globe className="w-3 h-3 text-[#22c55e]" /> {isRTL ? "متصل" : "Online"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {actions.map((a, i) => (
            <QuickAction key={a.href} {...a} delay={i} />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Film} label="Total Anime" labelAr="إجمالي الأنمي" value={animeStats.total} change={12} sublabel={isRTL ? "+3 هذا الشهر" : "+3 this month"} color="#D4AF37" delay={0} />
        <StatCard icon={Users} label="Users" labelAr="المستخدمين" value={stats.totalUsers} change={8.5} sublabel={isRTL ? "+12 هذا الأسبوع" : "+12 this week"} color="#60a5fa" delay={1} />
        <StatCard icon={MessageSquare} label="Reviews" labelAr="التقييمات" value={stats.totalReviews} change={-2.3} sublabel={isRTL ? "منذ آخر شهر" : "vs last month"} color="#22c55e" delay={2} />
        <StatCard icon={Heart} label="Favorites" labelAr="المفضلات" value={stats.totalFavorites} change={15.2} sublabel={isRTL ? "+28 هذا الشهر" : "+28 this month"} color="#ef4444" delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <motion.div className="lg:col-span-2 admin-panel rounded-xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold admin-text-primary">{isRTL ? "حركة المرور الأسبوعية" : "Weekly Traffic"}</h3>
              <p className="text-[11px] admin-text-dim mt-0.5">{isRTL ? "المشاهدات والمستخدمون النشطون" : "Views vs Active Users"}</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><span className="admin-text-muted">{isRTL ? "المشاهدات" : "Views"}</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#60a5fa]" /><span className="admin-text-muted">{isRTL ? "المستخدمون" : "Users"}</span></span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} /><stop offset="100%" stopColor="#D4AF37" stopOpacity={0} /></linearGradient>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} /><stop offset="100%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient>
              </defs>
              <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke="#D4AF37" strokeWidth={2} fill="url(#vg)" />
              <Area type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} fill="url(#ug)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Genre Pie */}
          <motion.div className="admin-panel rounded-xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="text-[15px] font-bold admin-text-primary mb-1">{isRTL ? "توزيع التصنيفات" : "Genres"}</h3>
            <p className="text-[11px] admin-text-dim mb-4">{isRTL ? "حسب عدد الأعمال" : "By anime count"}</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={genreDist} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                  {genreDist.map((_, i) => <Cell key={i} fill={GENRE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {genreDist.map((g, i) => (
                <div key={g.name} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GENRE_COLORS[i] }} /><span className="text-[11px] admin-text-muted">{g.name}</span><span className="text-[11px] admin-text-dim ms-auto">{g.value}%</span></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Anime + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div className="admin-panel rounded-xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-bold admin-text-primary">{isRTL ? "الأنمي الأكثر شعبية" : "Top Performing"}</h3>
              <p className="text-[11px] admin-text-dim mt-0.5">{isRTL ? "بالمشاهدات هذا الأسبوع" : "By views this week"}</p>
            </div>
            <Link to="/admin/anime" className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1">{isRTL ? "عرض الكل" : "View All"} <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {topAnime.map((a, i) => (
              <motion.div key={a.title} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--nv-bg-card-hover)] transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.05 }}>
                <span className="text-[11px] admin-text-dim font-mono w-4">{i + 1}</span>
                <img src={a.img} alt="" className="w-8 h-12 rounded object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] admin-text-primary font-medium truncate">{a.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] admin-text-muted"><Eye className="w-3 h-3" />{(a.views / 1000).toFixed(1)}k</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#D4AF37]"><TrendingUp className="w-3 h-3" />{a.rating}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${a.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {a.trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span className="text-[11px] font-medium">{Math.abs(a.trend)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="admin-panel rounded-xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold admin-text-primary">{isRTL ? "النشاط الأخير" : "Recent Activity"}</h3>
              <p className="text-[11px] admin-text-dim mt-0.5">{isRTL ? "آخر 6 أحداث" : "Last 6 events"}</p>
            </div>
            <Activity className="w-4 h-4 admin-text-dim" />
          </div>
          <div className="space-y-1">
            {activity.map((act, i) => (
              <motion.div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--nv-bg-card-hover)] transition-colors"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.04 }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${act.color}10`, border: `1px solid ${act.color}20` }}>
                  <act.icon className="w-3.5 h-3.5" style={{ color: act.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] admin-text-primary"><span className="font-medium">{act.user}</span> <span className="admin-text-muted">{act.action}</span>{act.target && <span className="text-[#D4AF37]"> {act.target}</span>}</p>
                  <p className="flex items-center gap-1 text-[10px] admin-text-dim mt-0.5"><Clock className="w-2.5 h-2.5" />{act.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
