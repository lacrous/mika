import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Clock, Star, Heart, Eye, TrendingUp, Activity } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/context/LanguageContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#D4AF37", "#F0D878", "#C49B2A", "#E8CC5E", "#B8942E"];

export function AdminAdvancedAnalyticsPage() {
  const { isRTL } = useLanguage();
  const [days, setDays] = useState(30);

  const overviewQuery = trpc.analytics.overview.useQuery(undefined, { retry: false });
  const dailyQuery = trpc.analytics.daily.useQuery({ days }, { retry: false });
  const topAnimeQuery = trpc.analytics.topAnime.useQuery({ limit: 10 }, { retry: false });

  const overview = overviewQuery.data || { totalWatchTime: 0, totalReviews: 0, totalFavorites: 0, totalUsers: 0, todayViews: 0 };
  const daily = (dailyQuery.data || []) as any[];
  const topAnime = (topAnimeQuery.data || []) as any[];

  // Format watch time
  const watchHours = Math.floor((overview.totalWatchTime || 0) / 3600);

  // Prepare chart data - reverse for chronological order
  const chartData = [...daily].reverse().map((d: any) => ({
    date: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    users: d.activeUsers,
    watchTime: Math.round((d.totalWatchTime || 0) / 3600),
    episodes: d.episodesWatched,
    reviews: d.reviewsPosted,
    favorites: d.favoritesAdded,
    views: d.pageViews,
  }));

  const statCards = [
    { label: isRTL ? "إجمالي المستخدمين" : "Total Users", value: overview.totalUsers, icon: Users, color: "#D4AF37" },
    { label: isRTL ? "ساعات المشاهدة" : "Watch Hours", value: watchHours, icon: Clock, color: "#22c55e" },
    { label: isRTL ? "المراجعات" : "Reviews", value: overview.totalReviews, icon: Star, color: "#3b82f6" },
    { label: isRTL ? "المفضلات" : "Favorites", value: overview.totalFavorites, icon: Heart, color: "#ef4444" },
    { label: isRTL ? "المشاهدات اليوم" : "Views Today", value: overview.todayViews, icon: Eye, color: "#f59e0b" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] font-bold flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
          <Activity className="w-5 h-5" style={{ color: "var(--nv-gold)"}} />{isRTL ? "التحليلات المتقدمة" : "Advanced Analytics"}
        </h1>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.02)" }}>
          {[7, 14, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className="px-3 py-1 rounded-md text-[11px] font-medium transition-all"
              style={{ background: days === d ? "rgba(212,175,55,0.1)" : "transparent", color: days === d ? "#D4AF37" : "var(--nv-text-muted)" }}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {statCards.map((s, i) => (
          <motion.div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
            <p className="text-[22px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{s.value?.toLocaleString() || 0}</p>
            <p className="text-[10px]" style={{ color: "var(--nv-text-dim)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Active Users Chart */}
        <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "المستخدمين النشطين" : "Active Users"}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#555" fontSize={10} />
                <YAxis stroke="#555" fontSize={10} />
                <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="#D4AF37" fill="url(#userGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Watch Time Chart */}
        <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "وقت المشاهدة (ساعات)" : "Watch Time (Hours)"}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#555" fontSize={10} />
                <YAxis stroke="#555" fontSize={10} />
                <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="watchTime" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Stats */}
        <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "التفاعل" : "Engagement"}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#555" fontSize={10} />
                <YAxis stroke="#555" fontSize={10} />
                <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="episodes" stroke="#22c55e" fill="rgba(34,197,94,0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="reviews" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="favorites" stroke="#ef4444" fill="rgba(239,68,68,0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Anime */}
        <motion.div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "الأكثر مشاهدة" : "Top Watched Anime"}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {topAnime.map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold" style={{ background: i < 3 ? "rgba(212,175,55,0.1)" : "transparent", color: i < 3 ? "#D4AF37" : "var(--nv-text-dim)" }}>{i + 1}</span>
                <div className="flex-1 min-w-0"><p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{a.animeTitle}</p></div>
                <span className="text-[10px] font-mono" style={{ color: "var(--nv-text-dim)" }}>{Math.round((a.totalWatch || 0) / 3600)}h</span>
              </div>
            ))}
            {topAnime.length === 0 && <p className="text-[12px] text-center py-4" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد بيانات" : "No data yet"}</p>}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
