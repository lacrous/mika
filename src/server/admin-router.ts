import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { users, localUsers, reviews, favorites } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, sql } from "drizzle-orm";

export const adminRouter = createRouter({
  /* ── Dashboard Stats ── */
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [oauthCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [localCount] = await db.select({ count: sql<number>`count(*)` }).from(localUsers);
    const [reviewCount] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
    const [favCount] = await db.select({ count: sql<number>`count(*)` }).from(favorites);
    return {
      totalUsers: (oauthCount?.count || 0) + (localCount?.count || 0),
      oauthUsers: oauthCount?.count || 0,
      localUsers: localCount?.count || 0,
      totalReviews: reviewCount?.count || 0,
      totalFavorites: favCount?.count || 0,
    };
  }),

  /* ── User Management ── */
  users: {
    list: adminQuery
      .input(z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(100).optional().default(20),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        const oauthUsersList = await db.select().from(users)
          .orderBy(desc(users.createdAt)).limit(limit).offset(offset);
        const localUsersList = await db.select().from(localUsers)
          .orderBy(desc(localUsers.createdAt)).limit(limit).offset(offset);

        const allUsers = [
          ...oauthUsersList.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            role: u.role,
            authType: "oauth" as const,
            createdAt: u.createdAt,
          })),
          ...localUsersList.map((u) => ({
            id: u.id + 100000,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            role: u.role,
            authType: "local" as const,
            createdAt: u.createdAt,
          })),
        ];
        return allUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }),

    updateRole: adminQuery
      .input(z.object({
        userId: z.number(),
        authType: z.enum(["oauth", "local"]),
        role: z.enum(["user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (input.authType === "oauth") {
          await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
        } else {
          await db.update(localUsers).set({ role: input.role }).where(eq(localUsers.id, input.userId - 100000));
        }
        return { success: true };
      }),
  },

  /* ── Reviews Moderation ── */
  reviews: {
    list: adminQuery
      .input(z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(100).optional().default(20),
        status: z.enum(["all", "approved", "flagged"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = getDb();
        const limit = input?.limit || 20;
        const offset = ((input?.page || 1) - 1) * limit;
        const status = input?.status || "all";

        if (status === "approved") {
          return db.select().from(reviews).where(eq(reviews.isApproved, "approved"))
            .orderBy(desc(reviews.createdAt)).limit(limit).offset(offset);
        }
        if (status === "flagged") {
          return db.select().from(reviews).where(eq(reviews.isApproved, "flagged"))
            .orderBy(desc(reviews.createdAt)).limit(limit).offset(offset);
        }
        return db.select().from(reviews)
          .orderBy(desc(reviews.createdAt)).limit(limit).offset(offset);
      }),

    moderate: adminQuery
      .input(z.object({
        reviewId: z.number(),
        action: z.enum(["approve", "flag", "delete"]),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (input.action === "delete") {
          await db.delete(reviews).where(eq(reviews.id, input.reviewId));
        } else {
          await db.update(reviews)
            .set({ isApproved: input.action === "approve" ? "approved" : "flagged" })
            .where(eq(reviews.id, input.reviewId));
        }
        return { success: true };
      }),
  },
});
