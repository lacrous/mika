import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { animeCharacters } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";

export const castRouter = createRouter({
  list: publicQuery
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(animeCharacters).where(eq(animeCharacters.animeId, input.animeId));
    }),

  create: adminQuery
    .input(z.object({
      animeId: z.number(),
      name: z.string().min(1),
      role: z.string().optional(),
      image: z.string().optional(),
      voiceActor: z.string().optional(),
      voiceActorLang: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(animeCharacters).values({
        animeId: input.animeId,
        name: input.name,
        role: input.role || "Supporting",
        image: input.image || null,
        voiceActor: input.voiceActor || null,
        voiceActorLang: input.voiceActorLang || "Japanese",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(animeCharacters).where(eq(animeCharacters.id, input.id));
      return { success: true };
    }),
});
