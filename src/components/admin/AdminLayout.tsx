import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Film, Users, MessageSquare, BarChart3, Settings,
  Menu, X, LogOut, ChevronLeft, Shield, Globe, Sun, Moon,
  ClipboardList, Sparkles, Import, Download, Database, Activity,
  ChevronDown, Home, Crown, Zap, TrendingUp, Eye, Heart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

/* ── Types ── */
interface NavItem {
  label: string;
  labelAr: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  href: string;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  titleAr: string;
  items: NavItem[];
}

/* ── Navigation Data ── */
const navGroups: NavGroup[] = [
  {
    title: "Overview",
    titleAr: "نظرة عامة",
    items: [
      { label: "Dashboard", labelAr: "لوحة التحكم", icon: LayoutDashboard, href: "/admin", badge: 0 },
      { label: "Activity", labelAr: "السجل", icon: Activity, href: "/admin/activity", badge: 3, badgeColor: "#ef4444" },
    ],
  },
  {
    title: "Content",
    titleAr: "المحتوى",
    items: [
      { label: "Anime", labelAr: "الأنمي", icon: Film, href: "/admin/anime", badge: 25, badgeColor: "#D4AF37" },
      { label: "Reviews", labelAr: "التقييمات", icon: MessageSquare, href: "/admin/reviews", badge: 12, badgeColor: "#22c55e" },
      { label: "Users", labelAr: "المستخدمين", icon: Users, href: "/admin/users", badge: 156, badgeColor: "#60a5fa" },
    ],
  },
  {
    title: "Analytics",
    titleAr: "التحليلات",
    items: [
      { label: "Analytics", labelAr: "التحليلات", icon: BarChart3, href: "/admin/analytics" },
      { label: "Advanced", labelAr: "متقدمة", icon: Sparkles, href: "/admin/advanced-analytics" },
    ],
  },
  {
    title: "Tools",
    titleAr: "الأدوات",
    items: [
      { label: "Bulk Import", labelAr: "استيراد", icon: Import, href: "/admin/import" },
      { label: "Export", labelAr: "تصدير", icon: Download, href: "/admin/export" },
      { label: "Seed Data", labelAr: "بيانات تجريبية", icon: Database, href: "/admin/seed" },
    ],
  },
  {
    title: "System",
    titleAr: "النظام",
    items: [
      { label: "Settings", labelAr: "الإعدادات", icon: Settings, href: "/admin/settings" },
    ],
  },
];

/* ── Tooltip for collapsed state ── */
function Tooltip({ text, children, visible }: { text: string; children: React.ReactNode; visible: boolean }) {
  return (
    <div className="relative group">
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute left-full top-1/2 z-[100] px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap pointer-events-none"
            style={{
              background: "var(--nv-bg-secondary)",
              color: "var(--nv-text-primary)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              marginLeft: 12,
            }}
            initial={{ opacity: 0, x: -4, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: -4, y: "-50%" }}
            transition={{ duration: 0.15 }}
          >
            {text}
            <div
              className="absolute top-1/2 -left-[5px] -translate-y-1/2 w-2 h-2 rotate-45"
              style={{ background: "var(--nv-bg-secondary)", borderLeft: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Nav Item ── */
function NavItemLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const { isRTL } = useLanguage();
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip text={isRTL ? item.labelAr : item.label} visible={collapsed && hovered}>
      <Link
        to={item.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${
          collapsed ? "justify-center px-2 py-2.5" : "px-3.5 py-2.5"
        } ${active ? "" : "hover:bg-[rgba(255,255,255,0.04)]"}`}
        style={{
          background: active ? "rgba(212,175,55,0.06)" : "transparent",
          border: active ? "1px solid rgba(212,175,55,0.1)" : "1px solid transparent",
        }}
      >
        {/* Active glow line */}
        {active && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
            style={{
              [isRTL ? "right" : "left"]: -1,
              background: "linear-gradient(180deg, #D4AF37, #F0D878)",
              boxShadow: "0 0 10px rgba(212,175,55,0.5), 0 0 20px rgba(212,175,55,0.2)",
            }}
            layoutId="nav-glow"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Icon */}
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: active ? "rgba(212,175,55,0.1)" : "transparent",
            border: active ? "1px solid rgba(212,175,55,0.15)" : "1px solid transparent",
            transition: "all 0.2s ease",
          }}
        >
          <item.icon
            className="w-[17px] h-[17px] transition-colors duration-200"
            style={{ color: active ? "#D4AF37" : "#555" }}
          />
          {active && (
            <div
              className="absolute inset-0 rounded-[10px]"
              style={{ boxShadow: "0 0 12px rgba(212,175,55,0.15)" }}
            />
          )}
        </div>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="text-[13px] font-medium flex-1 min-w-0"
              style={{ color: active ? "#D4AF37" : "#888" }}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isRTL ? item.labelAr : item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {!collapsed && item.badge !== undefined && item.badge > 0 && (
          <motion.span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{
              background: item.badgeColor ? `${item.badgeColor}15` : "rgba(255,255,255,0.04)",
              color: item.badgeColor || "#888",
              border: `1px solid ${item.badgeColor ? `${item.badgeColor}20` : "rgba(255,255,255,0.06)"}`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            {item.badge}
          </motion.span>
        )}
      </Link>
    </Tooltip>
  );
}

/* ── Nav Group ── */
function NavGroupSection({ group, isActive, collapsed }: { group: NavGroup; isActive: (h: string) => boolean; collapsed: boolean }) {
  const { isRTL } = useLanguage();
  const [expanded, setExpanded] = useState(true);
  const hasActive = group.items.some((i) => isActive(i.href));

  return (
    <div className="mb-1">
      {/* Section Header */}
      <AnimatePresence>
        {!collapsed && (
          <motion.button
            className="flex items-center gap-1.5 px-3.5 mb-1 mt-3 w-full group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(!expanded)}
          >
            <span
              className="text-[10px] uppercase tracking-[0.18em] font-bold flex-1 text-left"
              style={{ color: hasActive ? "#D4AF37" : "var(--nv-text-dim)" }}
            >
              {isRTL ? group.titleAr : group.title}
            </span>
            <motion.div animate={{ rotate: expanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
              <ChevronDown
                className="w-3 h-3"
                style={{ color: "var(--nv-text-dim)" }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Items */}
      <AnimatePresence initial={false}>
        {(expanded || collapsed) &&
          group.items.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
      </AnimatePresence>

      {/* Divider between groups (when collapsed) */}
      {collapsed && (
        <div className="my-2 mx-auto w-6" style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
      )}
    </div>
  );
}

/* ── Main Layout ── */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, isRTL } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const activeItem = navGroups.flatMap((g) => g.items).find((n) => isActive(n.href));
  const pageTitle = activeItem ? (isRTL ? activeItem.labelAr : activeItem.label) : "Dashboard";

  const sidebarW = collapsed ? 76 : 270;

  return (
    <div className="min-h-screen" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════ DESKTOP SIDEBAR ═══════ */}
      <motion.aside
        className="fixed top-0 h-screen z-50 hidden lg:flex flex-col"
        style={{
          background: "linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 50%, #0c0c0c 100%)",
          borderRight: isRTL ? "none" : "1px solid rgba(255,255,255,0.04)",
          borderLeft: isRTL ? "1px solid rgba(255,255,255,0.04)" : "none",
          [isRTL ? "right" : "left"]: 0,
          width: sidebarW,
          boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
        }}
        animate={{ width: sidebarW }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Logo ── */}
        <div className="h-[68px] flex items-center px-4 border-b border-[rgba(255,255,255,0.04)] flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            {/* Animated gold logo */}
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 relative"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F0D878 50%, #C9A227 100%)",
                boxShadow: "0 0 16px rgba(212,175,55,0.25), 0 0 32px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <Shield className="w-[18px] h-[18px] text-[#0a0a0a]" strokeWidth={2.5} />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[14px] font-bold text-white tracking-[0.08em] whitespace-nowrap">
                    MIKA
                  </p>
                  <p
                    className="text-[9px] tracking-[0.25em] uppercase whitespace-nowrap font-medium"
                    style={{ color: "#D4AF37" }}
                  >
                    Control Panel
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse toggle (inline with logo) */}
            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCollapsed(true)}
                  className="ml-auto w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/5 transition-all"
                  style={{ color: "var(--nv-text-dim)" }}
                >
                  <ChevronLeft
                    className="w-3.5 h-3.5"
                    style={{ transform: isRTL ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </motion.button>
              )}
            </AnimatePresence>
          </Link>

          {/* Expand toggle (when collapsed) */}
          {collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setCollapsed(false)}
              className="absolute -right-3 top-[26px] w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-10"
              style={{
                background: "var(--nv-bg-secondary)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                color: "#D4AF37",
              }}
            >
              <ChevronLeft
                className="w-3 h-3"
                style={{ transform: isRTL ? "rotate(0deg)" : "rotate(180deg)" }}
              />
            </motion.button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <NavGroupSection
              key={group.title}
              group={group}
              isActive={isActive}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* ── Bottom: User Profile ── */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.04)] flex-shrink-0">
          {/* Quick actions */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="flex items-center gap-1.5 mb-2 px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex-1 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all hover:bg-white/5"
                  style={{
                    color: "#D4AF37",
                    border: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  {lang === "ar" ? "EN" : "AR"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                  style={{
                    color: "var(--nv-text-dim)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User card */}
          <div
            className={`flex items-center gap-2.5 rounded-xl p-2.5 transition-all ${collapsed ? "justify-center" : ""}`}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* Avatar with online status */}
            <div className="relative flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #D4AF3725, #F0D87825)",
                  border: "1.5px solid rgba(212,175,55,0.2)",
                }}
              >
                <span className="text-[11px] font-bold" style={{ color: "#D4AF37" }}>
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              {/* Online dot */}
              <div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  background: "#22c55e",
                  borderColor: "#0a0a0a",
                }}
              />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className="min-w-0 flex-1"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1.5">
                    <p
                      className="text-[12px] font-semibold truncate"
                      style={{ color: "var(--nv-text-primary)" }}
                    >
                      {user?.name || "Admin"}
                    </p>
                    <Crown className="w-3 h-3 flex-shrink-0" style={{ color: "#D4AF37" }} />
                  </div>
                  <p className="text-[10px] truncate" style={{ color: "var(--nv-text-dim)" }}>
                    {user?.email || "admin@mika.com"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={logout}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all flex-shrink-0 group/logout"
                  title={isRTL ? "تسجيل الخروج" : "Logout"}
                >
                  <LogOut className="w-3.5 h-3.5 text-[#555] group-hover/logout:text-red-400 transition-colors" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Back to site (collapsed) */}
          {collapsed && (
            <Link
              to="/"
              className="mt-2 w-full h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all"
              style={{ color: "var(--nv-text-dim)" }}
              title={isRTL ? "الموقع" : "View Site"}
            >
              <Home className="w-4 h-4" />
            </Link>
          )}
        </div>
      </motion.aside>

      {/* ═══════ MOBILE SIDEBAR ═══════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed top-0 h-screen z-50 flex flex-col lg:hidden"
            style={{
              background: "linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 50%, #0c0c0c 100%)",
              width: 290,
              [isRTL ? "right" : "left"]: 0,
              boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
            }}
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Mobile header */}
            <div className="h-[68px] flex items-center justify-between px-5 border-b border-[rgba(255,255,255,0.04)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #F0D878)",
                    boxShadow: "0 0 16px rgba(212,175,55,0.25)",
                  }}
                >
                  <Shield className="w-[18px] h-[18px] text-[#0a0a0a]" strokeWidth={2.5} />
                </div>
                <div>
                  <p
                    className="text-[14px] font-bold tracking-[0.08em]"
                    style={{ color: "var(--nv-text-primary)" }}
                  >
                    MIKA
                  </p>
                  <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "#D4AF37" }}>
                    Control Panel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile nav */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
              {navGroups.map((group) => (
                <div key={group.title} className="mb-3">
                  <p
                    className="text-[10px] uppercase tracking-[0.18em] font-bold px-3.5 mb-2 mt-2"
                    style={{ color: "var(--nv-text-dim)" }}
                  >
                    {isRTL ? group.titleAr : group.title}
                  </p>
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all mb-0.5"
                        style={{
                          background: active ? "rgba(212,175,55,0.06)" : "transparent",
                          border: active ? "1px solid rgba(212,175,55,0.1)" : "1px solid transparent",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: active ? "rgba(212,175,55,0.08)" : "transparent",
                            border: active ? "1px solid rgba(212,175,55,0.12)" : "1px solid transparent",
                          }}
                        >
                          <item.icon
                            className="w-[17px] h-[17px]"
                            style={{ color: active ? "#D4AF37" : "#555" }}
                          />
                        </div>
                        <span
                          className="text-[13px] font-medium flex-1"
                          style={{ color: active ? "#D4AF37" : "#888" }}
                        >
                          {isRTL ? item.labelAr : item.label}
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: item.badgeColor ? `${item.badgeColor}15` : "rgba(255,255,255,0.04)",
                              color: item.badgeColor || "#888",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Mobile bottom */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.04)] flex-shrink-0 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #D4AF3725, #F0D87825)",
                      border: "1.5px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    <span className="text-[12px] font-bold" style={{ color: "#D4AF37" }}>
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: "#22c55e", borderColor: "#0a0a0a" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-semibold truncate" style={{ color: "var(--nv-text-primary)" }}>
                      {user?.name || "Admin"}
                    </p>
                    <Crown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D4AF37" }} />
                  </div>
                  <p className="text-[11px] truncate" style={{ color: "var(--nv-text-dim)" }}>
                    {user?.email || "admin@mika.com"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex-1 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all hover:bg-white/5"
                  style={{ color: "#D4AF37", border: "1px solid rgba(212,175,55,0.12)" }}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {lang === "ar" ? "English" : "العربية"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex-1 h-8 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all hover:bg-white/5"
                  style={{ color: "var(--nv-text-dim)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {isDark ? (isRTL ? "فاتح" : "Light") : isRTL ? "داكن" : "Dark"}
                </button>
              </div>
              <button
                onClick={logout}
                className="w-full h-8 rounded-lg text-[12px] font-medium flex items-center justify-center gap-2 transition-all hover:bg-red-500/10 text-red-400/70 hover:text-red-400"
                style={{ border: "1px solid rgba(239,68,68,0.08)" }}
              >
                <LogOut className="w-3.5 h-3.5" />
                {isRTL ? "تسجيل الخروج" : "Logout"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════ MAIN CONTENT AREA ═══════ */}
      <main
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: isRTL ? 0 : sidebarW,
          marginRight: isRTL ? sidebarW : 0,
        }}
      >
        {/* Top Bar */}
        <header
          className="h-[68px] flex items-center justify-between px-6 sticky top-0 z-30"
          style={{
            background: "rgba(10,10,10,0.8)",
            backdropFilter: "blur(30px) saturate(1.2)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="text-[12px] font-medium transition-colors hover:text-[#D4AF37]"
                style={{ color: "var(--nv-text-dim)" }}
              >
                {isRTL ? "لوحة" : "Admin"}
              </Link>
              <span style={{ color: "var(--nv-text-dim)" }}>/</span>
              <motion.span
                className="text-[13px] font-semibold"
                style={{ color: "var(--nv-text-primary)" }}
                key={pageTitle}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {pageTitle}
              </motion.span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Site */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all hover:bg-white/5"
              style={{ color: "var(--nv-text-dim)" }}
            >
              <Home className="w-3.5 h-3.5" />
              {isRTL ? "الموقع" : "View Site"}
            </Link>

            {/* User badge */}
            <div className="flex items-center gap-2 pl-3 ml-2 border-l border-[rgba(255,255,255,0.06)]">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #D4AF3720, #F0D87820)",
                  border: "1px solid rgba(212,175,55,0.12)",
                }}
              >
                <span className="text-[10px] font-bold" style={{ color: "#D4AF37" }}>
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
