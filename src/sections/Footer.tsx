import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
 const { t, isRTL } = useLanguage();
 const [email, setEmail] = useState("");
 const [subscribed, setSubscribed] = useState(false);

 const handleSubscribe = (e: React.FormEvent) => {
 e.preventDefault();
 if (email.trim()) {
 setSubscribed(true);
 setEmail("");
 setTimeout(() => setSubscribed(false), 3000);
 }
 };

 const quickLinks = [
 { label: t("nav.home"), href: "/" },
 { label: isRTL ? "استكشف" : "Browse", href: "/browse" },
 { label: t("nav.trending"), href: "/#trending" },
 { label: t("nav.topPicks"), href: "/#top-picks" },
 ];

 const categories = [
 { label: "Action", href: "/browse" },
 { label: "Adventure", href: "/browse" },
 { label: "Fantasy", href: "/browse" },
 { label: "Sci-Fi", href: "/browse" },
 { label: "Romance", href: "/browse" },
 { label: "Horror", href: "/browse" },
 ];

 const support = [
 { label: t("footer.about"), href: "#" },
 { label: t("footer.privacy"), href: "#" },
 { label: t("footer.terms"), href: "#" },
 { label: t("footer.contact"), href: "#" },
 ];

 return (
 <footer className="relative overflow-hidden" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
 {/* Gold top border */}
 <div className="absolute top-0 left-0 right-0 h-px" style={{
 background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.4), #F0D878, rgba(212, 175, 55, 0.4), transparent)",
 }} />

 {/* Large MIKA watermark */}
 <div
 className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none"
 style={{
 fontSize: "clamp(120px, 20vw, 300px)",
 fontWeight: 900,
 letterSpacing: "0.1em",
 lineHeight: 1,
 background: "linear-gradient(to top, rgba(212, 175, 55, 0.03), transparent)",
 WebkitBackgroundClip: "text",
 WebkitTextFillColor: "transparent",
 backgroundClip: "text",
 transform: "translateX(-50%) translateY(25%)",
 }}
 >
 MIKA
 </div>

 {/* Noise texture */}
 <div
 className="absolute inset-0 pointer-events-none"
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
 backgroundRepeat: "repeat",
 backgroundSize: "256px 256px",
 opacity: 0.02,
 mixBlendMode: "overlay",
 }}
 />

 <div
 className="relative z-10 pt-16 pb-8"
 style={{
 paddingInlineStart: "clamp(5vw, 8vw, 10vw)",
 paddingInlineEnd: "clamp(5vw, 8vw, 10vw)",
 }}
 >
 {/* Main footer grid */}
 <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 ${isRTL ? "text-end" : "text-start"}`}>
 {/* Brand + Newsletter */}
 <div className="sm:col-span-2 lg:col-span-1">
 <span className="text-[#D4AF37] text-[22px] font-bold tracking-[0.15em] block mb-3">
 {t("brand.name")}
 </span>
 <p className="text-[13px] text-[#9CA3AF] leading-relaxed mb-5 max-w-[280px]">
 {isRTL
 ? "وجهتك المثالية لعالم الأنمي. اكتشف، تابع، واستمتع بأفضل الأنميات في مكان واحد."
 : "Your ultimate destination for anime. Discover, track, and enjoy the best anime all in one place."}
 </p>

 {/* Newsletter */}
 <form onSubmit={handleSubscribe} className="relative max-w-[280px]">
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder={isRTL ? "بريدك الإلكتروني..." : "Your email..."}
 className={`w-full h-10 rounded-lg text-[13px] text-white placeholder-[#555] outline-none transition-all duration-200 focus:border-[rgba(212,175,55,0.5)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] ${isRTL ? "pr-4 pl-12" : "pl-4 pr-12"}`}
 disabled={subscribed}
 />
 <button
 type="submit"
 className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 ${subscribed ? "bg-green-500/20 text-green-400" : "bg-[rgba(212,175,55,0.1)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.2)]"}`}
 style={{
 right: isRTL ? "auto" : 4,
 left: isRTL ? 4 : "auto",
 border: "1px solid rgba(212, 175, 55, 0.15)",
 }}
 >
 {subscribed ? (
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 500, damping: 15 }}
 >
 <Heart className="w-3.5 h-3.5 fill-current" />
 </motion.div>
 ) : (
 <Send className="w-3.5 h-3.5 rtl-flip" />
 )}
 </button>
 {subscribed && (
 <motion.p
 className="text-[11px] text-green-400 mt-1.5"
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 >
 {isRTL ? "تم الاشتراك بنجاح!" : "Subscribed successfully!"}
 </motion.p>
 )}
 </form>
 </div>

 {/* Quick Links */}
 <div>
 <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">
 {isRTL ? "روابط سريعة" : "Quick Links"}
 </h3>
 <ul className="space-y-2.5">
 {quickLinks.map((link) => (
 <li key={link.label}>
 <a
 href={link.href}
 className="text-[13px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200"
 >
 {link.label}
 </a>
 </li>
 ))}
 </ul>
 </div>

 {/* Categories */}
 <div>
 <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">
 {isRTL ? "التصنيفات" : "Categories"}
 </h3>
 <ul className="space-y-2.5">
 {categories.map((cat) => (
 <li key={cat.label}>
 <a
 href={cat.href}
 className="text-[13px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200"
 >
 {cat.label}
 </a>
 </li>
 ))}
 </ul>
 </div>

 {/* Support */}
 <div>
 <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">
 {isRTL ? "الدعم" : "Support"}
 </h3>
 <ul className="space-y-2.5">
 {support.map((link) => (
 <li key={link.label}>
 <a
 href={link.href}
 className="text-[13px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200"
 >
 {link.label}
 </a>
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Bottom bar */}
 <div className={`pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
 <p className="text-[12px] text-[#666]">
 {t("footer.copyright")}
 </p>
 <div className="flex items-center gap-1 text-[12px] text-[#666]">
 <span>{isRTL ? "صُنع بـ" : "Made with"}</span>
 <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
 <span>{isRTL ? "لعشاق الأنمي" : "for anime fans"}</span>
 </div>
 </div>
 </div>
 </footer>
 );
}
