import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { analyticsDaily, watchHistory, reviews, favorites, users, localUsers } from "@db/schema";
import { getDb } from "./queries/connection";
import { desc, sql, gte } from "drizzle-orm";

export const analyticsRouter = createRouter({
  /* ── Daily stats ── */
  daily: adminQuery
    .input(z.object({ days: z.number().int().optional().default(30) }))
    .query(async ({ input }) => {
      const db = getDb();
      const days = input?.days || 30;
      return db.select().from(analyticsDaily).orderBy(desc(analyticsDaily.date)).limit(days);
    }),

  /* ── Overview stats ── */
  overview: adminQuery.query(async () => {
    const db = getDb();
    const [totalWatchTime] = await db.select({ total: sql<number>`coalesce(sum(${watchHistory.progress}), 0)` }).from(watchHistory);
    const [totalReviews] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
      const [totalFavorites] = await db.select({ count: sql<number>`count(*)` }).from(favorites);
      const [totalOAuth] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const [totalLocal] = await db.select({ count: sql<number>`count(*)` }).from(localUsers);
    const [todayViews] = await db.select({ views: sql<number>`coalesce(sum(page_views), 0)` }).from(analyticsDaily)
      .where(gte(analyticsDaily.date, new Date(Date.now() - 86400000)));

    return {
      totalWatchTime: totalWatchTime?.total || 0,
      totalReviews: totalReviews?.count || 0,
      totalFavorites: totalFavorites?.count || 0,
      totalUsers: (totalOAuth?.count || 0) + (totalLocal?.count || 0),
      todayViews: todayViews?.views || 0,
    };
  }),

  /* ── Top anime by watch time ── */
  topAnime: adminQuery
    .input(z.object({ limit: z.number().int().optional().default(10) }))
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit || 10;
      return db.select({
        animeTitle: watchHistory.animeTitle,
        totalWatch: sql<number>`sum(${watchHistory.progress})`,
        episodes: sql<number>`count(*)`,
      }).from(watchHistory).groupBy(watchHistory.animeTitle).orderBy(desc(sql`sum(${watchHistory.progress})`)).limit(limit);
    }),

  /* ── Log daily stats (called by cron or admin) ── */
  logDay: adminQuery
    .input(z.object({
      date: z.string(),
      activeUsers: z.number().optional(),
      newUsers: z.number().optional(),
      totalWatchTime: z.number().optional(),
      episodesWatched: z.number().optional(),
      reviewsPosted: z.number().optional(),
      favoritesAdded: z.number().optional(),
      pageViews: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(analyticsDaily).values({
        date: new Date(input.date),
        activeUsers: input.activeUsers || 0,
        newUsers: input.newUsers || 0,
        totalWatchTime: input.totalWatchTime || 0,
        episodesWatched: input.episodesWatched || 0,
        reviewsPosted: input.reviewsPosted || 0,
        favoritesAdded: input.favoritesAdded || 0,
        pageViews: input.pageViews || 0,
      });
      return { success: true };
    }),
});
