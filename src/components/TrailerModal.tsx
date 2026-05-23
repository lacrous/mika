import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface TrailerModalProps {
  trailerUrl?: string | null;
  title: string;
  isRTL?: boolean;
}

export function TrailerModal({ trailerUrl, title, isRTL = false }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  };

  const videoId = trailerUrl ? getYouTubeId(trailerUrl) : null;
  if (!videoId) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:brightness-110"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--nv-text-primary)" }}
      >
        <Play className="w-4 h-4 fill-[#D4AF37]" style={{ color: "#D4AF37" }} />
        {isRTL ? "شاهد الإعلان" : "Watch Trailer"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80" onClick={() => setIsOpen(false)} />
            <motion.div className="relative w-full max-w-4xl rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: "#000" }}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                <X className="w-4 h-4" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={`${title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
