import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../src/server/router";
import { createContext } from "../src/server/context";
import { createOAuthCallbackHandler } from "../src/server/kimi/auth";

/**
 * Vercel Serverless Function Entry Point
 *
 * This file is the ONLY file in the `api/` directory.
 * Vercel treats files in `api/` as serverless functions.
 *
 * The backend source code lives in `src/server/` to avoid
 * Vercel scanning every router file as a separate function.
 */

const app = new Hono();

// 50MB body limit for uploads
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// OAuth callback route
app.get("/api/oauth/callback", createOAuthCallbackHandler());

// tRPC API handler - all tRPC routes go through here
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// 404 for unmatched API routes
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

/**
 * Vercel Node.js Serverless Handler
 *
 * Converts the Web API Request/Response (used by Hono)
 * to Node.js-style req/res that Vercel expects.
 */
export default async (req: any, res: any) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: new Headers(req.headers || {}),
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? req
          : undefined,
    });

    const response = await app.fetch(request);

    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } catch (error) {
    console.error("Serverless handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};
