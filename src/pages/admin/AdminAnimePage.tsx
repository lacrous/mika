import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 Search, Plus, Pencil, Trash2, X, Star, ChevronLeft, ChevronRight,
 Filter, Grid3X3, List, Download, MoreHorizontal, CheckSquare, Square,
 ArrowUpDown, ImageIcon, Film, Play, Clock, Hash,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { AnimeSearch } from "@/components/admin/AnimeSearch";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { trpc } from "@/providers/trpc";
import { useUIStore } from "@/stores/useUIStore";
import { genreColors } from "@/data/adminData";

const ITEMS_PER_PAGE = 10;

interface AnimeFormData {
 title: string;
 synopsis: string;
 year: number;
 rating: number;
 episodes: number;
 status: string;
 studio: string;
 image: string;
 genres: string[];
 trending: boolean;
}

const emptyForm: AnimeFormData = {
 title: "",
 synopsis: "",
 year: new Date().getFullYear(),
 rating: 8.0,
 episodes: 12,
 status: "Ongoing",
 studio: "",
 image: "",
 genres: [],
 trending: false,
};

export function AdminAnimePage() {
 const { isRTL } = useLanguage();
 const { isDark } = useTheme();
 const addToast = useUIStore((s) => s.addToast);
 const [activeTab, setActiveTab] = useState<"anime" | "episodes">("anime");
 const [search, setSearch] = useState("");
 const [page, setPage] = useState(1);
 const [sortField, setSortField] = useState<"id" | "title" | "year" | "rating" | "episodes" | "status">("id");
 const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
 const [showForm, setShowForm] = useState(false);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [showEpisodes, setShowEpisodes] = useState(false);
 const [epAnimeId, setEpAnimeId] = useState<number | null>(null);
 const [epAnimeTitle, setEpAnimeTitle] = useState("");
 const [selectedAnimeForEp, setSelectedAnimeForEp] = useState<number | null>(null);
 const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
 const [viewMode, setViewMode] = useState<"list" | "grid">("list");
 const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

 const [formData, setFormData] = useState<AnimeFormData>({ ...emptyForm });
 const [genreInput, setGenreInput] = useState("");

 // tRPC
 const utils = trpc.useUtils();
 const animeListQuery = trpc.anime.list.useQuery(
 { search: search || undefined, limit: 100 },
 { retry: false }
 );
 const createMutation = trpc.anime.create.useMutation({
 onSuccess: () => { utils.anime.list.invalidate(); utils.anime.stats.invalidate(); setShowForm(false); setFormData({ ...emptyForm }); },
 });
 const updateMutation = trpc.anime.update.useMutation({
 onSuccess: () => { utils.anime.list.invalidate(); utils.anime.stats.invalidate(); setShowForm(false); setEditingId(null); },
 });
 const deleteMutation = trpc.anime.delete.useMutation({
 onSuccess: () => { utils.anime.list.invalidate(); utils.anime.stats.invalidate(); setDeleteConfirm(null); },
 });

 const allAnime = animeListQuery.data || [];

 const filtered = useMemo(() => {
 let result = [...allAnime];
 result.sort((a: any, b: any) => {
 const aVal = a[sortField] ?? 0;
 const bVal = b[sortField] ?? 0;
 if (typeof aVal === "string" && typeof bVal === "string") {
 return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
 }
 return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
 });
 return result;
 }, [allAnime, sortField, sortDir]);

 const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
 const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

 const toggleSort = (field: "id" | "title" | "year" | "rating" | "episodes" | "status") => {
 if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
 else { setSortField(field); setSortDir("asc"); }
 };

 const openAddForm = () => { setEditingId(null); setFormData({ ...emptyForm }); setGenreInput(""); setShowForm(true); };
 const openEditForm = (a: any) => {
 setEditingId(a.id);
 setFormData({ title: a.title, synopsis: a.synopsis, year: a.year, rating: typeof a.rating === "number" && a.rating > 10 ? a.rating / 10 : a.rating, episodes: a.episodes, status: a.status, studio: a.studio, image: a.image, genres: a.genres || [], trending: a.trending === 1 });
 setGenreInput(""); setShowForm(true);
 };
 const handleSave = () => {
 const payload = { ...formData, rating: Math.round(formData.rating * 10) };
 if (editingId !== null) updateMutation.mutate({ id: editingId, ...payload });
 else createMutation.mutate(payload as any);
 };
 const handleDelete = () => { if (deleteConfirm) deleteMutation.mutate({ id: deleteConfirm.id }); };
 const addGenre = () => { if (genreInput.trim() && !formData.genres.includes(genreInput.trim())) { setFormData({ ...formData, genres: [...formData.genres, genreInput.trim()] }); setGenreInput(""); } };
 const removeGenre = (g: string) => { setFormData({ ...formData, genres: formData.genres.filter((genre) => genre !== g) }); };

 const isSaving = createMutation.isPending || updateMutation.isPending;
 const isDeleting = deleteMutation.isPending;

 const toggleSelect = (id: number) => {
 const next = new Set(selectedIds);
 if (next.has(id)) next.delete(id); else next.add(id);
 setSelectedIds(next);
 };
 const selectAll = () => {
 if (selectedIds.size === paginated.length) setSelectedIds(new Set());
 else setSelectedIds(new Set(paginated.map((a: any) => a.id)));
 };

 return (
 <AdminLayout>
 {/* Toolbar */}
 <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
 <div className="relative flex-1 max-w-[400px]">
 <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] ${isRTL ? "right-3" : "left-3"}`} />
 <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={isRTL ? "البحث في الأنمي..." : "Search anime..."}
 className={`w-full h-10 rounded-lg text-[13px] placeholder-[#555] outline-none bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] transition-colors ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"}`} />
 </div>
 <div className={`flex items-center gap-2`}>
 {/* View toggle */}
 <div className="flex items-center rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)]">
 <button onClick={() => setViewMode("list")} className={`px-2.5 py-2 transition-colors ${viewMode === "list" ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]" : "text-[#555] hover:text-[#888]"}`}>
 <List className="w-4 h-4" />
 </button>
 <button onClick={() => setViewMode("grid")} className={`px-2.5 py-2 transition-colors ${viewMode === "grid" ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]" : "text-[#555] hover:text-[#888]"}`}>
 <Grid3X3 className="w-4 h-4" />
 </button>
 </div>
 <button className="h-10 px-3 rounded-lg text-[#555] hover:text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all">
 <Download className="w-4 h-4" />
 </button>
 <button onClick={openAddForm} className="flex items-center gap-2 px-4 h-10 rounded-lg text-[13px] font-medium text-[#0a0a0a] transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
 <Plus className="w-4 h-4" />
 {isRTL ? "إضافة" : "Add Anime"}
 </button>
 </div>
 </div>

 {/* Tabs: Anime | Episodes */}
 <div className="flex gap-1 mb-6 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
 <button onClick={() => setActiveTab("anime")} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium transition-all"
 style={{ background: activeTab === "anime" ? "rgba(212,175,55,0.1)" : "transparent", color: activeTab === "anime" ? "#D4AF37" : "#555", border: activeTab === "anime" ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent" }}>
 <Film className="w-3.5 h-3.5" /> {isRTL ? "مكتبة الأنمي" : "Anime Library"}
 </button>
 <button onClick={() => setActiveTab("episodes")} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium transition-all"
 style={{ background: activeTab === "episodes" ? "rgba(212,175,55,0.1)" : "transparent", color: activeTab === "episodes" ? "#D4AF37" : "#555", border: activeTab === "episodes" ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent" }}>
 <Play className="w-3.5 h-3.5" /> {isRTL ? "الحلقات" : "Episodes"}
 </button>
 </div>

 {/* BULK BAR */}
 {activeTab === "anime" && selectedIds.size > 0 && (
 <motion.div className="flex items-center justify-between px-4 py-2.5 rounded-lg mb-4" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
 <span className="text-[12px] text-[#D4AF37]">{selectedIds.size} {isRTL ? "عناصر محددة" : "items selected"}</span>
 <button onClick={() => setSelectedIds(new Set())} className="text-[11px] text-[#888] hover:text-[var(--nv-text-primary)] transition-colors">{isRTL ? "إلغاء" : "Clear"}</button>
 </motion.div>
 )}

 {activeTab === "anime" && (
 viewMode === "list" ? (
 <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-[rgba(255,255,255,0.05)]">
 <th className="px-4 py-3 w-10">
 <button onClick={selectAll} className="text-[#555] hover:text-[#D4AF37] transition-colors">
 {selectedIds.size === paginated.length && paginated.length > 0 ? <CheckSquare className="w-4 h-4 text-[#D4AF37]" /> : <Square className="w-4 h-4" />}
 </button>
 </th>
 {[
 { key: "id" as const, label: "ID", w: "w-12" },
 { key: "title" as const, label: isRTL ? "العنوان" : "Title", w: "" },
 { key: "year" as const, label: isRTL ? "السنة" : "Year", w: "w-16" },
 { key: "rating" as const, label: isRTL ? "التقييم" : "Rating", w: "w-20" },
 { key: "episodes" as const, label: isRTL ? "الحلقات" : "Eps", w: "w-14" },
 { key: "status" as const, label: isRTL ? "الحالة" : "Status", w: "w-24" },
 { key: "genres" as const, label: isRTL ? "التصنيف" : "Genres", w: "w-32" },
 ].map((col) => (
 <th key={col.key} className={`px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold ${col.w} ${isRTL ? "text-end" : "text-start"}`}>
 <button onClick={() => toggleSort(col.key)} className={`flex items-center gap-1 hover:text-[#888] transition-colors`}>
 {col.label}
 <ArrowUpDown className="w-3 h-3" />
 {sortField === col.key && <span className="text-[#D4AF37]">{sortDir === "asc" ? "↑" : "↓"}</span>}
 </button>
 </th>
 ))}
 <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-left">{isRTL ? "إجراءات" : "Actions"}</th>
 </tr>
 </thead>
 <tbody>
 {paginated.map((a: any, i: number) => (
 <motion.tr key={a.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
 <td className="px-4 py-3">
 <button onClick={() => toggleSelect(a.id)} className="text-[#555] hover:text-[#D4AF37] transition-colors">
 {selectedIds.has(a.id) ? <CheckSquare className="w-4 h-4 text-[#D4AF37]" /> : <Square className="w-4 h-4" />}
 </button>
 </td>
 <td className="px-4 py-3 text-[11px] text-[#555] font-mono">{a.id}</td>
 <td className="px-4 py-3">
 <div className={`flex items-center gap-3`}>
 {a.image ? (
 <img src={a.image} alt={a.title} className="w-9 h-[52px] rounded object-cover flex-shrink-0" />
 ) : (
 <div className="w-9 h-[52px] rounded flex items-center justify-center flex-shrink-0 bg-[rgba(255,255,255,0.03)]">
 <ImageIcon className="w-4 h-4 text-[#333]" />
 </div>
 )}
 <div className={`min-w-0 ${isRTL ? "text-end" : "text-start"}`}>
 <span className="text-[13px] font-medium truncate max-w-[180px] block" style={{ color: "var(--nv-text-primary)" }}>{a.title}</span>
 <span className="text-[10px] text-[#555]">{a.studio}</span>
 </div>
 </div>
 </td>
 <td className="px-4 py-3 text-[12px] text-[#ccc]">{a.year}</td>
 <td className="px-4 py-3">
 <span className={`flex items-center gap-1 text-[12px] text-[#D4AF37]`}>
 <Star className="w-3 h-3 fill-[#D4AF37]" />
 {(typeof a.rating === "number" && a.rating > 10) ? (a.rating / 10).toFixed(1) : a.rating}
 </span>
 </td>
 <td className="px-4 py-3 text-[12px] text-[#ccc]">{a.episodes}</td>
 <td className="px-4 py-3">
 <StatusBadge status={(a.status === "Ongoing" ? "ongoing" : a.status === "Completed" ? "completed" : a.status === "Upcoming" ? "upcoming" : "active") as any} />
 </td>
 <td className="px-4 py-3">
 <div className="flex gap-1 flex-wrap">
 {(a.genres || []).slice(0, 2).map((g: string) => (
 <span key={g} className="text-[9px] text-[#aaa] px-1.5 py-0.5 rounded" style={{ background: `${genreColors[g] || "#666"}12`, color: genreColors[g] || "#aaa", border: `1px solid ${genreColors[g] || "#666"}18` }}>{g}</span>
 ))}
 </div>
 </td>
 <td className="px-4 py-3">
 <div className={`flex items-center gap-1`}>
 <button onClick={() => openEditForm(a)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)] transition-all opacity-0 group-hover:opacity-100">
 <Pencil className="w-3.5 h-3.5" />
 </button>
 <button onClick={() => setDeleteConfirm({ id: a.id, title: a.title })} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all opacity-0 group-hover:opacity-100">
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>

 {paginated.length === 0 && (
 <div className="text-center py-16">
 <Film className="w-12 h-12 text-[#333] mx-auto mb-3" />
 <p className="text-[14px] text-[#555]">{isRTL ? "لا توجد نتائج" : "No anime found"}</p>
 </div>
 )}

 {/* Pagination */}
 {filtered.length > 0 && (
 <div className={`flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.05)]`}>
 <span className="text-[11px] text-[#555]">{isRTL ? `${filtered.length} عنصر` : `${filtered.length} items`}</span>
 <div className={`flex items-center gap-2`}>
 <button onClick={() => setPage(1)} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
 <ChevronLeft className="w-4 h-4" style={{ transform: isRTL ? "none" : "scaleX(-1)" }} />
 </button>
 <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
 <ChevronLeft className="w-4 h-4" />
 </button>
 <span className="text-[11px] text-[#888] font-mono px-2">{page} / {totalPages}</span>
 <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
 <ChevronRight className="w-4 h-4" />
 </button>
 <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
 <ChevronRight className="w-4 h-4" style={{ transform: isRTL ? "none" : "scaleX(-1)" }} />
 </button>
 </div>
 </div>
 )}
 </div>
 ) : (
 /* Grid View */
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
 {paginated.map((a: any, i: number) => (
 <motion.div key={a.id} className="rounded-xl overflow-hidden group cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
 whileHover={{ borderColor: "rgba(212,175,55,0.2)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
 <div className="relative aspect-[2/3] overflow-hidden">
 {a.image ? <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 : <div className="w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.03)]"><ImageIcon className="w-8 h-8 text-[#333]" /></div>}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
 <button onClick={() => openEditForm(a)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur hover:bg-[#D4AF37] transition-colors" style={{ color: "var(--nv-text-primary)" }}><Pencil className="w-3.5 h-3.5" /></button>
 <button onClick={() => setDeleteConfirm({ id: a.id, title: a.title })} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur text-white hover:bg-[#ef4444] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
 </div>
 {a.trending === 1 && <span className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#0a0a0a] font-bold`}>{isRTL ? "شائع" : "HOT"}</span>}
 </div>
 <div className="p-3">
 <p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{a.title}</p>
 <div className={`flex items-center justify-between mt-1`}>
 <span className="flex items-center gap-1 text-[10px] text-[#D4AF37]"><Star className="w-2.5 h-2.5 fill-[#D4AF37]" />{typeof a.rating === "number" && a.rating > 10 ? (a.rating / 10).toFixed(1) : a.rating}</span>
 <StatusBadge status={(a.status === "Ongoing" ? "ongoing" : a.status === "Completed" ? "completed" : "active") as any} />
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 ))}

 {activeTab === "episodes" && (
 <AdminEpisodeManager isRTL={isRTL} />
 )}

 {/* Add/Edit Modal */}
 <AnimatePresence>
 {showForm && (
 <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
 <motion.div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: "linear-gradient(180deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
 <div className={`flex items-center justify-between mb-6`}>
 <div>
 <h2 className="text-[18px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{editingId !== null ? (isRTL ? "تعديل أنمي" : "Edit Anime") : (isRTL ? "إضافة أنمي" : "Add Anime")}</h2>
 <p className="text-[11px] text-[#555] mt-0.5">{isRTL ? "املأ التفاصيل أدناه" : "Fill in the details below"}</p>
 </div>
 <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[var(--nv-text-primary)] hover:bg-[var(--nv-bg-card-hover)] transition-colors"><X className="w-4 h-4" /></button>
 </div>
 <div className="space-y-4">
 <div>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{isRTL ? "العنوان" : "Title"}</label>
 <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
 </div>
 <div>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{isRTL ? "القصة" : "Synopsis"}</label>
 <textarea value={formData.synopsis} onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })} rows={3} className="w-full rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3 py-2 resize-none" />
 </div>
 <div className="grid grid-cols-3 gap-3">
 {[
 { label: isRTL ? "السنة" : "Year", val: formData.year, key: "year", type: "number" },
 { label: isRTL ? "التقييم" : "Rating", val: formData.rating, key: "rating", type: "number", step: "0.1", min: 0, max: 10 },
 { label: isRTL ? "الحلقات" : "Episodes", val: formData.episodes, key: "episodes", type: "number" },
 ].map((f) => (
 <div key={f.key}>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{f.label}</label>
 <input type={f.type} value={f.val} step={(f as any).step} min={(f as any).min} max={(f as any).max}
 onChange={(e) => setFormData({ ...formData, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
 className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
 </div>
 ))}
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{isRTL ? "الحالة" : "Status"}</label>
 <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3">
 <option value="Ongoing">Ongoing</option>
 <option value="Completed">Completed</option>
 <option value="Upcoming">Upcoming</option>
 </select>
 </div>
 <div>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{isRTL ? "الاستوديو" : "Studio"}</label>
 <input type="text" value={formData.studio} onChange={(e) => setFormData({ ...formData, studio: e.target.value })} className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
 </div>
 </div>
 <div>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{isRTL ? "رابط الصورة" : "Image URL"}</label>
 <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
 {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-16 h-24 rounded object-cover border border-[rgba(255,255,255,0.06)]" />}
 </div>
 <div>
 <label className="text-[11px] text-[#888] mb-1.5 block font-medium">{isRTL ? "التصنيفات" : "Genres"}</label>
 <div className="flex gap-2 mb-2">
 <input type="text" value={genreInput} onChange={(e) => setGenreInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())} placeholder={isRTL ? "أضف تصنيف..." : "Add genre..."}
 className="flex-1 h-10 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none transition-colors px-3" />
 <button type="button" onClick={addGenre} className="h-10 px-4 rounded-lg text-[13px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>{isRTL ? "إضافة" : "Add"}</button>
 </div>
 <div className="flex gap-2 flex-wrap">
 {formData.genres.map((g) => (
 <span key={g} className={`flex items-center gap-1 text-[12px] text-white px-2.5 py-1.5 rounded-lg`} style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
 <button onClick={() => removeGenre(g)} className="text-[#D4AF37] hover:text-[var(--nv-text-primary)]"><X className="w-3 h-3" /></button>
 {g}
 </span>
 ))}
 </div>
 </div>
 <div className={`flex items-center gap-3 pt-2`}>
 <label className="text-[13px] text-[#ccc]">{isRTL ? "الأكثر رواجاً" : "Trending"}</label>
 <button type="button" onClick={() => setFormData({ ...formData, trending: !formData.trending })}
 className="relative w-10 h-5 rounded-full transition-colors" style={{ background: formData.trending ? "linear-gradient(135deg, #D4AF37, #F0D878)" : "rgba(255,255,255,0.08)" }}>
 <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow" style={{ transform: formData.trending ? "translateX(22px)" : "translateX(2px)" }} />
 </button>
 </div>
 {/* Episodes button (only when editing) */}
 {editingId !== null && (
 <div className="pt-2 border-t border-[rgba(255,255,255,0.05)]">
 <button
 onClick={() => { setEpAnimeId(editingId); setEpAnimeTitle(formData.title); setShowEpisodes(true); }}
 className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-medium text-[#D4AF37] bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.1)] transition-all"
 >
 <Film className="w-4 h-4" />
 {isRTL ? "إدارة الحلقات" : "Manage Episodes"}
 </button>
 </div>
 )}
 <div className={`flex gap-3 pt-4`}>
 <button onClick={handleSave} disabled={isSaving} className="flex-1 h-10 rounded-lg text-[13px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
 {isSaving ? (isRTL ? "جاري الحفظ..." : "Saving...") : editingId !== null ? (isRTL ? "حفظ التغييرات" : "Save Changes") : (isRTL ? "إضافة الأنمي" : "Add Anime")}
 </button>
 <button onClick={() => setShowForm(false)} className="flex-1 h-10 rounded-lg text-[13px] font-medium text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
 {isRTL ? "إلغاء" : "Cancel"}
 </button>
 </div>
 {(createMutation.error || updateMutation.error) && <p className="text-[11px] text-red-400 mt-2">{(createMutation.error || updateMutation.error)?.message}</p>}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Delete Confirmation */}
 <AnimatePresence>
 {deleteConfirm && (
 <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
 <motion.div className="relative w-full max-w-[380px] rounded-2xl p-6" style={{ background: "linear-gradient(180deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.08)" }} initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}>
 <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
 <Trash2 className="w-6 h-6 text-[#ef4444]" />
 </div>
 <h3 className="text-[16px] font-bold text-center mb-1" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "تأكيد الحذف" : "Delete Anime"}</h3>
 <p className="text-[12px] text-[#888] text-center mb-6">{isRTL ? `هل أنت متأكد من حذف "${deleteConfirm.title}"؟ لا يمكن التراجع عن هذا.` : `Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`}</p>
 <div className={`flex gap-3`}>
 <button onClick={handleDelete} disabled={isDeleting} className="flex-1 h-10 rounded-lg text-[13px] font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors disabled:opacity-50">{isDeleting ? (isRTL ? "جاري..." : "Deleting...") : (isRTL ? "حذف" : "Delete")}</button>
 <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg text-[13px] font-medium text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">{isRTL ? "إلغاء" : "Cancel"}</button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Episode Manager Panel */}
 <AnimatePresence>
 {showEpisodes && epAnimeId !== null && (
 <EpisodeManager
 animeId={epAnimeId}
 animeTitle={epAnimeTitle}
 onClose={() => setShowEpisodes(false)}
 isRTL={isRTL}
 />
 )}
 </AnimatePresence>
 </AdminLayout>
 );
}

/* ── Admin Episode Manager (standalone tab) ── */
function AdminEpisodeManager({ isRTL }: { isRTL: boolean }) {
 const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
 const [selectedAnimeTitle, setSelectedAnimeTitle] = useState("");
 const animeListQuery = trpc.anime.list.useQuery({ limit: 100 }, { retry: false });

 const handleAnimeSelect = (id: number | null, anime?: { id: number; title: string; image?: string; episodes?: number }) => {
   setSelectedAnimeId(id);
   if (anime) setSelectedAnimeTitle(anime.title);
 };

 return (
 <div>
 {/* Advanced Anime Search Selector */}
 <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
 <label className="text-[12px] mb-2 block" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "اختر الأنمي" : "Select Anime"}</label>
 {animeListQuery.isLoading ? (
 <div className="h-12 rounded-xl bg-[rgba(255,255,255,0.03)] animate-pulse" />
 ) : (
 <AnimeSearch
 value={selectedAnimeId}
 onChange={handleAnimeSelect}
 isRTL={isRTL}
 placeholder={isRTL ? "ابحث عن أنمي..." : "Type to search anime..."}
 />
 )}
 </div>

 {selectedAnimeId !== null ? (
 <EpisodeManagerInline animeId={selectedAnimeId} animeTitle={selectedAnimeTitle} isRTL={isRTL} />
 ) : (
 <div className="text-center py-16 rounded-xl" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
 <Play className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--nv-text-dim)" }} />
 <p className="text-[14px]" style={{ color: "var(--nv-text-muted)" }}>{isRTL ? "اختر أنمي لإدارة حلقاته" : "Select an anime to manage its episodes"}</p>
 </div>
 )}
 </div>
 );
}

/* ── Inline Episode Manager (no modal) ── */
function EpisodeManagerInline({ animeId, animeTitle, isRTL }: {
 animeId: number;
 animeTitle: string;
 isRTL: boolean;
}) {
 const addToast = useUIStore((s) => s.addToast);
 const [epForm, setEpForm] = useState({ number: 1, title: "", videoUrl: "", thumbnail: "", duration: 24, isFiller: false });
 const [showEpForm, setShowEpForm] = useState(false);

 const utils = trpc.useUtils();
 const epsQuery = trpc.episodes.list.useQuery({ animeId }, { retry: false });
 const createEp = trpc.episodes.create.useMutation({
 onSuccess: () => {
 utils.episodes.list.invalidate({ animeId });
 addToast({ message: isRTL ? "تمت إضافة الحلقة" : "Episode added", type: "success" });
 setShowEpForm(false);
 setEpForm({ number: 1, title: "", videoUrl: "", thumbnail: "", duration: 24, isFiller: false });
 },
 onError: (err) => addToast({ message: err.message, type: "error" }),
 });
 const deleteEp = trpc.episodes.delete.useMutation({
 onSuccess: () => {
 utils.episodes.list.invalidate({ animeId });
 addToast({ message: isRTL ? "تم حذف الحلقة" : "Episode deleted", type: "success" });
 },
 onError: (err) => addToast({ message: err.message, type: "error" }),
 });
 const eps: any[] = epsQuery.data || [];

 const handleAdd = () => {
 createEp.mutate({
 animeId,
 number: epForm.number,
 title: epForm.title,
 videoUrl: epForm.videoUrl || undefined,
 thumbnail: epForm.thumbnail || undefined,
 duration: epForm.duration,
 isFiller: epForm.isFiller,
 });
 };

 return (
 <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-[16px] font-bold flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}><Film className="w-5 h-5 text-[#D4AF37]" />{animeTitle}</h3>
 <p className="text-[11px] text-[#555]">{eps.length} {isRTL ? "حلقة" : "episodes"}</p>
 </div>
 {!showEpForm && (
 <button onClick={() => { setEpForm({ number: eps.length + 1, title: "", videoUrl: "", thumbnail: "", duration: 24, isFiller: false }); setShowEpForm(true); }}
 className="flex items-center gap-2 px-4 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all"
 style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
 <Plus className="w-4 h-4" />{isRTL ? "إضافة حلقة" : "Add Episode"}
 </button>
 )}
 </div>

 {showEpForm && (
 <motion.div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
 initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
 <div className="grid grid-cols-2 gap-3 mb-3">
 <div>
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "رقم الحلقة" : "Episode #"}</label>
 <input type="number" value={epForm.number} onChange={(e) => setEpForm({ ...epForm, number: Number(e.target.value) })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 <div>
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "المدة (دقيقة)" : "Duration (min)"}</label>
 <input type="number" value={epForm.duration} onChange={(e) => setEpForm({ ...epForm, duration: Number(e.target.value) })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 </div>
 <div className="mb-3">
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "عنوان الحلقة" : "Episode Title"}</label>
 <input type="text" value={epForm.title} onChange={(e) => setEpForm({ ...epForm, title: e.target.value })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 <div className="mb-3">
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "رابط الفيديو" : "Video URL"}</label>
 <input type="text" value={epForm.videoUrl} onChange={(e) => setEpForm({ ...epForm, videoUrl: e.target.value })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 <div className="flex items-center gap-3 mb-3">
 <label className="text-[12px] text-[#ccc]">{isRTL ? "فiller" : "Filler"}</label>
 <button onClick={() => setEpForm({ ...epForm, isFiller: !epForm.isFiller })}
 className="relative w-10 h-5 rounded-full transition-colors" style={{ background: epForm.isFiller ? "linear-gradient(135deg, #D4AF37, #F0D878)" : "rgba(255,255,255,0.08)" }}>
 <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow" style={{ transform: epForm.isFiller ? "translateX(22px)" : "translateX(2px)" }} />
 </button>
 </div>
 <div className="flex gap-2">
 <button onClick={handleAdd} disabled={createEp.isPending || !epForm.title.trim()}
 className="flex-1 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
 style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>{createEp.isPending ? (isRTL ? "جاري..." : "Adding...") : (isRTL ? "إضافة" : "Add")}</button>
 <button onClick={() => setShowEpForm(false)} className="flex-1 h-9 rounded-lg text-[12px] font-medium text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">{isRTL ? "إلغاء" : "Cancel"}</button>
 </div>
 </motion.div>
 )}

 <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
 {epsQuery.isLoading ? (
 Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-[rgba(255,255,255,0.03)] animate-pulse" />)
 ) : eps.length === 0 ? (
 <div className="text-center py-10">
 <Play className="w-10 h-10 text-[#333] mx-auto mb-2" />
 <p className="text-[13px] text-[#555]">{isRTL ? "لا توجد حلقات بعد" : "No episodes yet"}</p>
 </div>
 ) : (
 eps.map((ep: any) => (
 <motion.div key={ep.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
 style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold text-[#D4AF37] flex-shrink-0"
 style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
 {ep.number}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span className="text-[13px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{ep.title || `${isRTL ? "حلقة" : "Ep"} ${ep.number}`}</span>
 {ep.isFiller === 1 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]">FILLER</span>}
 </div>
 <div className="flex items-center gap-3 text-[10px] text-[#555]">
 <span className="flex items-center gap-1"><Hash className="w-2.5 h-2.5" />{ep.number}</span>
 {ep.duration && <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{ep.duration}m</span>}
 {ep.videoUrl && <span className="flex items-center gap-1 text-[#22c55e]"><Play className="w-2.5 h-2.5" />{isRTL ? "جاهز" : "Ready"}</span>}
 </div>
 </div>
 <button onClick={() => deleteEp.mutate({ id: ep.id })} disabled={deleteEp.isPending}
 className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all opacity-0 group-hover:opacity-100">
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 ))
 )}
 </div>
 </div>
 );
}

/* ── Episode Manager Sub-Component (modal version) ── */
function EpisodeManager({ animeId: initialAnimeId, animeTitle: initialAnimeTitle, onClose, isRTL }: {
 animeId: number;
 animeTitle: string;
 onClose: () => void;
 isRTL: boolean;
}) {
 const addToast = useUIStore((s) => s.addToast);
 const [animeId, setAnimeId] = useState(initialAnimeId);
 const [animeTitle, setAnimeTitle] = useState(initialAnimeTitle);
 const [epForm, setEpForm] = useState({ number: 1, title: "", videoUrl: "", thumbnail: "", duration: 24, isFiller: false });
 const [editingEp, setEditingEp] = useState<number | null>(null);
 const [showEpForm, setShowEpForm] = useState(false);
 const [showAnimeSearch, setShowAnimeSearch] = useState(false);

 // tRPC
 const utils = trpc.useUtils();
 const epsQuery = trpc.episodes.list.useQuery({ animeId }, { retry: false });
 const createEp = trpc.episodes.create.useMutation({
 onSuccess: () => {
 utils.episodes.list.invalidate({ animeId });
 addToast({ message: isRTL ? "تمت إضافة الحلقة" : "Episode added", type: "success" });
 setShowEpForm(false);
 setEpForm({ number: 1, title: "", videoUrl: "", thumbnail: "", duration: 24, isFiller: false });
 },
 onError: (err) => addToast({ message: err.message, type: "error" }),
 });
 const deleteEp = trpc.episodes.delete.useMutation({
 onSuccess: () => {
 utils.episodes.list.invalidate({ animeId });
 addToast({ message: isRTL ? "تم حذف الحلقة" : "Episode deleted", type: "success" });
 },
 onError: (err) => addToast({ message: err.message, type: "error" }),
 });

 const eps: any[] = epsQuery.data || [];

 const handleAnimeSwitch = (id: number | null, anime?: { id: number; title: string }) => {
   if (id !== null && anime) {
     setAnimeId(id);
     setAnimeTitle(anime.title);
     setShowAnimeSearch(false);
     setShowEpForm(false);
   }
 };

 const handleEpSave = () => {
 createEp.mutate({
 animeId,
 number: epForm.number,
 title: epForm.title,
 videoUrl: epForm.videoUrl || undefined,
 thumbnail: epForm.thumbnail || undefined,
 duration: epForm.duration,
 isFiller: epForm.isFiller,
 });
 };

 return (
 <motion.div className="fixed inset-0 z-[65] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 <div className="absolute inset-0 bg-black/70" onClick={onClose} />
 <motion.div className="relative w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-2xl p-6"
 style={{ background: "linear-gradient(180deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
 initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
 <div className="flex items-center justify-between mb-6">
 <div className="flex-1 min-w-0">
 <h2 className="text-[18px] font-bold text-white flex items-center gap-2"><Film className="w-5 h-5 text-[#D4AF37]" />{isRTL ? "الحلقات" : "Episodes"}</h2>
 {/* Anime switcher */}
 {showAnimeSearch ? (
 <div className="mt-2" onClick={(e) => e.stopPropagation()}>
 <AnimeSearch value={animeId} onChange={handleAnimeSwitch} isRTL={isRTL} placeholder={isRTL ? "ابحث عن أنمي..." : "Switch anime..."} />
 </div>
 ) : (
 <button onClick={() => setShowAnimeSearch(true)} className="text-[11px] mt-0.5 flex items-center gap-1 hover:text-[#D4AF37] transition-colors" style={{ color: "var(--nv-text-muted)" }}>
 {animeTitle}
 <span className="text-[9px] px-1.5 py-0.5 rounded-full ml-1" style={{ background: "rgba(212,175,55,0.08)", color: "var(--nv-gold)" }}>{isRTL ? "تبديل" : "Switch"}</span>
 </button>
 )}
 </div>
 <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[var(--nv-text-primary)] hover:bg-[var(--nv-bg-card-hover)] transition-colors flex-shrink-0"><X className="w-4 h-4" /></button>
 </div>

 {/* Add Episode Button */}
 {!showEpForm && (
 <button onClick={() => { setEditingEp(null); setEpForm({ number: eps.length + 1, title: "", videoUrl: "", thumbnail: "", duration: 24, isFiller: false }); setShowEpForm(true); }}
 className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-medium text-[#0a0a0a] mb-4 hover:brightness-110 transition-all"
 style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
 <Plus className="w-4 h-4" />{isRTL ? "إضافة حلقة" : "Add Episode"}
 </button>
 )}

 {/* Episode Form */}
 {showEpForm && (
 <motion.div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
 initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
 <div className="grid grid-cols-2 gap-3 mb-3">
 <div>
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "رقم الحلقة" : "Episode #"}</label>
 <input type="number" value={epForm.number} onChange={(e) => setEpForm({ ...epForm, number: Number(e.target.value) })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 <div>
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "المدة (دقيقة)" : "Duration (min)"}</label>
 <input type="number" value={epForm.duration} onChange={(e) => setEpForm({ ...epForm, duration: Number(e.target.value) })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 </div>
 <div className="mb-3">
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "عنوان الحلقة" : "Episode Title"}</label>
 <input type="text" value={epForm.title} onChange={(e) => setEpForm({ ...epForm, title: e.target.value })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 <div className="mb-3">
 <label className="text-[11px] text-[#888] mb-1 block">{isRTL ? "رابط الفيديو" : "Video URL"}</label>
 <input type="text" value={epForm.videoUrl} onChange={(e) => setEpForm({ ...epForm, videoUrl: e.target.value })}
 className="w-full h-9 rounded-lg text-[13px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] outline-none px-3" />
 </div>
 <div className="flex items-center gap-3 mb-3">
 <label className="text-[12px] text-[#ccc]">{isRTL ? "حلقة فiller" : "Filler Episode"}</label>
 <button onClick={() => setEpForm({ ...epForm, isFiller: !epForm.isFiller })}
 className="relative w-10 h-5 rounded-full transition-colors" style={{ background: epForm.isFiller ? "linear-gradient(135deg, #D4AF37, #F0D878)" : "rgba(255,255,255,0.08)" }}>
 <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow" style={{ transform: epForm.isFiller ? "translateX(22px)" : "translateX(2px)" }} />
 </button>
 </div>
 <div className="flex gap-2">
 <button onClick={handleEpSave} disabled={createEp.isPending || !epForm.title.trim()}
 className="flex-1 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
 style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>{createEp.isPending ? (isRTL ? "جاري..." : "Adding...") : (isRTL ? "إضافة" : "Add")}</button>
 <button onClick={() => setShowEpForm(false)} className="flex-1 h-9 rounded-lg text-[12px] font-medium text-[#888] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">{isRTL ? "إلغاء" : "Cancel"}</button>
 </div>
 </motion.div>
 )}

 {/* Episode List */}
 <div className="space-y-2">
 {epsQuery.isLoading ? (
 Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-[rgba(255,255,255,0.03)] animate-pulse" />)
 ) : eps.length === 0 ? (
 <div className="text-center py-10">
 <Play className="w-10 h-10 text-[#333] mx-auto mb-2" />
 <p className="text-[13px] text-[#555]">{isRTL ? "لا توجد حلقات" : "No episodes yet"}</p>
 <p className="text-[11px] text-[#444]">{isRTL ? "أضف الحلقة الأولى" : "Add the first episode above"}</p>
 </div>
 ) : (
 eps.map((ep: any) => (
 <motion.div key={ep.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
 style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold text-[#D4AF37] flex-shrink-0"
 style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
 <Hash className="w-3.5 h-3.5" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span className="text-[13px] text-white font-medium">{ep.title || `${isRTL ? "حلقة" : "Episode"} ${ep.number}`}</span>
 {ep.isFiller === 1 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]">{isRTL ? "فiller" : "FILLER"}</span>}
 </div>
 <div className="flex items-center gap-3 text-[10px] text-[#555]">
 <span className="flex items-center gap-1"><Hash className="w-2.5 h-2.5" />{ep.number}</span>
 {ep.duration && <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{ep.duration}m</span>}
 {ep.videoUrl && <span className="flex items-center gap-1 text-[#22c55e]"><Play className="w-2.5 h-2.5" />{isRTL ? "جاهز" : "Ready"}</span>}
 </div>
 </div>
 <button onClick={() => deleteEp.mutate({ id: ep.id })} disabled={deleteEp.isPending}
 className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all opacity-0 group-hover:opacity-100">
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 ))
 )}
 </div>

 <p className="text-[11px] text-[#444] text-center mt-4">{eps.length} {isRTL ? "حلقة" : "episodes"}</p>
 </motion.div>
 </motion.div>
 );
}
