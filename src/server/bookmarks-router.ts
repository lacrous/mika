import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { bookmarks } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and } from "drizzle-orm";

export const bookmarksRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(bookmarks).where(eq(bookmarks.userId, ctx.localUser!.id)).orderBy(desc(bookmarks.createdAt));
  }),

  create: authedQuery
    .input(z.object({ animeId: z.number(), animeTitle: z.string(), animeImage: z.string().optional(), note: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db.select().from(bookmarks)
        .where(and(eq(bookmarks.userId, ctx.localUser!.id), eq(bookmarks.animeId, input.animeId))).limit(1);
      if (existing.length > 0) return { success: false, message: "Already bookmarked" };
      await db.insert(bookmarks).values({
        userId: ctx.localUser!.id,
        animeId: input.animeId,
        animeTitle: input.animeTitle,
        animeImage: input.animeImage || null,
        note: input.note || null,
      });
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(bookmarks).where(and(eq(bookmarks.id, input.id), eq(bookmarks.userId, ctx.localUser!.id)));
      return { success: true };
    }),
});
