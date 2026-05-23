import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { favorites } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, and } from "drizzle-orm";

export const favoritesRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) return [];
    const db = getDb();
    return db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(favorites.createdAt);
  }),

  add: publicQuery
    .input(z.object({
      animeId: z.string(),
      animeTitle: z.string(),
      animeImage: z.string().optional(),
      animeRating: z.string().optional(),
      genres: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("Not authenticated");
      const db = getDb();
      const existing = await db.select().from(favorites)
        .where(and(eq(favorites.userId, user.id), eq(favorites.animeId, input.animeId)))
        .limit(1);
      if (existing.length > 0) return { success: false, message: "Already in favorites" };
      await db.insert(favorites).values({
        userId: user.id,
        userType: user.unionId?.startsWith("local_") ? "local" : "oauth",
        animeId: input.animeId,
        animeTitle: input.animeTitle,
        animeImage: input.animeImage,
        animeRating: input.animeRating,
        genres: input.genres,
      });
      return { success: true, message: "Added to favorites" };
    }),

  remove: publicQuery
    .input(z.object({ animeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const db = getDb();
      await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.animeId, input.animeId)));
      return { success: true };
    }),
});
