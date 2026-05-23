import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { comments, commentLikes } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and, isNull, sql } from "drizzle-orm";

export const commentsRouter = createRouter({
  /* ── Get comments for an anime (top-level + replies) ── */
  list: publicQuery
    .input(z.object({ animeId: z.number(), sort: z.enum(["newest", "top"]).optional().default("top") }))
    .query(async ({ input }) => {
      const db = getDb();
      const orderBy = input.sort === "newest" ? desc(comments.createdAt) : desc(comments.likes);
      const allComments = await db.select().from(comments)
        .where(eq(comments.animeId, input.animeId))
        .orderBy(orderBy);

      // Build tree: separate top-level from replies
      const topLevel = allComments.filter((c) => !c.parentId);
      const replies = allComments.filter((c) => c.parentId);

      return topLevel.map((parent) => ({
        ...parent,
        replies: replies.filter((r) => r.parentId === parent.id),
      }));
    }),

  /* ── Create a comment ── */
  create: authedQuery
    .input(z.object({
      animeId: z.number(),
      content: z.string().min(1).max(2000),
      parentId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(comments).values({
        animeId: input.animeId,
        userId: ctx.localUser!.id,
        userName: ctx.localUser!.name,
        userAvatar: (ctx.localUser as any)?.avatar || null,
        content: input.content,
        parentId: input.parentId || null,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Like a comment ── */
  like: authedQuery
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db.select().from(commentLikes)
        .where(and(eq(commentLikes.commentId, input.commentId), eq(commentLikes.userId, ctx.localUser!.id)))
        .limit(1);
      if (existing.length > 0) return { success: false, message: "Already liked" };

      await db.insert(commentLikes).values({ commentId: input.commentId, userId: ctx.localUser!.id });
      await db.update(comments).set({ likes: sql`${comments.likes} + 1` }).where(eq(comments.id, input.commentId));
      return { success: true };
    }),

  /* ── Unlike a comment ── */
  unlike: authedQuery
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(commentLikes).where(
        and(eq(commentLikes.commentId, input.commentId), eq(commentLikes.userId, ctx.localUser!.id))
      );
      await db.update(comments).set({ likes: sql`greatest(0, ${comments.likes} - 1)` }).where(eq(comments.id, input.commentId));
      return { success: true };
    }),

  /* ── Delete own comment ── */
  delete: authedQuery
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(comments).where(
        and(eq(comments.id, input.commentId), eq(comments.userId, ctx.localUser!.id))
      );
      return { success: true };
    }),

  /* ── Admin: pin/unpin ── */
  pin: authedQuery
    .input(z.object({ commentId: z.number(), pinned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if ((ctx.localUser as any)?.role !== "admin") throw new Error("Unauthorized");
      const db = getDb();
      await db.update(comments).set({ isPinned: input.pinned ? 1 : 0 }).where(eq(comments.id, input.commentId));
      return { success: true };
    }),
});
