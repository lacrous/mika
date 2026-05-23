import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { notificationPrefs } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";

export const notificationsRouter = createRouter({
  /* ── Get preferences ── */
  getPrefs: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db.select().from(notificationPrefs)
      .where(eq(notificationPrefs.userId, ctx.localUser!.id))
      .limit(1);
    return rows[0] || null;
  }),

  /* ── Update preferences ── */
  updatePrefs: authedQuery
    .input(z.object({
      newEpisodes: z.boolean().optional(),
      siteAnnouncements: z.boolean().optional(),
      reviewReplies: z.boolean().optional(),
      collectionLikes: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db.select().from(notificationPrefs)
        .where(eq(notificationPrefs.userId, ctx.localUser!.id))
        .limit(1);

      const values: any = {};
      if (input.newEpisodes !== undefined) values.newEpisodes = input.newEpisodes ? 1 : 0;
      if (input.siteAnnouncements !== undefined) values.siteAnnouncements = input.siteAnnouncements ? 1 : 0;
      if (input.reviewReplies !== undefined) values.reviewReplies = input.reviewReplies ? 1 : 0;
      if (input.collectionLikes !== undefined) values.collectionLikes = input.collectionLikes ? 1 : 0;

      if (rows.length > 0) {
        await db.update(notificationPrefs).set(values).where(eq(notificationPrefs.userId, ctx.localUser!.id));
      } else {
        await db.insert(notificationPrefs).values({
          userId: ctx.localUser!.id,
          ...values,
        });
      }
      return { success: true };
    }),
});
