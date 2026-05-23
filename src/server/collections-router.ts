import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { collections, collectionItems } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and } from "drizzle-orm";

export const collectionsRouter = createRouter({
  /* ── List user's collections ── */
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(collections)
      .where(eq(collections.userId, ctx.localUser!.id))
      .orderBy(desc(collections.createdAt));
  }),

  /* ── Get public collections ── */
  public: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(collections)
      .where(eq(collections.isPublic, 1))
      .orderBy(desc(collections.likes))
      .limit(20);
  }),

  /* ── Get single collection with items ── */
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [col] = await db.select().from(collections).where(eq(collections.id, input.id)).limit(1);
      if (!col) return null;
      const items = await db.select().from(collectionItems).where(eq(collectionItems.collectionId, input.id));
      return { ...col, items };
    }),

  /* ── Create collection ── */
  create: authedQuery
    .input(z.object({ title: z.string().min(1).max(255), description: z.string().optional(), isPublic: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(collections).values({
        userId: ctx.localUser!.id,
        title: input.title,
        description: input.description || "",
        isPublic: input.isPublic !== false ? 1 : 0,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Add anime to collection ── */
  addItem: authedQuery
    .input(z.object({ collectionId: z.number(), animeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [col] = await db.select().from(collections)
        .where(and(eq(collections.id, input.collectionId), eq(collections.userId, ctx.localUser!.id)))
        .limit(1);
      if (!col) throw new Error("Collection not found");
      await db.insert(collectionItems).values({
        collectionId: input.collectionId,
        animeId: input.animeId,
      });
      return { success: true };
    }),

  /* ── Remove anime from collection ── */
  removeItem: authedQuery
    .input(z.object({ collectionId: z.number(), animeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(collectionItems).where(
        and(eq(collectionItems.collectionId, input.collectionId), eq(collectionItems.animeId, input.animeId))
      );
      return { success: true };
    }),

  /* ── Delete collection ── */
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(collectionItems).where(eq(collectionItems.collectionId, input.id));
      await db.delete(collections).where(and(eq(collections.id, input.id), eq(collections.userId, ctx.localUser!.id)));
      return { success: true };
    }),
});
