import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileJson, FileSpreadsheet, Globe, Check, X, AlertTriangle, Loader2, Database } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useUIStore } from "@/stores/useUIStore";

interface ImportItem {
  title: string;
  synopsis: string;
  year: number;
  rating?: number;
  episodes?: number;
  status?: string;
  studio?: string;
  image?: string;
  genres?: string[];
  _valid: boolean;
  _error?: string;
}

export function AdminImportPage() {
  const { isRTL } = useLanguage();
  const addToast = useUIStore((s) => s.addToast);
  const [mode, setMode] = useState<"csv" | "json" | "api">("csv");
  const [items, setItems] = useState<ImportItem[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [apiQuery, setApiQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const utils = trpc.useUtils();
  const bulkImport = trpc.anime.bulkImport.useMutation({
    onSuccess: (data) => {
      addToast({ message: isRTL ? `تم استيراد ${data.count} أنمي` : `Imported ${data.count} anime`, type: "success" });
      utils.anime.list.invalidate();
      utils.anime.stats.invalidate();
      setItems([]);
      setIsImporting(false);
    },
    onError: (err) => {
      addToast({ message: err.message, type: "error" });
      setIsImporting(false);
    },
  });

  // CSV Parser
  const parseCSV = (text: string): ImportItem[] => {
    const lines = text.trim().split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
    const result: ImportItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj: any = {};
      headers.forEach((h, idx) => { obj[h] = values[idx]; });
      const item: ImportItem = {
        title: obj.title || "",
        synopsis: obj.synopsis || obj.description || "",
        year: Number(obj.year) || new Date().getFullYear(),
        rating: Number(obj.rating) || 80,
        episodes: Number(obj.episodes) || 12,
        status: obj.status || "Ongoing",
        studio: obj.studio || "",
        image: obj.image || obj.poster || "",
        genres: obj.genres ? obj.genres.split(";").map((g: string) => g.trim()) : [],
        _valid: !!(obj.title && obj.synopsis && obj.year),
      };
      if (!item._valid) item._error = isRTL ? "العنوان والقصة والسنة مطلوبة" : "Title, synopsis, and year are required";
      result.push(item);
    }
    return result;
  };

  // JSON Parser
  const parseJSON = (text: string): ImportItem[] => {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : [data];
      return arr.map((obj: any) => {
        const item: ImportItem = {
          title: obj.title || "",
          synopsis: obj.synopsis || obj.description || "",
          year: Number(obj.year) || new Date().getFullYear(),
          rating: Number(obj.rating) || 80,
          episodes: Number(obj.episodes) || 12,
          status: obj.status || "Ongoing",
          studio: obj.studio || "",
          image: obj.image || obj.poster || "",
          genres: Array.isArray(obj.genres) ? obj.genres : (obj.genres ? String(obj.genres).split(";").map((g: string) => g.trim()) : []),
          _valid: !!(obj.title && (obj.synopsis || obj.description) && obj.year),
        };
        if (!item._valid) item._error = isRTL ? "العنوان والقصة والسنة مطلوبة" : "Title, synopsis, and year are required";
        return item;
      });
    } catch {
      addToast({ message: isRTL ? "ملف JSON غير صالح" : "Invalid JSON file", type: "error" });
      return [];
    }
  };

  // File drop handler
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (file.name.endsWith(".json") || mode === "json") {
        setItems(parseJSON(text));
      } else {
        setItems(parseCSV(text));
      }
    };
    reader.readAsText(file);
  }, [mode, isRTL]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (file.name.endsWith(".json")) setItems(parseJSON(text));
      else setItems(parseCSV(text));
    };
    reader.readAsText(file);
  };

  // Fetch from external API (AniList)
  const fetchFromApi = async () => {
    if (!apiQuery.trim()) return;
    setIsFetching(true);
    try {
      const query = `
        query($search: String) {
          Page(perPage: 10) {
            media(search: $search, type: ANIME) {
              id title { romaji english native }
              description episodes status seasonYear
              averageScore studios { nodes { name } }
              genres coverImage { large }
            }
          }
        }`;
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { search: apiQuery } }),
      });
      const data = await res.json();
      const media = data?.data?.Page?.media || [];
      const parsed = media.map((m: any) => ({
        title: m.title?.romaji || m.title?.english || "Unknown",
        synopsis: m.description ? m.description.replace(/<[^>]*>/g, "").substring(0, 2000) : "",
        year: m.seasonYear || new Date().getFullYear(),
        rating: Math.round((m.averageScore || 80) * 10),
        episodes: m.episodes || 12,
        status: m.status === "RELEASING" ? "Ongoing" : m.status === "FINISHED" ? "Completed" : "Upcoming",
        studio: m.studios?.nodes?.[0]?.name || "",
        image: m.coverImage?.large || "",
        genres: m.genres || [],
        _valid: true,
      }));
      setItems(parsed);
      addToast({ message: isRTL ? `تم العثور على ${parsed.length} نتيجة` : `Found ${parsed.length} results`, type: "success" });
    } catch {
      addToast({ message: isRTL ? "فشل الاتصال بـ AniList" : "Failed to connect to AniList", type: "error" });
    }
    setIsFetching(false);
  };

  const handleImport = () => {
    const valid = items.filter((i) => i._valid);
    if (valid.length === 0) {
      addToast({ message: isRTL ? "لا توجد عناصر صالحة للاستيراد" : "No valid items to import", type: "error" });
      return;
    }
    setIsImporting(true);
    const payload = valid.map((i) => ({
      title: i.title,
      synopsis: i.synopsis,
      year: i.year,
      rating: i.rating || 80,
      episodes: i.episodes || 12,
      status: i.status || "Ongoing",
      studio: i.studio || "",
      image: i.image || "",
      genres: i.genres || [],
    }));
    bulkImport.mutate({ animeList: payload });
  };

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const validCount = items.filter((i) => i._valid).length;
  const invalidCount = items.filter((i) => !i._valid).length;

  return (
    <AdminLayout>
      {/* Mode Tabs */}
      <div className="flex gap-1 mb-6 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        {[
          { key: "csv" as const, label: "CSV", labelAr: "CSV", icon: FileSpreadsheet },
          { key: "json" as const, label: "JSON", labelAr: "JSON", icon: FileJson },
          { key: "api" as const, label: "AniList API", labelAr: "AniList API", icon: Globe },
        ].map((m) => (
          <button key={m.key} onClick={() => { setMode(m.key); setItems([]); }} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium transition-all"
            style={{ background: mode === m.key ? "rgba(212,175,55,0.1)" : "transparent", color: mode === m.key ? "#D4AF37" : "var(--nv-text-muted)", border: mode === m.key ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent" }}>
            <m.icon className="w-3.5 h-3.5" />{isRTL ? m.labelAr : m.label}
          </button>
        ))}
      </div>

      {/* CSV / JSON Upload */}
      {(mode === "csv" || mode === "json") && (
        <div className="mb-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className="rounded-xl p-8 text-center transition-all cursor-pointer"
            style={{
              background: dragOver ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.015)",
              border: dragOver ? "2px dashed rgba(212,175,55,0.4)" : "2px dashed rgba(255,255,255,0.08)",
            }}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: dragOver ? "#D4AF37" : "var(--nv-text-dim)" }} />
            <p className="text-[14px] font-medium mb-1" style={{ color: "var(--nv-text-primary)" }}>
              {isRTL ? "اسحب الملف هنا أو انقر للاختيار" : "Drag file here or click to select"}
            </p>
            <p className="text-[11px]" style={{ color: "var(--nv-text-dim)" }}>
              {mode === "csv" ? (isRTL ? "ملف CSV فقط (.csv)" : "CSV file only (.csv)") : (isRTL ? "ملف JSON فقط (.json)" : "JSON file only (.json)")}
            </p>
            <input id="file-input" type="file" accept={mode === "csv" ? ".csv" : ".json"} onChange={handleFileInput} className="hidden" />
          </div>
        </div>
      )}

      {/* API Search */}
      {mode === "api" && (
        <motion.div className="mb-6 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[12px] mb-3" style={{ color: "var(--nv-text-muted)" }}>
            {isRTL ? "ابحث في AniList API عن الأنمي واستورد البيانات تلقائياً" : "Search AniList API for anime and import data automatically"}
          </p>
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <input type="text" value={apiQuery} onChange={(e) => setApiQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchFromApi()}
              placeholder={isRTL ? "اسم الأنمي..." : "Anime name..."}
              className="flex-1 h-10 rounded-lg text-[13px] px-3 admin-input" />
            <button onClick={fetchFromApi} disabled={isFetching || !apiQuery.trim()}
              className="flex items-center gap-2 px-4 h-10 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {isRTL ? "بحث" : "Search"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Preview Table */}
      {items.length > 0 && (
        <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{items.length} {isRTL ? "عنصر" : "items"}</span>
              {validCount > 0 && <span className="flex items-center gap-1 text-[11px] text-emerald-400"><Check className="w-3 h-3" />{validCount} {isRTL ? "صالح" : "valid"}</span>}
              {invalidCount > 0 && <span className="flex items-center gap-1 text-[11px] text-[#ef4444]"><AlertTriangle className="w-3 h-3" />{invalidCount} {isRTL ? "غير صالح" : "invalid"}</span>}
            </div>
            <button onClick={() => setItems([])} className="text-[11px] flex items-center gap-1 transition-colors" style={{ color: "var(--nv-text-dim)" }}><X className="w-3 h-3" />{isRTL ? "مسح" : "Clear"}</button>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.05)]">
                    <th className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--nv-text-dim)" }}>#</th>
                    <th className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-start" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "العنوان" : "Title"}</th>
                    <th className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-start" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "السنة" : "Year"}</th>
                    <th className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-start" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "الحلقات" : "Eps"}</th>
                    <th className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-start" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "التصنيفات" : "Genres"}</th>
                    <th className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--nv-text-dim)" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-3 py-2.5 text-center">
                        {item._valid ? <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444] mx-auto" title={item._error} />}
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="text-[12px] font-medium truncate max-w-[200px]" style={{ color: item._valid ? "var(--nv-text-primary)" : "#ef4444" }}>{item.title || "—"}</p>
                        {!item._valid && <p className="text-[9px] text-[#ef4444]">{item._error}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] font-mono" style={{ color: "var(--nv-text-muted)" }}>{item.year}</td>
                      <td className="px-3 py-2.5 text-[11px]" style={{ color: "var(--nv-text-muted)" }}>{item.episodes}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1 flex-wrap">
                          {(item.genres || []).slice(0, 2).map((g) => (
                            <span key={g} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.08)", color: "#D4AF37" }}>{g}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => removeItem(idx)} className="w-6 h-6 rounded flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Import Button */}
          {validCount > 0 && (
            <motion.div className="mt-4 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={handleImport} disabled={isImporting}
                className="flex items-center gap-2 px-6 h-10 rounded-lg text-[13px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {isImporting ? (isRTL ? "جاري الاستيراد..." : "Importing...") : `${isRTL ? "استيراد" : "Import"} ${validCount} ${isRTL ? "أنمي" : "anime"}`}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AdminLayout>
  );
}
