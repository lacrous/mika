import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { episodes } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, asc } from "drizzle-orm";

export const episodesRouter = createRouter({
  /* ── List episodes for an anime (public) ── */
  list: publicQuery
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(episodes).where(eq(episodes.animeId, input.animeId)).orderBy(asc(episodes.number));
    }),

  /* ── Get single episode (public) ── */
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(episodes).where(eq(episodes.id, input.id)).limit(1);
      return result[0] || null;
    }),

  /* ── Create episode (admin) ── */
  create: adminQuery
    .input(
      z.object({
        animeId: z.number(),
        number: z.number().int().min(1),
        title: z.string().min(1),
        videoUrl: z.string().optional(),
        thumbnail: z.string().optional(),
        duration: z.number().int().optional(),
        isFiller: z.boolean().optional(),
        airDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = {
        animeId: input.animeId,
        number: input.number,
        title: input.title,
        videoUrl: input.videoUrl || null,
        thumbnail: input.thumbnail || null,
        duration: input.duration || 24,
        isFiller: input.isFiller ? 1 : 0,
        airDate: input.airDate ? new Date(input.airDate) : null,
      };
      const result = await db.insert(episodes).values(values);
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Update episode (admin) ── */
  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        number: z.number().int().min(1).optional(),
        title: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnail: z.string().optional(),
        duration: z.number().int().optional(),
        isFiller: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const setData: any = {};
      if (updates.number !== undefined) setData.number = updates.number;
      if (updates.title !== undefined) setData.title = updates.title;
      if (updates.videoUrl !== undefined) setData.videoUrl = updates.videoUrl;
      if (updates.thumbnail !== undefined) setData.thumbnail = updates.thumbnail;
      if (updates.duration !== undefined) setData.duration = updates.duration;
      if (updates.isFiller !== undefined) setData.isFiller = updates.isFiller ? 1 : 0;

      const db = getDb();
      await db.update(episodes).set(setData).where(eq(episodes.id, id));
      return { success: true };
    }),

  /* ── Delete episode (admin) ── */
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(episodes).where(eq(episodes.id, input.id));
      return { success: true };
    }),

  /* ── Bulk create episodes (admin) ── */
  bulkCreate: adminQuery
    .input(
      z.object({
        animeId: z.number(),
        episodesList: z.array(
          z.object({
            number: z.number().int().min(1),
            title: z.string().min(1),
            videoUrl: z.string().optional(),
            thumbnail: z.string().optional(),
            duration: z.number().int().optional(),
            isFiller: z.boolean().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = input.episodesList.map((ep) => ({
        animeId: input.animeId,
        number: ep.number,
        title: ep.title,
        videoUrl: ep.videoUrl || null,
        thumbnail: ep.thumbnail || null,
        duration: ep.duration || 24,
        isFiller: ep.isFiller ? 1 : 0,
        airDate: null,
      }));
      await db.insert(episodes).values(values);
      return { success: true, count: values.length };
    }),
});
