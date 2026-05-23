import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FolderHeart, Plus, Lock, Globe, Trash2, Film, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

export function CollectionsPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPublic, setNewPublic] = useState(true);

  const utils = trpc.useUtils();
  const myCollections = trpc.collections.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const publicCollections = trpc.collections.public.useQuery(undefined, { retry: false });
  const createCol = trpc.collections.create.useMutation({
    onSuccess: () => { utils.collections.list.invalidate(); setShowCreate(false); setNewTitle(""); setNewDesc(""); },
  });
  const deleteCol = trpc.collections.delete.useMutation({
    onSuccess: () => utils.collections.list.invalidate(),
  });

  const mine = myCollections.data || [];
  const public_ = publicCollections.data || [];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[24px] font-bold" style={{ color: "var(--nv-text-primary)" }}>
            <FolderHeart className="w-6 h-6 inline mr-2" style={{ color: "var(--nv-gold)" }} />
            {isRTL ? "المجموعات" : "Collections"}
          </h1>
          {isAuthenticated && (
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 h-9 rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
              <Plus className="w-4 h-4" />{isRTL ? "مجموعة جديدة" : "New Collection"}
            </button>
          )}
        </motion.div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreate && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowCreate(false)} />
              <motion.div className="relative w-full max-w-md rounded-xl p-6" style={{ background: "var(--nv-bg-secondary)", border: "1px solid rgba(255,255,255,0.08)" }}
                initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h3 className="text-[16px] font-bold" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "مجموعة جديدة" : "New Collection"}</h3>
                  <button onClick={() => setShowCreate(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--nv-text-dim)" }}><X className="w-4 h-4" /></button>
                </div>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={isRTL ? "العنوان" : "Title"}
                  className="w-full h-10 rounded-lg text-[13px] px-3 mb-3 admin-input" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder={isRTL ? "الوصف (اختياري)" : "Description (optional)"}
                  className="w-full h-20 rounded-lg text-[13px] px-3 py-2 mb-3 admin-input resize-none" />
                <label className={`flex items-center gap-2 mb-4 text-[12px] ${isRTL ? "flex-row-reverse" : ""}`} style={{ color: "var(--nv-text-muted)" }}>
                  <input type="checkbox" checked={newPublic} onChange={(e) => setNewPublic(e.target.checked)} className="accent-[#D4AF37]" />
                  {isRTL ? "عام (الجميع يمكنه الرؤية)" : "Public (everyone can see)"}
                </label>
                <button onClick={() => { if (newTitle.trim()) createCol.mutate({ title: newTitle.trim(), description: newDesc, isPublic: newPublic }); }}
                  disabled={!newTitle.trim() || createCol.isPending}
                  className="w-full h-10 rounded-lg text-[13px] font-medium text-[#0a0a0a] hover:brightness-110 transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
                  {createCol.isPending ? (isRTL ? "جاري..." : "Creating...") : (isRTL ? "إنشاء" : "Create")}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Collections */}
        {isAuthenticated && mine.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[16px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "مجموعاتي" : "My Collections"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mine.map((col: any) => (
                <motion.div key={col.id} className="rounded-xl p-4 cursor-pointer hover:brightness-110 transition-all"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onClick={() => navigate(`/collection/${col.id}`)} whileHover={{ y: -2 }}>
                  <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <h3 className="text-[14px] font-semibold truncate" style={{ color: "var(--nv-text-primary)" }}>{col.title}</h3>
                        {col.isPublic ? <Globe className="w-3 h-3 flex-shrink-0" style={{ color: "var(--nv-text-dim)" }} /> : <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "var(--nv-text-dim)" }} />}
                      </div>
                      {col.description && <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--nv-text-muted)" }}>{col.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--nv-text-dim)" }}><Film className="w-3 h-3" />{col.items?.length || 0} anime</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteCol.mutate({ id: col.id }); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(239,68,68,0.1)] transition-all" style={{ color: "var(--nv-text-dim)" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Public Collections */}
        <div>
          <h2 className="text-[16px] font-semibold mb-3" style={{ color: "var(--nv-text-primary)" }}>{isRTL ? "مجموعات عامة" : "Public Collections"}</h2>
          {public_.length === 0 ? (
            <p className="text-[13px] text-center py-10" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد مجموعات عامة بعد" : "No public collections yet"}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {public_.map((col: any) => (
                <motion.div key={col.id} className="rounded-xl p-4 cursor-pointer hover:brightness-110 transition-all"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onClick={() => navigate(`/collection/${col.id}`)} whileHover={{ y: -2 }}>
                  <h3 className="text-[14px] font-semibold truncate" style={{ color: "var(--nv-text-primary)" }}>{col.title}</h3>
                  {col.description && <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--nv-text-muted)" }}>{col.description}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
