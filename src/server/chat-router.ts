import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";

// In-memory chat store (upgrade to DB later if needed)
interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: number;
}

const chatRooms = new Map<string, ChatMessage[]>();
const MAX_MESSAGES = 100;

function getRoom(roomId: string): ChatMessage[] {
  if (!chatRooms.has(roomId)) chatRooms.set(roomId, []);
  return chatRooms.get(roomId)!;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const chatRouter = createRouter({
  /* ── Get messages for a room ── */
  messages: publicQuery
    .input(z.object({ roomId: z.string(), limit: z.number().int().min(1).max(100).optional().default(50) }))
    .query(async ({ input }) => {
      const room = getRoom(input.roomId);
      return room.slice(-input.limit);
    }),

  /* ── Send a message (requires auth) ── */
  send: authedQuery
    .input(z.object({ roomId: z.string(), content: z.string().min(1).max(500) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.localUser;
      const msg: ChatMessage = {
        id: generateId(),
        roomId: input.roomId,
        userId: String(user.id),
        userName: user.name,
        content: input.content,
        timestamp: Date.now(),
      };
      const room = getRoom(input.roomId);
      room.push(msg);
      if (room.length > MAX_MESSAGES) room.shift();
      return msg;
    }),

  /* ── Delete a message (admin only) ── */
  delete: authedQuery
    .input(z.object({ roomId: z.string(), messageId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.localUser || ctx.localUser.role !== "admin") throw new Error("Unauthorized");
      const room = getRoom(input.roomId);
      const idx = room.findIndex((m) => m.id === input.messageId);
      if (idx >= 0) room.splice(idx, 1);
      return { success: true };
    }),

  /* ── Get room stats ── */
  roomStats: publicQuery
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      const room = getRoom(input.roomId);
      const uniqueUsers = new Set(room.map((m) => m.userId));
      return { messageCount: room.length, uniqueUsers: uniqueUsers.size };
    }),
});
