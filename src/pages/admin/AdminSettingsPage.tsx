import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Palette, Bell, Shield, Database, Save, Moon, Sun, Check, RotateCcw } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useUIStore } from "@/stores/useUIStore";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface SettingSectionProps {
  icon: any;
  title: string;
  titleAr: string;
  description: string;
  descAr: string;
  children: React.ReactNode;
  isRTL?: boolean;
  delay?: number;
}

function SettingSection({ icon: Icon, title, titleAr, description, descAr, children, isRTL = false, delay = 0 }: SettingSectionProps) {
  return (
    <motion.div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.12)" }}>
          <Icon className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <h3 className="text-[14px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? titleAr : title}</h3>
      </div>
      <p className={`text-[11px] text-[#555] mb-5 ${isRTL ? "mr-12" : "ml-12"}`}>{isRTL ? descAr : description}</p>
      {children}
    </motion.div>
  );
}

function ToggleSwitch({ checked, onChange, isRTL = false }: { checked: boolean; onChange: (v: boolean) => void; isRTL?: boolean }) {
  return (
    <button onClick={() => onChange(!checked)} className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? "linear-gradient(135deg, #D4AF37, #F0D878)" : "rgba(255,255,255,0.08)" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow"
        style={{ transform: checked ? (isRTL ? "translateX(-21px)" : "translateX(23px)") : (isRTL ? "translateX(-2px)" : "translateX(2px)") }} />
    </button>
  );
}

export function AdminSettingsPage() {
  const { isRTL } = useLanguage();
  const addToast = useUIStore((s) => s.addToast);

  // Fetch settings from backend
  const settingsQuery = trpc.settings.list.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();

  const [s, setS] = useState({
    siteLanguage: "ar" as "ar" | "en",
    defaultTheme: "dark" as "dark" | "light",
    emailNotifications: true,
    reviewAlerts: true,
    newUserAlerts: false,
    autoApproveReviews: true,
    maintenanceMode: false,
    siteName: "NUROVIA",
    siteDescription: "Premium Anime Streaming Platform",
    maxUploadSize: 50,
    allowRegistration: true,
    requireEmailVerification: false,
  });
  const [saved, setSaved] = useState(false);

  // Sync from backend
  useEffect(() => {
    if (settingsQuery.data) {
      setS(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.list.invalidate();
      setSaved(true);
      addToast({ message: isRTL ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully", type: "success" });
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (err) => {
      addToast({ message: err.message, type: "error" });
    },
  });

  const resetMutation = trpc.settings.reset.useMutation({
    onSuccess: (data) => {
      utils.settings.list.invalidate();
      if (data.settings) setS(data.settings as any);
      addToast({ message: isRTL ? "تمت إعادة التعيين" : "Settings reset to defaults", type: "info" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(s);
  };

  const handleReset = () => {
    if (window.confirm(isRTL ? "هل أنت متأكد من إعادة التعيين؟" : "Are you sure you want to reset all settings?")) {
      resetMutation.mutate();
    }
  };

  const toggle = (key: keyof typeof s) => setS((prev) => ({ ...prev, [key]: !prev[key] }));

  const isPending = updateMutation.isPending || resetMutation.isPending;

  return (
    <AdminLayout>
      {/* Save bar */}
      <motion.div className="flex items-center justify-between rounded-xl px-5 py-3 mb-6" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.12)" }}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.div className="flex items-center gap-1.5 text-emerald-400" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <Check className="w-4 h-4" />
              <span className="text-[12px] font-medium">{isRTL ? "تم الحفظ" : "Saved successfully"}</span>
            </motion.div>
          )}
          {!saved && <span className="text-[12px] text-[#888]">{isRTL ? "أجرِ تغييراتك ثم احفظها" : "Make your changes then save"}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} disabled={isPending}
            className="flex items-center gap-2 px-3 h-9 rounded-lg text-[12px] font-medium text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(239,68,68,0.08)] hover:text-[#ef4444] hover:border-[rgba(239,68,68,0.2)] transition-all disabled:opacity-50">
            <RotateCcw className="w-3.5 h-3.5" />
            {isRTL ? "إعادة تعيين" : "Reset"}
          </button>
          <button onClick={handleSave} disabled={isPending}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
            <Save className="w-3.5 h-3.5" />
            {isPending ? (isRTL ? "جاري..." : "Saving...") : (isRTL ? "حفظ الإعدادات" : "Save Settings")}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language */}
        <SettingSection icon={Globe} title="Site Language" titleAr="لغة الموقع" description="Default language for all visitors" descAr="اللغة الافتراضية لجميع الزوار" isRTL={isRTL} delay={0.05}>
          <div className="flex gap-2">
            {(["ar", "en"] as const).map((lang) => (
              <button key={lang} onClick={() => setS((p) => ({ ...p, siteLanguage: lang }))} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-medium transition-all"
                style={{ background: s.siteLanguage === lang ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", color: s.siteLanguage === lang ? "#D4AF37" : "#888", border: s.siteLanguage === lang ? "1px solid rgba(212,175,55,0.25)" : "1px solid rgba(255,255,255,0.06)" }}>
                {lang === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Theme */}
        <SettingSection icon={Palette} title="Default Theme" titleAr="السمة الافتراضية" description="Choose the default appearance" descAr="اختر المظهر الافتراضي" isRTL={isRTL} delay={0.1}>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((theme) => (
              <button key={theme} onClick={() => setS((p) => ({ ...p, defaultTheme: theme }))} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-medium transition-all"
                style={{ background: s.defaultTheme === theme ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", color: s.defaultTheme === theme ? "#D4AF37" : "#888", border: s.defaultTheme === theme ? "1px solid rgba(212,175,55,0.25)" : "1px solid rgba(255,255,255,0.06)" }}>
                {theme === "dark" ? <><Moon className="w-4 h-4" /> Dark</> : <><Sun className="w-4 h-4" /> Light</>}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="Notifications" titleAr="الإشعارات" description="Control your notification preferences" descAr="تحكم في تفضيلات الإشعارات" isRTL={isRTL} delay={0.15}>
          <div className="space-y-3">
            {[
              { key: "emailNotifications" as const, label: isRTL ? "إشعارات البريد" : "Email Notifications", sub: isRTL ? "تلقي تحديثات عبر البريد" : "Receive updates via email" },
              { key: "reviewAlerts" as const, label: isRTL ? "تنبيهات التقييمات" : "New Review Alerts", sub: isRTL ? "عند نشر تقييم جديد" : "When a new review is posted" },
              { key: "newUserAlerts" as const, label: isRTL ? "تنبيهات المستخدمين" : "New User Alerts", sub: isRTL ? "عند تسجيل مستخدم جديد" : "When a new user signs up" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px]" style={{ color: "var(--nv-text-primary)" }}>{item.label}</p>
                  <p className="text-[10px] text-[#555]">{item.sub}</p>
                </div>
                <ToggleSwitch checked={s[item.key] as boolean} onChange={() => toggle(item.key)} isRTL={isRTL} />
              </div>
            ))}
          </div>
        </SettingSection>

        {/* Security */}
        <SettingSection icon={Shield} title="Security & Moderation" titleAr="الأمان والإشراف" description="Security settings and moderation rules" descAr="إعدادات الأمان وقواعد الإشراف" isRTL={isRTL} delay={0.2}>
          <div className="space-y-3">
            {[
              { key: "autoApproveReviews" as const, label: isRTL ? "الموافقة التلقائية" : "Auto-Approve Reviews", sub: isRTL ? "الموافقة على التقييمات تلقائياً" : "Automatically approve new reviews" },
              { key: "maintenanceMode" as const, label: isRTL ? "وضع الصيانة" : "Maintenance Mode", sub: isRTL ? "إظهار صفحة الصيانة للزوار" : "Show maintenance page to visitors" },
              { key: "allowRegistration" as const, label: isRTL ? "السماح بالتسجيل" : "Allow Registration", sub: isRTL ? "تمكين تسجيل حسابات جديدة" : "Enable new account registration" },
              { key: "requireEmailVerification" as const, label: isRTL ? "تأكيد البريد" : "Require Email Verification", sub: isRTL ? "إلزام المستخدمين بتأكيد البريد" : "Require users to verify their email" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px]" style={{ color: "var(--nv-text-primary)" }}>{item.label}</p>
                  <p className="text-[10px] text-[#555]">{item.sub}</p>
                </div>
                <ToggleSwitch checked={s[item.key] as boolean} onChange={() => toggle(item.key)} isRTL={isRTL} />
              </div>
            ))}
          </div>
        </SettingSection>

        {/* Site Info */}
        <SettingSection icon={Globe} title="Site Information" titleAr="معلومات الموقع" description="Basic site identity settings" descAr="إعدادات هوية الموقع الأساسية" isRTL={isRTL} delay={0.25}>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#888] mb-1.5 block">{isRTL ? "اسم الموقع" : "Site Name"}</label>
              <input type="text" value={s.siteName} onChange={(e) => setS((p) => ({ ...p, siteName: e.target.value }))}
                className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
            </div>
            <div>
              <label className="text-[11px] text-[#888] mb-1.5 block">{isRTL ? "الوصف" : "Description"}</label>
              <input type="text" value={s.siteDescription} onChange={(e) => setS((p) => ({ ...p, siteDescription: e.target.value }))}
                className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
            </div>
            <div>
              <label className="text-[11px] text-[#888] mb-1.5 block">{isRTL ? "الحد الأقصى للرفع (MB)" : "Max Upload Size (MB)"}</label>
              <input type="number" value={s.maxUploadSize} onChange={(e) => setS((p) => ({ ...p, maxUploadSize: Number(e.target.value) }))}
                className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
            </div>
          </div>
        </SettingSection>

        {/* System Health */}
        <SettingSection icon={Database} title="System Health" titleAr="صحة النظام" description="Server and database status" descAr="حالة الخادم وقاعدة البيانات" isRTL={isRTL} delay={0.3}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[#888]">{isRTL ? "وحدة المعالجة" : "CPU Usage"}</span>
                <StatusBadge status="active" pulse />
              </div>
              <ProgressBar value={42} color="#D4AF37" height={5} showValue={false} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[#888]">{isRTL ? "الذاكرة" : "Memory"}</span>
                <span className="text-[10px] text-[#888]">3.2GB / 8GB</span>
              </div>
              <ProgressBar value={40} color="#60a5fa" height={5} showValue={false} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[#888]">{isRTL ? "التخزين" : "Storage"}</span>
                <span className="text-[10px] text-[#f59e0b]">67%</span>
              </div>
              <ProgressBar value={67} color="#f59e0b" height={5} showValue={false} />
            </div>
            <div className="pt-2 border-t border-[rgba(255,255,255,0.03)]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#555]">NUROVIA Platform</span>
                <span className="text-[#888] font-mono">v2.1.0</span>
              </div>
            </div>
          </div>
        </SettingSection>
      </div>
    </AdminLayout>
  );
}
