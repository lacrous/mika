import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { animeRequests, requestVotes } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and, sql } from "drizzle-orm";

export const requestsRouter = createRouter({
  /* ── List all requests (public) ── */
  list: authedQuery
    .input(z.object({ status: z.string().optional(), limit: z.number().int().optional().default(20) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const status = input?.status;
      const limit = input?.limit || 20;
      if (status && status !== "all") {
        return db.select().from(animeRequests).where(eq(animeRequests.status, status))
          .orderBy(desc(animeRequests.votes)).limit(limit);
      }
      return db.select().from(animeRequests).orderBy(desc(animeRequests.votes)).limit(limit);
    }),

  /* ── Create request ── */
  create: authedQuery
    .input(z.object({ title: z.string().min(1), description: z.string().optional(), genres: z.array(z.string()).optional(), year: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(animeRequests).values({
        userId: ctx.localUser!.id,
        userName: ctx.localUser!.name,
        title: input.title,
        description: input.description || "",
        genres: input.genres || [],
        year: input.year || null,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Vote on request ── */
  vote: authedQuery
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      try {
        await db.insert(requestVotes).values({ requestId: input.requestId, userId: ctx.localUser!.id });
        await db.update(animeRequests).set({ votes: sql`${animeRequests.votes} + 1` }).where(eq(animeRequests.id, input.requestId));
        return { success: true };
      } catch { return { success: false, message: "Already voted" }; }
    }),

  /* ── Approve request (admin) ── */
  approve: adminQuery
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(animeRequests).set({ status: "approved" }).where(eq(animeRequests.id, input.requestId));
      return { success: true };
    }),

  /* ── Reject request (admin) ── */
  reject: adminQuery
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(animeRequests).set({ status: "rejected" }).where(eq(animeRequests.id, input.requestId));
      return { success: true };
    }),

  /* ── Stats ── */
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [pending] = await db.select({ count: sql<number>`count(*)` }).from(animeRequests).where(eq(animeRequests.status, "pending"));
    const [approved] = await db.select({ count: sql<number>`count(*)` }).from(animeRequests).where(eq(animeRequests.status, "approved"));
    const [total] = await db.select({ count: sql<number>`count(*)` }).from(animeRequests);
    return { pending: pending?.count || 0, approved: approved?.count || 0, total: total?.count || 0 };
  }),
});
