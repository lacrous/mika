import { motion } from "framer-motion";
import { User, Mic } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface CastSectionProps {
  animeId: number;
  isRTL?: boolean;
}

export function CastSection({ animeId, isRTL = false }: CastSectionProps) {
  const castQuery = trpc.cast.list.useQuery({ animeId }, { retry: false });
  const cast = castQuery.data || [];
  const mains = cast.filter((c: any) => c.role === "Main");
  const supporting = cast.filter((c: any) => c.role === "Supporting");

  if (cast.length === 0) return null;

  return (
    <div className="mt-8" dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
        <User className="w-4 h-4" style={{ color: "var(--nv-gold)" }} />
        {isRTL ? "الشخصيات والممثلون" : "Cast & Characters"}
      </h3>

      {mains.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "رئيسية" : "Main Characters"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {mains.map((c: any) => (
              <motion.div key={c.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} whileHover={{ y: -2 }}>
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 border" style={{ borderColor: "rgba(212,175,55,0.2)" }} />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)" }}>
                    <User className="w-5 h-5" style={{ color: "#D4AF37" }} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ color: "var(--nv-text-primary)" }}>{c.name}</p>
                  {c.voiceActor && (
                    <p className="text-[10px] flex items-center gap-1 truncate" style={{ color: "var(--nv-text-muted)" }}>
                      <Mic className="w-2.5 h-2.5" />{c.voiceActor}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
