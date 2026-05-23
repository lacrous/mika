import React, { useState } from "react";
import { motion } from "framer-motion";
import {
 Settings,
 Globe,
 Bell,
 Moon,
 Shield,
 User,
 ChevronRight,
 Monitor,
 Volume2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

interface ToggleProps {
 enabled: boolean;
 onChange: () => void;
}

interface SettingsItem {
 icon: React.ComponentType<{ className?: string }>;
 label: string;
 value?: string;
 editable?: boolean;
 note?: string;
 description?: string;
 component?: React.ReactNode;
}

interface SettingsSection {
 title: string;
 items: SettingsItem[];
}

function Toggle({ enabled, onChange }: ToggleProps) {
 const { isRTL } = useLanguage();
 return (
 <button
 onClick={onChange}
 className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
 style={{
 background: enabled
 ? "linear-gradient(135deg, #D4AF37, #F0D878)"
 : "rgba(255, 255, 255, 0.1)",
 }}
 >
 <div
 className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
 style={{
 transform: enabled
 ? (isRTL ? "translateX(-22px)" : "translateX(22px)")
 : (isRTL ? "translateX(-2px)" : "translateX(2px)"),
 }}
 />
 </button>
 );
}

export function SettingsPage() {
 const { lang, setLang, isRTL } = useLanguage();
 const { user } = useAuth();

 const [notifications, setNotifications] = useState(true);
 const [autoPlay, setAutoPlay] = useState(true);
 const [skipIntro, setSkipIntro] = useState(false);
 const [hdQuality, setHdQuality] = useState(true);
 const [darkMode, setDarkMode] = useState(true);
 const [subtitles, setSubtitles] = useState(true);

 const sections: SettingsSection[] = [
 {
 title: isRTL ? "الحساب" : "Account",
 items: [
 {
 icon: User,
 label: isRTL ? "اسم المستخدم" : "Username",
 value: user?.name || (isRTL ? "مستخدم" : "User"),
 editable: false,
 },
 {
 icon: Shield,
 label: isRTL ? "البريد الإلكتروني" : "Email",
 value: user?.email || (isRTL ? "غير متوفر" : "Not available"),
 editable: false,
 },
 ],
 },
 {
 title: isRTL ? "اللغة والمنطقة" : "Language & Region",
 items: [
 {
 icon: Globe,
 label: isRTL ? "اللغة" : "Language",
 component: (
 <div className={`flex gap-2`}>
 {[
 { code: "ar" as const, label: "العربية" },
 { code: "en" as const, label: "English" },
 ].map((l) => (
 <button
 key={l.code}
 onClick={() => setLang(l.code)}
 className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200"
 style={{
 background:
 lang === l.code
 ? "rgba(212, 175, 55, 0.15)"
 : "rgba(255, 255, 255, 0.04)",
 color: lang === l.code ? "#D4AF37" : "#E0E0E0",
 border:
 lang === l.code
 ? "1px solid rgba(212, 175, 55, 0.3)"
 : "1px solid rgba(255, 255, 255, 0.08)",
 }}
 >
 {l.label}
 </button>
 ))}
 </div>
 ),
 },
 {
 icon: Monitor,
 label: isRTL ? "اتجاه الواجهة" : "Interface Direction",
 value: isRTL ? "من اليمين لليسار" : "Right to Left",
 note: lang === "ar" ? "RTL" : "LTR",
 },
 ],
 },
 {
 title: isRTL ? "المشاهدة" : "Playback",
 items: [
 {
 icon: Monitor,
 label: isRTL ? "التشغيل التلقائي" : "Auto Play Next",
 description: isRTL
 ? "تشغيل الحلقة التالية تلقائياً"
 : "Automatically play next episode",
 component: <Toggle enabled={autoPlay} onChange={() => setAutoPlay(!autoPlay)} />,
 },
 {
 icon: Moon,
 label: isRTL ? "تخطي المقدمة" : "Skip Intro",
 description: isRTL
 ? "تخطي شارة البداية تلقائياً"
 : "Automatically skip opening theme",
 component: <Toggle enabled={skipIntro} onChange={() => setSkipIntro(!skipIntro)} />,
 },
 {
 icon: Volume2,
 label: isRTL ? "الترجمة" : "Subtitles",
 description: isRTL
 ? "إظهار الترجمة افتراضياً"
 : "Show subtitles by default",
 component: <Toggle enabled={subtitles} onChange={() => setSubtitles(!subtitles)} />,
 },
 {
 icon: Monitor,
 label: isRTL ? "جودة عالية" : "HD Quality",
 description: isRTL
 ? "تشغيل بأعلى جودة متاحة"
 : "Play at highest available quality",
 component: <Toggle enabled={hdQuality} onChange={() => setHdQuality(!hdQuality)} />,
 },
 ],
 },
 {
 title: isRTL ? "الإشعارات" : "Notifications",
 items: [
 {
 icon: Bell,
 label: isRTL ? "الإشعارات" : "Push Notifications",
 description: isRTL
 ? "استلام إشعارات عن حلقات جديدة"
 : "Get notified about new episodes",
 component: (
 <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />
 ),
 },
 ],
 },
 {
 title: isRTL ? "المظهر" : "Appearance",
 items: [
 {
 icon: Moon,
 label: isRTL ? "الوضع المظلم" : "Dark Mode",
 description: isRTL ? "تفعيل المظهر الداكن" : "Enable dark theme",
 component: <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />,
 },
 ],
 },
 ];

 return (
 <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--nv-bg-body)" }}>
 <div
 style={{
 maxWidth: 800,
 marginInline: "auto",
 paddingInline: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 {/* Header */}
 <motion.div
 className={`flex items-center gap-3 mb-8`}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 <Settings className="w-7 h-7 text-[#D4AF37]" />
 <h1 className="text-[28px] font-bold text-white">
 {isRTL ? "الإعدادات" : "Settings"}
 </h1>
 </motion.div>

 {/* Settings Sections */}
 <div className="space-y-8">
 {sections.map((section, sectionIdx) => (
 <motion.div
 key={section.title}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.05 * sectionIdx, duration: 0.4 }}
 >
 <h2 className="text-[13px] text-[#9CA3AF] uppercase tracking-wider mb-3 px-1">
 {section.title}
 </h2>
 <div
 className="rounded-xl overflow-hidden"
 style={{
 background: "rgba(255, 255, 255, 0.03)",
 border: "1px solid rgba(255, 255, 255, 0.06)",
 }}
 >
 {section.items.map((item, itemIdx) => (
 <div
 key={item.label}
 className={`flex items-center gap-4 p-4 transition-all duration-200 hover:bg-[rgba(255,255,255,0.03)] ${itemIdx < section.items.length - 1 ? "border-b border-[rgba(255,255,255,0.05)]" : ""}`}
 >
 <div
 className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
 style={{
 background: "rgba(212, 175, 55, 0.08)",
 border: "1px solid rgba(212, 175, 55, 0.12)",
 }}
 >
 <item.icon className="w-4 h-4 text-[#D4AF37]" />
 </div>

 <div className={`flex-1 min-w-0 ${isRTL ? "text-end" : ""}`}>
 <p className="text-[14px] text-white font-medium">{item.label}</p>
 {item.description && (
 <p className="text-[12px] text-[#9CA3AF] mt-0.5">{item.description}</p>
 )}
 {item.value && !item.component && (
 <p className="text-[12px] text-[#9CA3AF] mt-0.5">{item.value}</p>
 )}
 </div>

 {/* Right side */}
 <div className="flex-shrink-0">
 {item.component ? (
 item.component
 ) : item.editable === false ? (
 <span className="text-[12px] text-[#666]">
 {item.note || (isRTL ? "غير قابل للتعديل" : "Read only")}
 </span>
 ) : (
 <ChevronRight
 className="w-4 h-4 text-[#666] rtl-flip"
 />
 )}
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 ))}
 </div>

 {/* Version Info */}
 <motion.div
 className="mt-12 text-center"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.5 }}
 >
 <p className="text-[11px] text-[#555]">
 Mika Anime v1.0.0 &middot; {isRTL ? "© 2025 جميع الحقوق محفوظة" : "© 2025 All rights reserved"}
 </p>
 </motion.div>
 </div>
 </div>
 );
}
