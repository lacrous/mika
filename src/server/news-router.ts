import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { newsPosts } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and, sql } from "drizzle-orm";

export const newsRouter = createRouter({
  /* ── List published news ── */
  list: publicQuery
    .input(z.object({ category: z.string().optional(), limit: z.number().int().optional().default(10) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const cat = input?.category;
      const limit = input?.limit || 10;
      if (cat) {
        return db.select().from(newsPosts)
          .where(and(eq(newsPosts.category, cat), eq(newsPosts.isPublished, 1)))
          .orderBy(desc(newsPosts.createdAt))
          .limit(limit);
      }
      return db.select().from(newsPosts).where(eq(newsPosts.isPublished, 1))
        .orderBy(desc(newsPosts.createdAt)).limit(limit);
    }),

  /* ── Get single news by slug ── */
  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [post] = await db.select().from(newsPosts).where(eq(newsPosts.slug, input.slug)).limit(1);
      if (post) {
        await db.update(newsPosts).set({ views: sql`${newsPosts.views} + 1` }).where(eq(newsPosts.id, post.id));
      }
      return post || null;
    }),

  /* ── Create news (admin) ── */
  create: adminQuery
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().optional(),
      content: z.string().min(1),
      coverImage: z.string().optional(),
      category: z.string().optional(),
      authorName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(newsPosts).values({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt || "",
        content: input.content,
        coverImage: input.coverImage || null,
        category: input.category || "news",
        authorName: input.authorName || "MIKA Team",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Delete news (admin) ── */
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(newsPosts).where(eq(newsPosts.id, input.id));
      return { success: true };
    }),
});
