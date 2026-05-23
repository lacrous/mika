import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  Home, Search, Compass, Calendar, FolderHeart, GitCompare, Newspaper, Megaphone, Bookmark, MessageSquare, Tv, BookOpen, Award, Users, Settings, Shield, BarChart3, Database, Import, Download, ChevronRight, X, Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainLinks = [
  { to: "/", icon: Home, label: "Home", labelAr: "الرئيسية" },
  { to: "/browse", icon: Compass, label: "Browse", labelAr: "استكشف" },
  { to: "/search", icon: Search, label: "Advanced Search", labelAr: "بحث متقدم" },
  { to: "/seasonal", icon: Calendar, label: "Seasonal", labelAr: "المواسم" },
  { to: "/collections", icon: FolderHeart, label: "Collections", labelAr: "المجموعات" },
  { to: "/compare", icon: GitCompare, label: "Compare", labelAr: "مقارنة" },
  { to: "/news", icon: Newspaper, label: "News", labelAr: "الأخبار" },
  { to: "/requests", icon: Megaphone, label: "Requests", labelAr: "الطلبات" },
  { to: "/bookmarks", icon: Bookmark, label: "Watchlist", labelAr: "قائمة المشاهدة" },
  { to: "/reviews-hub", icon: MessageSquare, label: "Reviews Hub", labelAr: "المراجعات" },
  { to: "/party", icon: Tv, label: "Watch Party", labelAr: "واتش بارتي" },
  { to: "/profile", icon: Users, label: "Profile", labelAr: "الملف الشخصي" },
  { to: "/settings", icon: Settings, label: "Settings", labelAr: "الإعدادات" },
];

const adminLinks = [
  { to: "/admin", icon: Shield, label: "Dashboard", labelAr: "لوحة التحكم" },
  { to: "/admin/anime", icon: Database, label: "Anime Manager", labelAr: "إدارة الأنمي" },
  { to: "/admin/users", icon: Users, label: "Users", labelAr: "المستخدمين" },
  { to: "/admin/reviews", icon: MessageSquare, label: "Reviews", labelAr: "المراجعات" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics", labelAr: "التحليلات" },
  { to: "/admin/advanced-analytics", icon: Sparkles, label: "Advanced Analytics", labelAr: "تحليلات متقدمة" },
  { to: "/admin/import", icon: Import, label: "Bulk Import", labelAr: "استيراد" },
  { to: "/admin/export", icon: Download, label: "Export & Backup", labelAr: "تصدير" },
  { to: "/admin/activity", icon: Calendar, label: "Activity Logs", labelAr: "سجل النشاط" },
  { to: "/admin/settings", icon: Settings, label: "Settings", labelAr: "الإعدادات" },
];

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const { isRTL, language } = useLanguage();
  const { isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<"main" | "admin">("main");
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const links = activeSection === "main" ? mainLinks : adminLinks;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          {/* Panel */}
          <motion.div className="fixed top-0 bottom-0 z-[70] w-80 max-w-[85vw] overflow-y-auto custom-scrollbar"
            style={{
              background: "linear-gradient(180deg, var(--nv-bg-secondary), var(--nv-bg-primary))",
              borderLeft: isRTL ? "1px solid rgba(255,255,255,0.06)" : "none",
              borderRight: isRTL ? "none" : "1px solid rgba(255,255,255,0.06)",
              [isRTL ? "left" : "right"]: 0,
            }}
            initial={{ x: isRTL ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 28 }}
            dir={isRTL ? "rtl" : "ltr"}>

            {/* Header */}
            <div className={`flex items-center justify-between px-5 h-14 border-b`} style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <h2 className="text-[14px] font-bold tracking-wide" style={{ color: "var(--nv-text-primary)" }}>NUROVIA</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all">
                <X className="w-4 h-4" style={{ color: "var(--nv-text-dim)" }} />
              </button>
            </div>

            {/* Section Tabs */}
            {isAdmin && (
              <div className="flex gap-1 p-3">
                <button onClick={() => setActiveSection("main")}
                  className="flex-1 h-8 rounded-lg text-[11px] font-medium transition-all"
                  style={{ background: activeSection === "main" ? "rgba(212,175,55,0.1)" : "transparent", color: activeSection === "main" ? "#D4AF37" : "var(--nv-text-dim)", border: activeSection === "main" ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent" }}>
                  {t("Main", "رئيسي")}
                </button>
                <button onClick={() => setActiveSection("admin")}
                  className="flex-1 h-8 rounded-lg text-[11px] font-medium transition-all"
                  style={{ background: activeSection === "admin" ? "rgba(212,175,55,0.1)" : "transparent", color: activeSection === "admin" ? "#D4AF37" : "var(--nv-text-dim)", border: activeSection === "admin" ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent" }}>
                  {t("Admin", "إدارة")}
                </button>
              </div>
            )}

            {/* Links */}
            <nav className="px-3 pb-6">
              {links.map((link, i) => (
                <Link key={link.to} to={link.to} onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 hover:bg-[rgba(255,255,255,0.04)] ${isRTL ? "flex-row-reverse" : ""}`}
                  style={{ color: "var(--nv-text-secondary)" }}>
                  <link.icon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nv-text-dim)" }} />
                  <span className="flex-1">{isRTL ? link.labelAr : link.label}</span>
                  <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`} style={{ color: "var(--nv-text-dim)" }} />
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
