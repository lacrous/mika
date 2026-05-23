import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Film, Users, MessageSquare, BarChart3, Settings,
  Menu, X, LogOut, ChevronLeft, Shield, Search, Bell, Home,
  ClipboardList, Globe, Sun, Moon, Sparkles, Import, Download, Database,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", labelAr: "لوحة التحكم", icon: LayoutDashboard, href: "/admin" },
  { label: "Anime", labelAr: "الأنمي", icon: Film, href: "/admin/anime" },
  { label: "Users", labelAr: "المستخدمين", icon: Users, href: "/admin/users" },
  { label: "Reviews", labelAr: "التقييمات", icon: MessageSquare, href: "/admin/reviews" },
  { label: "Analytics", labelAr: "التحليلات", icon: BarChart3, href: "/admin/analytics" },
  { label: "Adv. Analytics", labelAr: "تحليلات متقدمة", icon: Sparkles, href: "/admin/advanced-analytics" },
  { label: "Import", labelAr: "استيراد", icon: Import, href: "/admin/import" },
  { label: "Export", labelAr: "تصدير", icon: Download, href: "/admin/export" },
  { label: "Seed Data", labelAr: "بيانات تجريبية", icon: Database, href: "/admin/seed" },
  { label: "Activity", labelAr: "السجل", icon: ClipboardList, href: "/admin/activity" },
  { label: "Settings", labelAr: "الإعدادات", icon: Settings, href: "/admin/settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, isRTL } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const activeItem = navItems.find((n) => isActive(n.href));
  const pageTitle = activeItem ? (isRTL ? activeItem.labelAr : activeItem.label) : "Dashboard";

  const sidebarW = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 bg-black/70 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 h-screen z-50 hidden lg:flex flex-col"
        style={{
          background: "linear-gradient(180deg, var(--nv-bg-secondary), var(--nv-bg-primary))",
          borderRight: isRTL ? "none" : "1px solid rgba(255,255,255,0.05)",
          borderLeft: isRTL ? "1px solid rgba(255,255,255,0.05)" : "none",
          [isRTL ? "right" : "left"]: 0,
          width: sidebarW,
        }}
        animate={{ width: sidebarW }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo with 3D glow */}
        <div className="h-[72px] flex items-center px-5 border-b border-[rgba(255,255,255,0.05)]">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F0D878 50%, #D4AF37 100%)", boxShadow: "0 0 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1)" }}>
              <Shield className="w-5 h-5 text-[#0a0a0a]" />
              {/* 3D glow ring */}
              <div className="absolute inset-0 rounded-xl" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)" }} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}>
                  <p className="text-[15px] font-bold text-white tracking-wide whitespace-nowrap">MIKA</p>
                  <p className="text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase whitespace-nowrap font-medium">Control Panel</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <p className={`text-[10px] uppercase tracking-[0.15em] font-semibold mb-3 px-3 ${collapsed ? "text-center" : ""}`} style={{ color: "var(--nv-text-dim)" }}>
            {!collapsed ? (isRTL ? "القائمة" : "Menu") : "•••"}
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg transition-all duration-200 group relative ${collapsed ? "justify-center" : ""}`}
                style={{ background: active ? "rgba(212, 175, 55, 0.06)" : "transparent" }}>
                {active && <motion.div className={`absolute top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#D4AF37]`} style={{ [isRTL ? "right" : "left"]: 0, boxShadow: "0 0 8px rgba(212,175,55,0.4)" }} layoutId="nav-ind" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? "text-[#D4AF37]" : "text-[#555] group-hover:text-[#999]"}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span className={`text-[13px] font-medium whitespace-nowrap ${active ? "text-[#D4AF37]" : "text-[#888] group-hover:text-[#ccc]"}`}
                      initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}>
                      {isRTL ? item.labelAr : item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.05)] space-y-1">
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] hover:bg-[var(--nv-bg-card-hover)] transition-all" style={{ color: "var(--nv-text-dim)" }}>
            <ChevronLeft className="w-3.5 h-3.5 transition-transform" style={{ transform: collapsed ? (isRTL ? "rotate(0deg)" : "rotate(180deg)") : (isRTL ? "rotate(180deg)" : "rotate(0deg)") }} />
            {!collapsed && <span>{isRTL ? "طي" : "Collapse"}</span>}
          </button>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${collapsed ? "justify-center" : ""}`} style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4AF3720, #F0D87820)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <span className="text-[11px] text-[#D4AF37] font-bold">{user?.name?.charAt(0).toUpperCase() || "A"}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{user?.name || "Admin"}</p>
                <p className="text-[10px] text-[#555] truncate">{user?.email || "admin@mika.com"}</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside className="fixed top-0 h-screen z-50 flex flex-col lg:hidden"
            style={{ background: "linear-gradient(180deg, var(--nv-bg-secondary), var(--nv-bg-primary))", width: 280, [isRTL ? "right" : "left"]: 0 }}
            initial={{ x: isRTL ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: isRTL ? "100%" : "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <div className="h-[72px] flex items-center justify-between px-5 border-b border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)", boxShadow: "0 0 20px rgba(212,175,55,0.2)" }}>
                  <Shield className="w-5 h-5 text-[#0a0a0a]" />
                </div>
                <div><p className="text-[15px] font-bold tracking-wide" style={{ color: "var(--nv-text-primary)" }}>MIKA</p><p className="text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase">Control Panel</p></div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 py-5 px-3 space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-lg transition-all" style={{ background: active ? "rgba(212, 175, 55, 0.08)" : "transparent" }}>
                    <item.icon className={`w-[18px] h-[18px] ${active ? "text-[#D4AF37]" : "text-[#555]"}`} />
                    <span className={`text-[13px] font-medium ${active ? "text-[#D4AF37]" : "text-[#888]"}`}>{isRTL ? item.labelAr : item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[rgba(255,255,255,0.05)]"><button onClick={logout} className="flex items-center gap-2 text-[13px] text-[#ef4444]"><LogOut className="w-4 h-4" />{isRTL ? "تسجيل الخروج" : "Logout"}</button></div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="min-h-screen transition-all duration-300" style={{ marginLeft: isRTL ? 0 : sidebarW, marginRight: isRTL ? sidebarW : 0 }}>
        {/* Top Bar */}
        <header className="h-[72px] flex items-center justify-between px-6 sticky top-0 z-30"
          style={{ background: "var(--nv-bg-body)", backdropFilter: "blur(30px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
              <Search className="w-4 h-4" />
            </button>

            {/* Language */}
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all border border-[rgba(212,175,55,0.15)]"
              title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}>
              {lang === "ar" ? "EN" : "AR"}
            </button>

            {/* Theme */}
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#555] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
              title={isDark ? (isRTL ? "الوضع الفاتح" : "Light Mode") : (isRTL ? "الوضع الداكن" : "Dark Mode")}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4AF3720, #F0D87820)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <span className="text-[11px] text-[#D4AF37] font-bold">{user?.name?.charAt(0).toUpperCase() || "A"}</span>
            </div>
          </div>
        </header>

        {/* Page Title */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 className="text-[24px] font-bold text-white" key={pageTitle} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {pageTitle}
              </motion.h1>
              <p className="text-[12px] mt-1" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "إدارة ومراقبة منصة MIKA" : "Manage and monitor your MIKA platform"}</p>
            </div>
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] text-[#888] hover:text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.2)] transition-all">
              <Home className="w-3 h-3" />{isRTL ? "الموقع" : "View Site"}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
