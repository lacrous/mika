import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Globe, Menu, X, Search, Moon, Sun, Compass } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useScroll } from "@/hooks/useScroll";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDropdown } from "./ProfileDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { NavigationMenu } from "./NavigationMenu";
import { trendingAnime, topPicksAnime } from "@/data/anime";
import { seasonAnimeData } from "@/data/seasonAnime";
import type { Anime } from "@/types";

/* ── combine all anime into a searchable pool ── */
const allAnime: Anime[] = [
 ...trendingAnime,
 ...topPicksAnime,
 ...seasonAnimeData.map((s) => ({
 id: s.id,
 title: s.title,
 year: s.year,
 rating: s.rating,
 genres: s.genres,
 image: s.image,
 synopsis: `${s.title} \u2014 ${s.season}`,
 episodes: s.episodes,
 status: s.status,
 studio: "Various",
 })),
];

const uniqueAnime = Array.from(
 new Map(allAnime.map((a) => [a.id, a])).values()
);

export function Navbar() {
 const { isScrolled } = useScroll(50);
 const location = useLocation();
 const isHome = location.pathname === "/";
 const { lang, setLang, t, isRTL } = useLanguage();
 const { isAuthenticated } = useAuth();
 const { isDark, toggleTheme } = useTheme();
 const [navMenuOpen, setNavMenuOpen] = useState(false);

 /* ── live search state ── */
 const [searchOpen, setSearchOpen] = useState(false);
 const [searchRaw, setSearchRaw] = useState("");
 const debouncedQuery = useDebounce(searchRaw, 300);

 const navLinks = [
 { label: t("nav.home"), href: "/", active: true },
 { label: isRTL ? "استكشف" : "Browse", href: "/browse", active: false },
 { label: t("nav.trending"), href: "/#trending", active: false },
 { label: t("nav.topPicks"), href: "/#top-picks", active: false },
 { label: t("nav.continue"), href: "/#continue", active: false },
 ];

 /* filtered results */
 const results =
 debouncedQuery.trim().length > 0
 ? uniqueAnime
 .filter(
 (a) =>
 a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
 a.genres.some((g) =>
 g.toLowerCase().includes(debouncedQuery.toLowerCase())
 )
 )
 .slice(0, 6)
 : [];

 const hasResults = results.length > 0;
 const isSearching = searchRaw.length > 0 && !hasResults;

 return (
 <>
 <motion.nav
 className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between"
 style={{
 paddingLeft: "clamp(5vw, 8vw, 10vw)",
 paddingRight: "clamp(5vw, 8vw, 10vw)",
 }}
 animate={{
 backgroundColor: isScrolled
 ? "rgba(20, 20, 20, 0.6)"
 : "transparent",
 backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
 borderBottomColor: isScrolled
 ? "rgba(255, 255, 255, 0.06)"
 : "transparent",
 }}
 transition={{ duration: 0.3, ease: "easeInOut" }}
 initial={false}
 >
 <div
 className="absolute bottom-0 left-0 right-0 h-px"
 style={{
 background: isScrolled
 ? "rgba(255, 255, 255, 0.06)"
 : "transparent",
 transition: "background 0.3s ease",
 }}
 />

 <Link
 to="/"
 className="relative text-[#D4AF37] text-[20px] font-bold tracking-[0.15em] select-none flex-shrink-0 group"
 >
 <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">
 {t("brand.name")}
 </span>
 <span className="absolute inset-0 blur-lg bg-[#D4AF37] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
 </Link>

 {/* Desktop: Nav Links */}
 <div className="hidden lg:flex items-center gap-6">
 {navLinks.map((link) => {
 const isActive = link.href === "/"
 ? location.pathname === "/"
 : location.pathname === link.href || (link.href.startsWith("/#") && isHome);
 return (
 <a
 key={link.label}
 href={link.href}
 className={`relative text-[14px] font-medium tracking-[0.02em] transition-all duration-200 ${
 isActive
 ? "text-[#D4AF37]"
 : "text-[#E0E0E0] hover:text-[#D4AF37]"
 }`}
 >
 {link.label}
 {isActive && (
 <motion.div
 className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
 style={{
 background: "linear-gradient(90deg, transparent, #D4AF37, #F0D878, transparent)",
 boxShadow: "0 0 8px rgba(212, 175, 55, 0.4), 0 0 16px rgba(212, 175, 55, 0.2)",
 }}
 layoutId="navbar-indicator"
 transition={{ type: "spring", stiffness: 380, damping: 30 }}
 />
 )}
 </a>
 );
 })}
 </div>

 {/* Right Side */}
 <div className="flex items-center gap-3">
 {/* Live Search */}
 {isHome && (
 <div className="relative hidden md:flex items-center">
 <AnimatePresence>
 {searchOpen && (
 <motion.div
 className="relative"
 initial={{ width: 0, opacity: 0 }}
 animate={{ width: 260, opacity: 1 }}
 exit={{ width: 0, opacity: 0 }}
 transition={{
 duration: 0.3,
 ease: [0.22, 1, 0.36, 1],
 }}
 >
 <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] z-10`} />
 <input
 type="text"
 value={searchRaw}
 onChange={(e) => setSearchRaw(e.target.value)}
 placeholder={t("search.placeholder")}
 className={`w-full h-9 ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"} rounded-lg text-[14px] placeholder-[#666] outline-none transition-all duration-200 focus:border-[rgba(212,175,55,0.5)] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)]`}
 style={{
 boxShadow:
 "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 autoFocus
 />
 {/* Search Results Dropdown */}
 <AnimatePresence>
 {(hasResults || isSearching) && (
 <motion.div
 className="absolute top-full mt-2 w-full rounded-xl overflow-hidden z-50"
 style={{
 background: "var(--nv-bg-secondary)",
 backdropFilter: "blur(30px)",
 border: "1px solid rgba(255, 255, 255, 0.08)",
 boxShadow:
 "0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 initial={{ opacity: 0, y: -8, scale: 0.96 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -8, scale: 0.96 }}
 transition={{ duration: 0.2 }}
 >
 {hasResults ? (
 <div className="py-2 max-h-[320px] overflow-y-auto custom-scrollbar">
 {results.map((anime) => (
 <Link
 key={anime.id}
 to={isHome ? `/#top-picks` : "/"}
 onClick={() => {
 setSearchOpen(false);
 setSearchRaw("");
 }}
 className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-[rgba(212,175,55,0.1)] ${
 isRTL ? "flex-row-reverse text-right" : ""
 }`}
 >
 <img
 src={anime.image}
 alt={anime.title}
 className="w-9 h-[54px] object-cover rounded flex-shrink-0"
 loading="lazy"
 />
 <div className="min-w-0 flex-1">
 <p className="text-[13px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>
 {anime.title}
 </p>
 <p className="text-[11px] text-[#9CA3AF] mt-0.5">
 {anime.year} &middot; {anime.rating}{" "}
 <span className="text-[#D4AF37]">
 ★
 </span>
 </p>
 </div>
 </Link>
 ))}
 </div>
 ) : (
 <div className="px-4 py-6 text-center">
 <p className="text-[13px] text-[#9CA3AF]">
 {t("search.noResults")}
 </p>
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 )}
 </AnimatePresence>

 <button
 onClick={() => {
 setSearchOpen((prev) => !prev);
 if (searchOpen) setSearchRaw("");
 }}
 className="flex items-center justify-center w-9 h-9 rounded-lg text-[#E0E0E0] transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] flex-shrink-0"
 style={{
 background: searchOpen
 ? "rgba(212, 175, 55, 0.15)"
 : "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: searchOpen
 ? "1px solid rgba(212, 175, 55, 0.3)"
 : "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow:
 "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 aria-label="Toggle search"
 >
 <AnimatePresence mode="wait">
 {searchOpen ? (
 <motion.div
 key="close-search"
 initial={{ rotate: -90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: 90, opacity: 0 }}
 transition={{ duration: 0.15 }}
 >
 <X className="w-4 h-4" />
 </motion.div>
 ) : (
 <motion.div
 key="open-search"
 initial={{ rotate: 90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: -90, opacity: 0 }}
 transition={{ duration: 0.15 }}
 >
 <Search className="w-4 h-4" />
 </motion.div>
 )}
 </AnimatePresence>
 </button>
 </div>
 )}

 {/* Language Toggle */}
 <button
 onClick={() => setLang(lang === "ar" ? "en" : "ar")}
 className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#E0E0E0] transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] flex-shrink-0"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 title={
 lang === "ar" ? "Switch to English" : "التبديل إلى العربية"
 }
 >
 <Globe className="w-3.5 h-3.5" />
 <span className="text-[#D4AF37] font-semibold">
 {lang === "ar" ? "EN" : "AR"}
 </span>
 </button>

 {/* Theme Toggle */}
 <button
 onClick={toggleTheme}
 className="flex items-center justify-center w-9 h-9 rounded-lg text-[#E0E0E0] transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] flex-shrink-0"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 title={isDark ? (lang === "ar" ? "الوضع الفاتح" : "Light Mode") : (lang === "ar" ? "الوضع الداكن" : "Dark Mode")}
 >
 {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
 </button>

 {/* Auth: Show user avatar dropdown or Sign In */}
 {isAuthenticated ? (
 <ProfileDropdown />
 ) : (
 <Link
 to="/login"
 className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium text-[#E0E0E0] transition-all duration-300 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] flex-shrink-0"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow:
 "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <LogIn className="w-4 h-4" />
 <span>{t("nav.signIn")}</span>
 </Link>
 )}

 {/* Navigation Menu Toggle */}
 <button
 onClick={() => setNavMenuOpen(true)}
 className="flex items-center justify-center w-9 h-9 rounded-lg text-[#E0E0E0] transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] flex-shrink-0"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 aria-label="Open menu"
 title="Menu"
 >
 <Compass className="w-4 h-4" />
 </button>
 </div>
 </motion.nav>

 <NavigationMenu
 isOpen={navMenuOpen}
 onClose={() => setNavMenuOpen(false)}
 />
 </>
 );
}
