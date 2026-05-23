import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth-router";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth not available, try local auth
  }

  // If no OAuth user, try local auth token
  if (!ctx.user) {
    try {
      const localToken = opts.req.headers
        .get("x-local-auth-token")
        ?.replace("Bearer ", "");

      if (localToken) {
        const payload = await verifyLocalToken(localToken);
        if (payload?.sub) {
          const userId = Number(payload.sub);
          const db = getDb();
          const users = await db
            .select()
            .from(localUsers)
            .where(eq(localUsers.id, userId))
            .limit(1);

          if (users.length > 0) {
            const u = users[0];
            ctx.user = {
              id: u.id,
              unionId: `local_${u.id}`,
              name: u.name,
              email: u.email,
              avatar: u.avatar,
              role: u.role,
              createdAt: u.createdAt,
              updatedAt: u.updatedAt,
              lastSignInAt: u.lastSignInAt,
            };
          }
        }
      }
    } catch {
      // Local auth not available
    }
  }

  return ctx;
}
