import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, List } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";

export function MangaReaderPage() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const { isRTL } = useLanguage();
  const [chapterNum, setChapterNum] = useState(1);
  const [pageIdx, setPageIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showChapters, setShowChapters] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const seriesQuery = trpc.manga.byId.useQuery({ id: Number(seriesId) || 0 }, { enabled: !!seriesId, retry: false });
  const series = seriesQuery.data as any;
  const currentChapter = series?.chapters?.find((c: any) => c.number === chapterNum);
  const pages = (currentChapter?.pages || []) as string[];

  const nextPage = () => { if (pageIdx < pages.length - 1) setPageIdx(p => p + 1); };
  const prevPage = () => { if (pageIdx > 0) setPageIdx(p => p - 1); };

  // Keyboard navigation
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") isRTL ? prevPage() : nextPage();
      if (e.key === "ArrowLeft") isRTL ? nextPage() : prevPage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a1a" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 h-12 border-b border-white/5 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{series?.title}</h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>Ch {chapterNum}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"><ZoomOut className="w-3.5 h-3.5" style={{ color: "var(--nv-text-muted)" }} /></button>
          <span className="text-[10px] w-8 text-center" style={{ color: "var(--nv-text-muted)" }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"><ZoomIn className="w-3.5 h-3.5" style={{ color: "var(--nv-text-muted)" }} /></button>
          <button onClick={() => setShowChapters(!showChapters)} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"><List className="w-3.5 h-3.5" style={{ color: "var(--nv-text-muted)" }} /></button>
        </div>
      </div>

      {/* Chapter Sidebar */}
      <AnimatePresence>
        {showChapters && (
          <motion.div className="absolute top-12 bottom-0 z-20 w-48 overflow-y-auto border-r border-white/5" style={{ background: "#141414" }}
            initial={{ x: isRTL ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: isRTL ? "100%" : "-100%" }}>
            {(series?.chapters || []).map((ch: any) => (
              <button key={ch.id} onClick={() => { setChapterNum(ch.number); setPageIdx(0); setShowChapters(false); }}
                className={`w-full text-left px-3 py-2 text-[11px] transition-colors ${chapterNum === ch.number ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]" : "text-[#888] hover:bg-white/5"}`}>
                Ch {ch.number}: {ch.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Viewer */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden" ref={containerRef}>
        {pages.length > 0 ? (
          <>
            <motion.img src={pages[pageIdx]} alt={`Page ${pageIdx + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={`${chapterNum}-${pageIdx}`} />
            {/* Navigation overlays */}
            <div className={`absolute inset-y-0 left-0 w-1/4 cursor-pointer ${isRTL ? "" : ""}`} onClick={isRTL ? nextPage : prevPage} />
            <div className={`absolute inset-y-0 right-0 w-1/4 cursor-pointer`} onClick={isRTL ? prevPage : nextPage} />
          </>
        ) : (
          <p className="text-[13px]" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد صفحات" : "No pages available"}</p>
        )}

        {/* Page counter */}
        {pages.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-mono" style={{ background: "rgba(0,0,0,0.7)", color: "#fff" }}>
            {pageIdx + 1} / {pages.length}
          </div>
        )}
      </div>
    </div>
  );
}
