import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { watchHistory } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, and } from "drizzle-orm";

export const historyRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) return [];
    const db = getDb();
    return db.select().from(watchHistory).where(eq(watchHistory.userId, userId));
  }),

  save: publicQuery
    .input(z.object({
      animeId: z.string(),
      animeTitle: z.string(),
      animeImage: z.string().optional(),
      episode: z.string(),
      episodeNumber: z.number().optional(),
      totalEpisodes: z.number().optional(),
      progress: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("Not authenticated");
      const db = getDb();
      const existing = await db.select().from(watchHistory)
        .where(and(eq(watchHistory.userId, user.id), eq(watchHistory.animeId, input.animeId)))
        .limit(1);
      if (existing.length > 0) {
        await db.update(watchHistory)
          .set({
            episode: input.episode,
            episodeNumber: input.episodeNumber || 0,
            progress: input.progress || 0,
            updatedAt: new Date(),
          })
          .where(eq(watchHistory.id, existing[0].id));
        return { success: true };
      }
      await db.insert(watchHistory).values({
        userId: user.id,
        userType: user.unionId?.startsWith("local_") ? "local" : "oauth",
        animeId: input.animeId,
        animeTitle: input.animeTitle,
        animeImage: input.animeImage,
        episode: input.episode,
        episodeNumber: input.episodeNumber || 0,
        totalEpisodes: input.totalEpisodes || 0,
        progress: input.progress || 0,
      });
      return { success: true };
    }),

  remove: publicQuery
    .input(z.object({ animeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const db = getDb();
      await db.delete(watchHistory).where(and(eq(watchHistory.userId, userId), eq(watchHistory.animeId, input.animeId)));
      return { success: true };
    }),
});
