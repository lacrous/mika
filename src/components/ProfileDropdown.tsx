import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Heart, Clock, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLanguage } from "@/context/LanguageContext";
import { Shield } from "lucide-react";

export function ProfileDropdown() {
 const { user, logout } = useAuth();
 const { isAdmin } = useIsAdmin();
 const { isRTL } = useLanguage();
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setIsOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 if (!user) return null;

 const handleLogout = async () => {
 setIsOpen(false);
 await logout();
 };

 const menuItems = [
 ...(isAdmin ? [{ icon: Shield, label: isRTL ? "لوحة التحكم" : "Dashboard", href: "/admin" }] : []),
 { icon: User, label: isRTL ? "الملف الشخصي" : "Profile", href: "/profile" },
 { icon: Heart, label: isRTL ? "المفضلة" : "Favorites", href: "/favorites" },
 { icon: Clock, label: isRTL ? "سجل المشاهدة" : "Watch History", href: "/history" },
 { icon: Settings, label: isRTL ? "الإعدادات" : "Settings", href: "/settings" },
 ];

 return (
 <div ref={dropdownRef} className="relative">
 {/* Avatar Button */}
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)]"
 >
 <div
 className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
 style={{
 border: "1px solid rgba(212, 175, 55, 0.3)",
 boxShadow: "0 0 10px rgba(212, 175, 55, 0.1)",
 }}
 >
 {user.avatar ? (
 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
 ) : (
 <User className="w-4 h-4 text-[#D4AF37]" />
 )}
 </div>
 <span className="hidden lg:block text-[14px] text-[#E0E0E0] font-medium max-w-[80px] truncate">
 {user.name}
 </span>
 </button>

 {/* Dropdown Menu */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 className={`absolute top-full mt-2 z-50 w-[220px] rounded-xl overflow-hidden ${
 isRTL ? "left-0" : "right-0"
 }`}
 style={{
 background: "rgba(20, 20, 20, 0.95)",
 backdropFilter: "blur(30px)",
 border: "1px solid rgba(255, 255, 255, 0.08)",
 boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 initial={{ opacity: 0, y: -8, scale: 0.96 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -8, scale: 0.96 }}
 transition={{ duration: 0.2 }}
 >
 {/* User Info Header */}
 <div className="px-4 py-3 border-b border-[#2a2a2a]">
 <p className="text-[14px] text-white font-semibold truncate">{user.name}</p>
 {user.email && (
 <p className="text-[12px] text-[#9CA3AF] truncate mt-0.5">{user.email}</p>
 )}
 </div>

 {/* Menu Items */}
 <nav className="py-1.5">
 {menuItems.map((item) => (
 <Link
 key={item.label}
 to={item.href}
 onClick={() => setIsOpen(false)}
 className={`flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#E0E0E0] transition-all duration-150 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)] ${
 isRTL ? "flex-row-reverse text-right" : ""
 }`}
 >
 <item.icon className="w-4 h-4 flex-shrink-0" />
 {item.label}
 </Link>
 ))}
 </nav>

 {/* Divider */}
 <div className="h-px bg-[#2a2a2a] mx-3" />

 {/* Logout */}
 <button
 onClick={handleLogout}
 className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#ef4444] transition-all duration-150 hover:bg-[rgba(239,68,68,0.08)] ${
 isRTL ? "flex-row-reverse text-right" : ""
 }`}
 >
 <LogOut className="w-4 h-4 flex-shrink-0" />
 {isRTL ? "تسجيل الخروج" : "Logout"}
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
