import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { createRouter, publicQuery } from "./middleware";
import { localUsers } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.APP_KEY || "mika-anime-secret-key-2024"
);

export async function createLocalToken(userId: number): Promise<string> {
  return new SignJWT({ sub: String(userId), type: "local" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyLocalToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    return payload;
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  /* ── Sign Up ── */
  signup: publicQuery
    .input(z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      name: z.string().min(2, "Name must be at least 2 characters"),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(localUsers).where(eq(localUsers.email, input.email)).limit(1);
      if (existing.length > 0) throw new Error("Email already registered");

      const passwordHash = await bcrypt.hash(input.password, 12);
      const result = await db.insert(localUsers).values({
        email: input.email,
        passwordHash,
        name: input.name,
      });
      const userId = Number(result[0].insertId);
      const token = await createLocalToken(userId);
      return { success: true, token, user: { id: userId, email: input.email, name: input.name } };
    }),

  /* ── Login ── */
  login: publicQuery
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const users = await db.select().from(localUsers).where(eq(localUsers.email, input.email)).limit(1);
      if (users.length === 0) throw new Error("Invalid email or password");

      const user = users[0];
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new Error("Invalid email or password");

      await db.update(localUsers).set({ lastSignInAt: new Date() }).where(eq(localUsers.id, user.id));
      const token = await createLocalToken(user.id);
      return { success: true, token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } };
    }),

  /* ── Get current user ── */
  me: publicQuery.query(async ({ ctx }) => {
    const localToken = ctx.req.headers.get("x-local-auth-token")?.replace("Bearer ", "");
    if (!localToken) return null;

    const payload = await verifyLocalToken(localToken);
    if (!payload?.sub) return null;

    const userId = Number(payload.sub);
    const db = getDb();
    const users = await db.select().from(localUsers).where(eq(localUsers.id, userId)).limit(1);
    if (users.length === 0) return null;

    const user = users[0];
    return { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role, createdAt: user.createdAt };
  }),
});
