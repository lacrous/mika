import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { mangaSeries, mangaChapters } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc } from "drizzle-orm";

export const mangaRouter = createRouter({
  /* ── List published manga series ── */
  list: publicQuery
    .input(z.object({ limit: z.number().int().optional().default(20) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(mangaSeries).where(eq(mangaSeries.isPublished, 1))
        .orderBy(desc(mangaSeries.createdAt)).limit(input?.limit || 20);
    }),

  /* ── Get single series with chapters ── */
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [series] = await db.select().from(mangaSeries).where(eq(mangaSeries.id, input.id)).limit(1);
      if (!series) return null;
      const chapters = await db.select().from(mangaChapters).where(eq(mangaChapters.seriesId, input.id)).orderBy(mangaChapters.number);
      return { ...series, chapters };
    }),

  /* ── Get single chapter ── */
  chapter: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [ch] = await db.select().from(mangaChapters).where(eq(mangaChapters.id, input.id)).limit(1);
      return ch || null;
    }),

  /* ── Create series (admin) ── */
  createSeries: adminQuery
    .input(z.object({
      title: z.string().min(1),
      animeId: z.number().optional(),
      author: z.string().optional(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      genres: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(mangaSeries).values({
        title: input.title,
        animeId: input.animeId || null,
        author: input.author || null,
        description: input.description || null,
        coverImage: input.coverImage || null,
        genres: input.genres || [],
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Add chapter (admin) ── */
  addChapter: adminQuery
    .input(z.object({
      seriesId: z.number(),
      number: z.number().int().min(1),
      title: z.string().optional(),
      pages: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(mangaChapters).values({
        seriesId: input.seriesId,
        number: input.number,
        title: input.title || `Chapter ${input.number}`,
        pages: input.pages,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),
});
