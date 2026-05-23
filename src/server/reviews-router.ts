import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { reviews } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, and, desc, sql } from "drizzle-orm";

export const reviewsRouter = createRouter({
  /* ── List all reviews for an anime ── */
  list: publicQuery
    .input(z.object({ animeId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(reviews)
        .where(and(eq(reviews.animeId, input.animeId), eq(reviews.isApproved, "approved")))
        .orderBy(desc(reviews.createdAt));
    }),

  /* ── Stats for an anime ── */
  stats: publicQuery
    .input(z.object({ animeId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [result] = await db.select({
        count: sql<number>`count(*)`,
        average: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
      }).from(reviews).where(and(eq(reviews.animeId, input.animeId), eq(reviews.isApproved, "approved")));

      const distribution = await db.select({
        rating: reviews.rating,
        count: sql<number>`count(*)`,
      }).from(reviews).where(and(eq(reviews.animeId, input.animeId), eq(reviews.isApproved, "approved")))
        .groupBy(reviews.rating).orderBy(reviews.rating);

      return {
        count: result?.count || 0,
        average: Number((result?.average || 0).toFixed(1)),
        distribution,
      };
    }),

  /* ── Get current user's review for an anime ── */
  myReview: publicQuery
    .input(z.object({ animeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) return null;
      const db = getDb();
      const result = await db.select().from(reviews)
        .where(and(eq(reviews.userId, userId), eq(reviews.animeId, input.animeId)))
        .limit(1);
      return result[0] || null;
    }),

  /* ── Create or update a review ── */
  create: publicQuery
    .input(z.object({
      animeId: z.string(),
      animeTitle: z.string(),
      rating: z.number().int().min(1).max(10),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("Not authenticated");
      const db = getDb();
      const existing = await db.select().from(reviews)
        .where(and(eq(reviews.userId, user.id), eq(reviews.animeId, input.animeId)))
        .limit(1);
      if (existing.length > 0) {
        await db.update(reviews).set({
          rating: input.rating,
          content: input.content,
          userName: user.name,
          userAvatar: user.avatar,
          updatedAt: new Date(),
        }).where(eq(reviews.id, existing[0].id));
        return { success: true, message: "Review updated" };
      }
      await db.insert(reviews).values({
        userId: user.id,
        userType: user.unionId?.startsWith("local_") ? "local" : "oauth",
        userName: user.name,
        userAvatar: user.avatar,
        animeId: input.animeId,
        animeTitle: input.animeTitle,
        rating: input.rating,
        content: input.content,
      });
      return { success: true, message: "Review posted" };
    }),

  /* ── Delete own review ── */
  delete: publicQuery
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const db = getDb();
      await db.delete(reviews).where(and(eq(reviews.id, input.reviewId), eq(reviews.userId, userId)));
      return { success: true, message: "Review deleted" };
    }),

  /* ── Mark helpful ── */
  helpful: publicQuery
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(reviews)
        .set({ helpfulCount: sql`${reviews.helpfulCount} + 1` })
        .where(eq(reviews.id, input.reviewId));
      return { success: true };
    }),
});
