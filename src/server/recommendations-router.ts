import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { anime, watchHistory, favorites } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, sql, and, not, inArray } from "drizzle-orm";

export const recommendationsRouter = createRouter({
  /* ── "More Like This" ── based on genre/studio matching ── */
  similar: publicQuery
    .input(z.object({ animeId: z.number(), limit: z.number().int().min(1).max(20).optional().default(8) }))
    .query(async ({ input }) => {
      const db = getDb();
      const [target] = await db.select().from(anime).where(eq(anime.id, input.animeId)).limit(1);
      if (!target) return [];

      const targetGenres = target.genres || [];
      const allAnime = await db.select().from(anime).where(not(eq(anime.id, input.animeId)));

      // Score each anime by genre overlap + studio match
      const scored = allAnime.map((a) => {
        let score = 0;
        const aGenres = a.genres || [];
        for (const g of targetGenres) { if (aGenres.includes(g)) score += 3; }
        if (a.studio && a.studio === target.studio) score += 2;
        // Normalize rating to 0-10
        const ratingNorm = typeof a.rating === "number" ? (a.rating > 10 ? a.rating / 10 : a.rating) : 0;
        score += ratingNorm * 0.3;
        if (a.trending) score += 1;
        return { ...a, score };
      });

      return scored.sort((a, b) => b.score - a.score).slice(0, input.limit);
    }),

  /* ── "Because You Watched" ── based on watch history ── */
  becauseYouWatched: publicQuery
    .input(z.object({ userId: z.number(), limit: z.number().int().min(1).max(10).optional().default(6) }))
    .query(async ({ input }) => {
      const db = getDb();
      // Get recently watched anime
      const history = await db.select().from(watchHistory)
        .where(eq(watchHistory.userId, input.userId))
        .orderBy(desc(watchHistory.updatedAt))
        .limit(5);

      if (history.length === 0) return [];

      // Get genres from watched anime
      const watchedIds = history.map((h) => Number(h.animeId));
      const watchedAnime = await db.select().from(anime).where(inArray(anime.id, watchedIds));

      const genreCounts = new Map<string, number>();
      for (const a of watchedAnime) {
        for (const g of (a.genres || [])) {
          genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
        }
      }

      // Find unwatched anime matching top genres
      const allAnime = await db.select().from(anime)
        .where(not(inArray(anime.id, watchedIds)));

      const scored = allAnime.map((a) => {
        let score = 0;
        for (const g of (a.genres || [])) {
          score += genreCounts.get(g) || 0;
        }
        const ratingNorm = typeof a.rating === "number" ? (a.rating > 10 ? a.rating / 10 : a.rating) : 0;
        score += ratingNorm * 0.2;
        return { ...a, score };
      });

      return scored.sort((a, b) => b.score - a.score).slice(0, input.limit);
    }),

  /* ── Trending picks ── */
  trending: publicQuery
    .input(z.object({ limit: z.number().int().min(1).max(20).optional().default(8) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(anime)
        .where(eq(anime.trending, 1))
        .orderBy(desc(anime.rating))
        .limit(input.limit);
    }),

  /* ── Top Rated ── */
  topRated: publicQuery
    .input(z.object({ limit: z.number().int().min(1).max(20).optional().default(10) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(anime)
        .orderBy(desc(anime.rating))
        .limit(input.limit);
    }),
});
