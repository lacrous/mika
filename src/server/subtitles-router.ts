import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { subtitles } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";

export const subtitlesRouter = createRouter({
  /* ── List subtitles for an episode ── */
  list: publicQuery
    .input(z.object({ episodeId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(subtitles).where(eq(subtitles.episodeId, input.episodeId));
    }),

  /* ── Create subtitle entry (admin) ── */
  create: adminQuery
    .input(z.object({
      episodeId: z.number(),
      language: z.string().min(2).max(16),
      languageName: z.string().min(1).max(64),
      fileUrl: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(subtitles).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Delete subtitle (admin) ── */
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(subtitles).where(eq(subtitles.id, input.id));
      return { success: true };
    }),
});
