import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { userAchievements } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc } from "drizzle-orm";

export const BADGE_DEFS = [
  { key: "first_watch", name: "First Watch", icon: "▶️", color: "#22c55e", desc: "Watched your first episode" },
  { key: "streak_3", name: "3-Day Streak", icon: "🔥", color: "#f59e0b", desc: "Watched anime for 3 days straight" },
  { key: "streak_7", name: "Week Warrior", icon: "⚡", color: "#ef4444", desc: "Watched anime for 7 days straight" },
  { key: "streak_30", name: "Monthly Master", icon: "👑", color: "#D4AF37", desc: "Watched anime for 30 days straight" },
  { key: "reviewer", name: "Critic", icon: "✍️", color: "#3b82f6", desc: "Posted your first review" },
  { key: "collector", name: "Collector", icon: "📚", color: "#8b5cf6", desc: "Created your first collection" },
  { key: "socialite", name: "Socialite", icon: "💬", color: "#ec4899", desc: "Posted 10 comments" },
  { key: "marathon", name: "Marathon", icon: "🏃", color: "#14b8a6", desc: "Watched 24 episodes in one day" },
  { key: "early_bird", name: "Early Bird", icon: "🐦", color: "#f97316", desc: "Joined NUROVIA in the first month" },
  { key: "completionist", name: "Completionist", icon: "⭐", color: "#D4AF37", desc: "Completed 10 anime series" },
];

export const achievementsRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db.select().from(userAchievements)
      .where(eq(userAchievements.userId, ctx.localUser!.id))
      .orderBy(desc(userAchievements.createdAt));
    return rows;
  }),

  award: authedQuery
    .input(z.object({ badgeKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const def = BADGE_DEFS.find((b) => b.key === input.badgeKey);
      if (!def) throw new Error("Invalid badge key");

      const existing = await db.select().from(userAchievements)
        .where(eq(userAchievements.userId, ctx.localUser!.id))
        .limit(100);
      if (existing.find((e) => e.badgeKey === input.badgeKey)) {
        return { success: false, message: "Already awarded" };
      }

      await db.insert(userAchievements).values({
        userId: ctx.localUser!.id,
        badgeKey: def.key,
        badgeName: def.name,
        badgeIcon: def.icon,
        badgeColor: def.color,
        description: def.desc,
      });
      return { success: true };
    }),

  check: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db.select().from(userAchievements)
      .where(eq(userAchievements.userId, ctx.localUser!.id));
    const earnedKeys = new Set(rows.map((r) => r.badgeKey));
    return {
      earned: rows,
      available: BADGE_DEFS.filter((b) => !earnedKeys.has(b.key)),
      totalBadges: BADGE_DEFS.length,
    };
  }),

  allDefs: authedQuery.query(() => BADGE_DEFS),
});
