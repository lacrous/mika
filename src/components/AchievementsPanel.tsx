import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface AchievementsPanelProps {
  isRTL?: boolean;
}

export function AchievementsPanel({ isRTL = false }: AchievementsPanelProps) {
  const checkQuery = trpc.achievements.check.useQuery(undefined, { retry: false });
  const defsQuery = trpc.achievements.allDefs.useQuery(undefined, { retry: false });

  const earned = checkQuery.data?.earned || [];
  const allBadges = defsQuery.data || [];
  const earnedKeys = new Set(earned.map((e: any) => e.badgeKey));

  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }} dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
        <Award className="w-4 h-4" style={{ color: "var(--nv-gold)" }} />
        {isRTL ? "الإنجازات" : "Achievements"} {earned.length}/{allBadges.length}
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {allBadges.map((badge: any) => {
          const isEarned = earnedKeys.has(badge.key);
          return (
            <motion.div key={badge.key} className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              style={{
                opacity: isEarned ? 1 : 0.4,
                background: isEarned ? "rgba(212,175,55,0.05)" : "transparent",
              }}
              whileHover={{ scale: 1.05 }}
              title={`${badge.name}: ${badge.desc}${isEarned ? "" : " (Locked)"}`}>
              <span className="text-[20px]">{isEarned ? badge.icon : <Lock className="w-4 h-4" style={{ color: "var(--nv-text-dim)" }} />}</span>
              <span className="text-[8px] text-center leading-tight" style={{ color: isEarned ? badge.color : "var(--nv-text-dim)" }}>{badge.name}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
