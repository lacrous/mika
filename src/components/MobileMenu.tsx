import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, TrendingUp, Star, Clock, Heart, LogIn, Globe } from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
 isOpen: boolean;
 onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
 const { lang, setLang, t, isRTL } = useLanguage();

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = "hidden";
 } else {
 document.body.style.overflow = "";
 }
 return () => {
 document.body.style.overflow = "";
 };
 }, [isOpen]);

 const menuItems = [
 { icon: Home, label: t("nav.home"), href: "/" },
 { icon: TrendingUp, label: t("nav.trending"), href: "/#trending" },
 { icon: Star, label: t("nav.topPicks"), href: "/#top-picks" },
 { icon: Clock, label: t("nav.continue"), href: "/#continue" },
 { icon: Heart, label: t("nav.favorites"), href: "/favorites" },
 ];

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm md:hidden"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 onClick={onClose}
 />

 {/* Menu Panel */}
 <motion.div
 className="fixed top-0 z-50 h-full w-[280px] max-w-[80vw] md:hidden"
 style={{
 right: isRTL ? "auto" : 0,
 left: isRTL ? 0 : "auto",
 background: "rgba(15, 15, 15, 0.98)",
 backdropFilter: "blur(30px)",
 borderLeft: isRTL ? "1px solid rgba(255,255,255,0.08)" : "none",
 borderRight: isRTL ? "none" : "1px solid rgba(255,255,255,0.08)",
 }}
 initial={{ x: isRTL ? "-100%" : "100%" }}
 animate={{ x: 0 }}
 exit={{ x: isRTL ? "-100%" : "100%" }}
 transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
 >
 {/* Header */}
 <div className={`flex items-center justify-between p-5`}>
 <span className="text-[#D4AF37] text-[18px] font-bold tracking-[0.15em]">
 {t("brand.name")}
 </span>
 <button
 onClick={onClose}
 className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(212,175,55,0.2)]"
 style={{
 background: "rgba(255, 255, 255, 0.08)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 }}
 >
 <X className="w-4 h-4 text-white" />
 </button>
 </div>

 {/* Divider */}
 <div className="h-px bg-[#2a2a2a] mx-5" />

 {/* Nav Links */}
 <nav className="p-5 space-y-1">
 {menuItems.map((item, i) => (
 <motion.div
 key={item.label}
 initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
 >
 <Link
 to={item.href}
 onClick={onClose}
 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium text-[#E0E0E0] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)] transition-all duration-200`}
 >
 <item.icon className="w-5 h-5" />
 {item.label}
 </Link>
 </motion.div>
 ))}
 </nav>

 {/* Divider */}
 <div className="h-px bg-[#2a2a2a] mx-5" />

 {/* Bottom Actions */}
 <div className="p-5 space-y-3">
 {/* Language Toggle */}
 <motion.button
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3, duration: 0.3 }}
 onClick={() => setLang(lang === "ar" ? "en" : "ar")}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-[#E0E0E0] transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)]`}
 style={{
 background: "rgba(255, 255, 255, 0.04)",
 border: "1px solid rgba(255, 255, 255, 0.08)",
 }}
 >
 <Globe className="w-5 h-5" />
 <span>{lang === "ar" ? "English" : "العربية"}</span>
 <span className={`${isRTL ? "me-auto" : "ms-auto"} text-[#D4AF37] font-bold text-[13px]`}>
 {lang === "ar" ? "EN" : "AR"}
 </span>
 </motion.button>

 {/* Sign In Button */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.35, duration: 0.3 }}
 >
 <Link
 to="/login"
 onClick={onClose}
 className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[#0a0a0a] font-semibold text-[15px] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]`}
 style={{
 background: "linear-gradient(135deg, #D4AF37, #F0D878)",
 }}
 >
 <LogIn className="w-4 h-4" />
 {t("nav.signIn")}
 </Link>
 </motion.div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}
