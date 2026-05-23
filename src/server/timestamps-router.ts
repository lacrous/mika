import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { watchTimestamps } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, and, desc } from "drizzle-orm";

export const timestampsRouter = createRouter({
  get: authedQuery
    .input(z.object({ episodeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db.select().from(watchTimestamps)
        .where(and(eq(watchTimestamps.userId, ctx.localUser!.id), eq(watchTimestamps.episodeId, input.episodeId)))
        .limit(1);
      return rows[0]?.timestamp || 0;
    }),

  save: authedQuery
    .input(z.object({
      animeId: z.number(),
      episodeId: z.number(),
      timestamp: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db.select().from(watchTimestamps)
        .where(and(eq(watchTimestamps.userId, ctx.localUser!.id), eq(watchTimestamps.episodeId, input.episodeId)))
        .limit(1);
      if (existing.length > 0) {
        await db.update(watchTimestamps)
          .set({ timestamp: input.timestamp, updatedAt: new Date() })
          .where(eq(watchTimestamps.id, existing[0].id));
      } else {
        await db.insert(watchTimestamps).values({
          userId: ctx.localUser!.id,
          animeId: input.animeId,
          episodeId: input.episodeId,
          timestamp: input.timestamp,
        });
      }
      return { success: true };
    }),

  getAll: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(watchTimestamps)
      .where(eq(watchTimestamps.userId, ctx.localUser!.id))
      .orderBy(desc(watchTimestamps.updatedAt));
  }),
});
