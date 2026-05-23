import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Database, Tv, Users, MessageSquare, FileJson, FileSpreadsheet } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/context/LanguageContext";

export function AdminExportPage() {
  const { isRTL } = useLanguage();
  const [exporting, setExporting] = useState<string | null>(null);

  const animeQuery = trpc.anime.list.useQuery({ limit: 1000 }, { retry: false, enabled: false });

  const exportData = async (type: string, format: "json" | "csv") => {
    setExporting(type);
    try {
      let data: any[] = [];
      let filename = "";

      switch (type) {
        case "anime":
          const animeResult = await animeQuery.refetch();
          data = (animeResult.data || []) as any[];
          filename = `anime-export-${new Date().toISOString().split("T")[0]}`;
          break;
        default:
          data = [];
      }

      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${filename}.json`; a.click();
        URL.revokeObjectURL(url);
      } else {
        // CSV
        if (data.length === 0) { setExporting(null); return; }
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((row) => Object.values(row).map((v) => `"${String(v).replace(/\"/g, '""')}"`).join(","));
        const csv = [headers, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${filename}.csv`; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
    setExporting(null);
  };

  const exportOptions = [
    { key: "anime", label: "Anime Library", labelAr: "مكتبة الأنمي", icon: Tv, count: "All titles" },
    { key: "users", label: "Users", labelAr: "المستخدمين", icon: Users, count: "OAuth + Local" },
    { key: "reviews", label: "Reviews", labelAr: "المراجعات", icon: MessageSquare, count: "All reviews" },
    { key: "episodes", label: "Episodes", labelAr: "الحلقات", icon: Database, count: "All episodes" },
  ];

  return (
    <AdminLayout>
      <motion.h1 className="text-[20px] font-bold mb-6 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Download className="w-5 h-5" style={{ color: "var(--nv-gold)"}} />{isRTL ? "التصدير والنسخ الاحتياطي" : "Export & Backup"}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions.map((opt, i) => (
          <motion.div key={opt.key} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.08)" }}>
                <opt.icon className="w-5 h-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? opt.labelAr : opt.label}</h3>
                <p className="text-[11px]" style={{ color: "var(--nv-text-dim)" }}>{opt.count}</p>
              </div>
            </div>
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button onClick={() => exportData(opt.key, "json")} disabled={exporting === opt.key}
                className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium transition-all hover:bg-[rgba(212,175,55,0.1)] disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--nv-text-secondary)" }}>
                <FileJson className="w-3.5 h-3.5" />JSON
              </button>
              <button onClick={() => exportData(opt.key, "csv")} disabled={exporting === opt.key}
                className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium transition-all hover:bg-[rgba(212,175,55,0.1)] disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--nv-text-secondary)" }}>
                <FileSpreadsheet className="w-3.5 h-3.5" />CSV
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
