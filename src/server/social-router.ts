import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { userFollows, userActivities } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and, sql } from "drizzle-orm";

export const socialRouter = createRouter({
  /* ── Follow a user ── */
  follow: authedQuery
    .input(z.object({ followingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      try {
        await db.insert(userFollows).values({ followerId: ctx.localUser!.id, followingId: input.followingId });
      } catch { /* Already following */ }
      return { success: true };
    }),

  /* ── Unfollow ── */
  unfollow: authedQuery
    .input(z.object({ followingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(userFollows).where(
        and(eq(userFollows.followerId, ctx.localUser!.id), eq(userFollows.followingId, input.followingId))
      );
      return { success: true };
    }),

  /* ── Get followers count ── */
  followers: authedQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [result] = await db.select({ count: sql<number>`count(*)` }).from(userFollows).where(eq(userFollows.followingId, input.userId));
      return result?.count || 0;
    }),

  /* ── Get following count ── */
  following: authedQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [result] = await db.select({ count: sql<number>`count(*)` }).from(userFollows).where(eq(userFollows.followerId, input.userId));
      return result?.count || 0;
    }),

  /* ── Check if following ── */
  isFollowing: authedQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db.select().from(userFollows)
        .where(and(eq(userFollows.followerId, ctx.localUser!.id), eq(userFollows.followingId, input.userId)))
        .limit(1);
      return rows.length > 0;
    }),

  /* ── Activity feed (following + own) ── */
  feed: authedQuery
    .input(z.object({ limit: z.number().int().min(1).max(50).optional().default(20) }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      // Get IDs of users we follow
      const follows = await db.select().from(userFollows).where(eq(userFollows.followerId, ctx.localUser!.id));
      const ids = [ctx.localUser!.id, ...follows.map((f) => f.followingId)];
      if (ids.length === 0) return [];
      return db.select().from(userActivities)
        .where(sql`${userActivities.userId} IN (${ids.join(",")})`)
        .orderBy(desc(userActivities.createdAt))
        .limit(input.limit);
    }),

  /* ── Log activity ── */
  logActivity: authedQuery
    .input(z.object({
      type: z.string(),
      animeId: z.number().optional(),
      animeTitle: z.string().optional(),
      episodeNumber: z.number().optional(),
      content: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.insert(userActivities).values({
        userId: ctx.localUser!.id,
        userName: ctx.localUser!.name,
        type: input.type,
        animeId: input.animeId || null,
        animeTitle: input.animeTitle || null,
        episodeNumber: input.episodeNumber || null,
        content: input.content || null,
      });
      return { success: true };
    }),
});
