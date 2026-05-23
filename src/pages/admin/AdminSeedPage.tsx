import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Play, Check, AlertTriangle, Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

export function AdminSeedPage() {
  const [result, setResult] = useState<Record<string, number> | null>(null);

  const seedMutation = trpc.seed.run.useMutation({
    onSuccess: (data) => {
      if (data.seeded) {
        setResult(data.seeded);
      }
    },
  });

  const isRunning = seedMutation.isPending;
  const isSuccess = seedMutation.isSuccess;
  const isError = seedMutation.isError;

  return (
    <div className="min-h-screen" style={{ background: "var(--nv-bg-body)", paddingLeft: "clamp(5vw, 8vw, 10vw)", paddingRight: "clamp(5vw, 8vw, 10vw)", paddingTop: 100, paddingBottom: 60 }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)", boxShadow: "0 4px 12px rgba(212, 175, 55, 0.25)" }}>
            <Database className="w-4 h-4 text-[#0a0a0a]" />
          </div>
          <h1 className="text-[22px] font-bold" style={{ color: "var(--nv-text-primary)" }}>Seed Data</h1>
        </div>
        <p className="text-[14px]" style={{ color: "var(--nv-text-dim)" }}>Populate the database with sample anime, episodes, and news articles.</p>
      </div>

      {/* Seed Card */}
      <div className="max-w-lg rounded-2xl p-6 border" style={{ background: "var(--nv-bg-secondary)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
            <Database className="w-5 h-5" style={{ color: "#D4AF37" }} />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>Database Seeder</h3>
            <p className="text-[12px]" style={{ color: "var(--nv-text-dim)" }}>25 anime + episodes + 4 news articles</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--nv-text-muted)" }}>
            <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
            <span>25 popular anime titles with metadata</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--nv-text-muted)" }}>
            <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
            <span>Auto-generated episodes (first ep has video)</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--nv-text-muted)" }}>
            <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
            <span>4 news articles with full content</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--nv-text-muted)" }}>
            <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
            <span>Safe to run multiple times (skips if data exists)</span>
          </div>
        </div>

        <button
          onClick={() => seedMutation.mutate()}
          disabled={isRunning}
          className="w-full h-11 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          style={{
            background: isSuccess ? "rgba(34, 197, 94, 0.15)" : "linear-gradient(135deg, #D4AF37, #F0D878)",
            color: isSuccess ? "#22c55e" : "#0a0a0a",
            boxShadow: isSuccess ? "none" : "0 4px 16px rgba(212, 175, 55, 0.3)",
          }}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Seeding...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Seeded Successfully
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Seeder
            </>
          )}
        </button>

        {isError && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl text-[12px]" style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{seedMutation.error?.message || "An error occurred. Check the database connection."}</span>
          </div>
        )}

        {/* Results */}
        {result && Object.keys(result).length > 0 && (
          <motion.div className="mt-4 p-3 rounded-xl border" style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.1)" }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#D4AF37" }}>Results</p>
            <div className="space-y-1">
              {Object.entries(result).map(([key, count]) => (
                <div key={key} className="flex justify-between text-[13px]">
                  <span style={{ color: "var(--nv-text-muted)" }}>{key}</span>
                  <span className="font-mono font-semibold" style={{ color: "var(--nv-text-primary)" }}>{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
