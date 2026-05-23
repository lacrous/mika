import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { watchParties, watchPartyParticipants } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, and, desc } from "drizzle-orm";

function generateRoomCode(): string {
  return Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 34)]).join("");
}

export const watchPartyRouter = createRouter({
  /* ── Create a watch party ── */
  create: authedQuery
    .input(z.object({ animeId: z.number(), episodeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const roomCode = generateRoomCode();
      const result = await db.insert(watchParties).values({
        roomCode,
        animeId: input.animeId,
        episodeId: input.episodeId,
        hostId: ctx.localUser!.id,
        status: "waiting",
        currentTime: 0,
        isPlaying: 0,
      });
      await db.insert(watchPartyParticipants).values({
        partyId: Number(result[0].insertId),
        userId: ctx.localUser!.id,
        userName: ctx.localUser!.name,
      });
      return { success: true, roomCode };
    }),

  /* ── Join by room code ── */
  join: authedQuery
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [party] = await db.select().from(watchParties).where(eq(watchParties.roomCode, input.roomCode)).limit(1);
      if (!party) throw new Error("Room not found");
      await db.insert(watchPartyParticipants).values({
        partyId: party.id,
        userId: ctx.localUser!.id,
        userName: ctx.localUser!.name,
      });
      return { success: true, party };
    }),

  /* ── Get party by code ── */
  get: authedQuery
    .input(z.object({ roomCode: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [party] = await db.select().from(watchParties).where(eq(watchParties.roomCode, input.roomCode)).limit(1);
      if (!party) return null;
      const participants = await db.select().from(watchPartyParticipants).where(eq(watchPartyParticipants.partyId, party.id));
      return { ...party, participants };
    }),

  /* ── Sync playback (host only) ── */
  sync: authedQuery
    .input(z.object({ roomCode: z.string(), currentTime: z.number(), isPlaying: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.update(watchParties)
        .set({ currentTime: input.currentTime, isPlaying: input.isPlaying ? 1 : 0 })
        .where(eq(watchParties.roomCode, input.roomCode));
      return { success: true };
    }),

  /* ── Leave party ── */
  leave: authedQuery
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [party] = await db.select().from(watchParties).where(eq(watchParties.roomCode, input.roomCode)).limit(1);
      if (!party) return { success: true };
      await db.delete(watchPartyParticipants).where(
        and(eq(watchPartyParticipants.partyId, party.id), eq(watchPartyParticipants.userId, ctx.localUser!.id))
      );
      return { success: true };
    }),
});
