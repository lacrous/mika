import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
 LogIn,
 UserPlus,
 Mail,
 Lock,
 User,
 Eye,
 EyeOff,
 ArrowLeft,
 ArrowRight,
 Sparkles,
 AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";

function getOAuthUrl(): string | null {
 const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
 const appID = import.meta.env.VITE_APP_ID;

 // If OAuth is not configured, return null
 if (!kimiAuthUrl || !appID) {
 return null;
 }

 try {
 const redirectUri = `${window.location.origin}/api/oauth/callback`;
 const state = btoa(redirectUri);

 const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
 url.searchParams.set("client_id", appID);
 url.searchParams.set("redirect_uri", redirectUri);
 url.searchParams.set("response_type", "code");
 url.searchParams.set("scope", "profile");
 url.searchParams.set("state", state);

 return url.toString();
 } catch {
 return null;
 }
}

export function AuthPage() {
 const { t, isRTL } = useLanguage();
 const [mode, setMode] = useState<"login" | "signup">("login");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [error, setError] = useState("");
 const [formData, setFormData] = useState({
 email: "",
 password: "",
 confirmPassword: "",
 name: "",
 });

 // tRPC mutations
 const signupMutation = trpc.localAuth.signup.useMutation({
 onSuccess: (data) => {
 localStorage.setItem("local_auth_token", data.token);
 // Force navigate to homepage with HashRouter
 window.location.href = "/#/";
 },
 onError: (err) => {
 setError(err.message);
 },
 });

 const loginMutation = trpc.localAuth.login.useMutation({
 onSuccess: (data) => {
 localStorage.setItem("local_auth_token", data.token);
 // Force navigate to homepage with HashRouter
 window.location.href = "/#/";
 },
 onError: (err) => {
 setError(err.message);
 },
 });

 const isSubmitting = signupMutation.isPending || loginMutation.isPending;

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 setError("");
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 setError("");

 if (mode === "signup") {
 if (formData.password !== formData.confirmPassword) {
 setError(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
 return;
 }
 if (formData.password.length < 6) {
 setError(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
 return;
 }
 if (formData.name.length < 2) {
 setError(isRTL ? "الاسم يجب أن يكون حرفين على الأقل" : "Name must be at least 2 characters");
 return;
 }

 signupMutation.mutate({
 email: formData.email,
 password: formData.password,
 name: formData.name,
 });
 } else {
 loginMutation.mutate({
 email: formData.email,
 password: formData.password,
 });
 }
 };

 const switchMode = () => {
 setMode(mode === "login" ? "signup" : "login");
 setError("");
 setFormData({ email: "", password: "", confirmPassword: "", name: "" });
 };

 const BackIcon = isRTL ? ArrowRight : ArrowLeft;

 return (
 <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--nv-bg-body)" }}>
 {/* Background */}
 <div
 className="absolute inset-0 pointer-events-none"
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
 backgroundRepeat: "repeat",
 backgroundSize: "256px 256px",
 opacity: 0.04,
 mixBlendMode: "overlay",
 }}
 />
 <div
 className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
 style={{
 background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
 filter: "blur(60px)",
 }}
 />

 {/* Back to Home */}
 <Link
 to="/"
 className={`absolute top-6 z-10 flex items-center gap-2 text-[14px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200 ${isRTL ? "right-6" : "left-6"}`}
 >
 <BackIcon className="w-4 h-4" />
 {t("lang.backToHome")}
 </Link>

 {/* Auth Card */}
 <motion.div
 className="relative z-10 w-full max-w-[420px] mx-4"
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 >
 <div
 className="rounded-2xl p-8"
 style={{
 background: "rgba(20, 20, 20, 0.7)",
 backdropFilter: "blur(30px)",
 border: "1px solid rgba(255, 255, 255, 0.08)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 20px 60px rgba(0, 0, 0, 0.5)",
 }}
 >
 {/* Header */}
 <div className="text-center mb-8">
 <Link
 to="/"
 className="text-[#D4AF37] text-[24px] font-bold tracking-[0.15em] inline-block mb-4"
 >
 {t("brand.name")}
 </Link>
 <h1 className="text-[22px] font-bold text-white">
 {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
 </h1>
 <p className="text-[14px] text-[#9CA3AF] mt-1">
 {mode === "login" ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
 </p>
 </div>

 {/* Error Message */}
 <AnimatePresence>
 {error && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg text-[13px] text-red-300 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]"
 >
 <AlertCircle className="w-4 h-4 flex-shrink-0" />
 {error}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Form */}
 <form onSubmit={handleSubmit} className="space-y-4">
 <AnimatePresence mode="wait">
 {mode === "signup" && (
 <motion.div
 key="username"
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <label className="block text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">
 {t("auth.username")}
 </label>
 <div className="relative">
 <User
 className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] ${isRTL ? "right-3.5" : "left-3.5"}`}
 />
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 placeholder={t("auth.username")}
 className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg py-3 ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} text-[14px] text-white placeholder-[#666] focus:outline-none focus:border-[rgba(212,175,55,0.5)] focus:bg-[rgba(212,175,55,0.05)] transition-all duration-200`}
 required
 />
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Email */}
 <div>
 <label className="block text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">
 {t("auth.email")}
 </label>
 <div className="relative">
 <Mail
 className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] ${isRTL ? "right-3.5" : "left-3.5"}`}
 />
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleInputChange}
 placeholder="your@email.com"
 className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg py-3 ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} text-[14px] text-white placeholder-[#666] focus:outline-none focus:border-[rgba(212,175,55,0.5)] focus:bg-[rgba(212,175,55,0.05)] transition-all duration-200`}
 required
 />
 </div>
 </div>

 {/* Password */}
 <div>
 <label className="block text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">
 {t("auth.password")}
 </label>
 <div className="relative">
 <Lock
 className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] ${isRTL ? "right-3.5" : "left-3.5"}`}
 />
 <input
 type={showPassword ? "text" : "password"}
 name="password"
 value={formData.password}
 onChange={handleInputChange}
 placeholder="********"
 className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg py-3 ${isRTL ? "pr-11 pl-4" : "pl-11 pr-11"} text-[14px] text-white placeholder-[#666] focus:outline-none focus:border-[rgba(212,175,55,0.5)] focus:bg-[rgba(212,175,55,0.05)] transition-all duration-200`}
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className={`absolute top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#D4AF37] transition-colors ${isRTL ? "left-3.5" : "right-3.5"}`}
 >
 {showPassword ? (
 <EyeOff className="w-4 h-4" />
 ) : (
 <Eye className="w-4 h-4" />
 )}
 </button>
 </div>
 </div>

 <AnimatePresence mode="wait">
 {mode === "signup" && (
 <motion.div
 key="confirm"
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <label className="block text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">
 {t("auth.confirmPassword")}
 </label>
 <div className="relative">
 <Lock
 className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] ${isRTL ? "right-3.5" : "left-3.5"}`}
 />
 <input
 type={showConfirmPassword ? "text" : "password"}
 name="confirmPassword"
 value={formData.confirmPassword}
 onChange={handleInputChange}
 placeholder="********"
 className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg py-3 ${isRTL ? "pr-11 pl-4" : "pl-11 pr-11"} text-[14px] text-white placeholder-[#666] focus:outline-none focus:border-[rgba(212,175,55,0.5)] focus:bg-[rgba(212,175,55,0.05)] transition-all duration-200`}
 required
 />
 <button
 type="button"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 className={`absolute top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#D4AF37] transition-colors ${isRTL ? "left-3.5" : "right-3.5"}`}
 >
 {showConfirmPassword ? (
 <EyeOff className="w-4 h-4" />
 ) : (
 <Eye className="w-4 h-4" />
 )}
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Forgot Password */}
 {mode === "login" && (
 <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
 <button
 type="button"
 className="text-[12px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors"
 >
 {t("auth.forgotPassword")}
 </button>
 </div>
 )}

 {/* Submit Button */}
 <button
 type="submit"
 disabled={isSubmitting}
 className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-[#0a0a0a] font-semibold text-[15px] transition-all duration-300 ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"}`}
 style={{
 background: "linear-gradient(135deg, #D4AF37, #F0D878)",
 }}
 >
 {isSubmitting ? (
 <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
 ) : mode === "login" ? (
 <>
 <LogIn className="w-4 h-4" />
 {t("auth.signIn")}
 </>
 ) : (
 <>
 <UserPlus className="w-4 h-4" />
 {t("auth.createAccountBtn")}
 </>
 )}
 </button>
 </form>

 {/* Kimi OAuth Login — only show if configured */}
 {(() => {
 const oauthUrl = getOAuthUrl();
 return oauthUrl ? (
 <>
 {/* Divider */}
 <div className="flex items-center gap-4 my-6">
 <div className="flex-1 h-px bg-[#2a2a2a]" />
 <span className="text-[12px] text-[#9CA3AF]">{t("auth.or")}</span>
 <div className="flex-1 h-px bg-[#2a2a2a]" />
 </div>

 <a
 href={oauthUrl}
 className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-medium text-[#E0E0E0] transition-all duration-300 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)] hover:border-[rgba(212,175,55,0.25)]`}
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <Sparkles className="w-4 h-4 text-[#D4AF37]" />
 {isRTL ? "تسجيل الدخول مع كيمي" : "Sign in with Kimi"}
 </a>
 </>
 ) : null;
 })()}

 {/* Switch Mode */}
 <p className="text-center text-[14px] text-[#9CA3AF] mt-6">
 {mode === "login" ? (
 <>
 {t("auth.noAccount")}{" "}
 <button
 type="button"
 onClick={switchMode}
 className="text-[#D4AF37] font-medium hover:underline"
 >
 {t("auth.signUpLink")}
 </button>
 </>
 ) : (
 <>
 {t("auth.hasAccount")}{" "}
 <button
 type="button"
 onClick={switchMode}
 className="text-[#D4AF37] font-medium hover:underline"
 >
 {t("auth.signInLink")}
 </button>
 </>
 )}
 </p>
 </div>
 </motion.div>
 </div>
 );
}
