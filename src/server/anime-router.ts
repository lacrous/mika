import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { anime } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, sql, like, or } from "drizzle-orm";

// ── Seed data (inserted to DB if empty) ──
const seedAnimeData = [
  { title: "Jujutsu Kaisen", synopsis: "A boy swallows a cursed talisman and enters a world of sorcerers, curses, and supernatural battles.", year: 2023, rating: 92, episodes: 24, status: "Completed", studio: "MAPPA", image: "/poster-1.jpg", genres: ["Action", "Supernatural"], trending: 1 },
  { title: "Attack on Titan", synopsis: "Humanity fights for survival against giant humanoid creatures known as Titans.", year: 2013, rating: 95, episodes: 87, status: "Completed", studio: "WIT Studio / MAPPA", image: "/poster-2.jpg", genres: ["Action", "Drama"], trending: 1 },
  { title: "Spy x Family", synopsis: "A spy, an assassin, and a telepath form a fake family for a secret mission.", year: 2022, rating: 88, episodes: 25, status: "Ongoing", studio: "WIT Studio / CloverWorks", image: "/poster-3.jpg", genres: ["Action", "Comedy"], trending: 1 },
  { title: "Chainsaw Man", synopsis: "A young man merges with his pet devil to become Chainsaw Man and hunt other devils.", year: 2022, rating: 89, episodes: 12, status: "Completed", studio: "MAPPA", image: "/poster-7.jpg", genres: ["Action", "Horror"], trending: 0 },
  { title: "One Piece", synopsis: "Monkey D. Luffy and his pirate crew search for the ultimate treasure, the One Piece.", year: 1999, rating: 90, episodes: 1070, status: "Ongoing", studio: "Toei Animation", image: "/poster-5.jpg", genres: ["Action", "Adventure"], trending: 1 },
  { title: "My Hero Academia", synopsis: "In a world where superpowers are common, a powerless boy dreams of becoming a hero.", year: 2016, rating: 85, episodes: 138, status: "Ongoing", studio: "Bones", image: "/poster-6.jpg", genres: ["Action", "Superhero"], trending: 0 },
  { title: "Solo Leveling", synopsis: "The weakest hunter awakens a mysterious power that allows him to level up infinitely.", year: 2024, rating: 91, episodes: 12, status: "Completed", studio: "A-1 Pictures", image: "/poster-7.jpg", genres: ["Action", "Fantasy"], trending: 1 },
  { title: "Hunter x Hunter", synopsis: "A young boy sets out to become a Hunter and find his missing father.", year: 2011, rating: 93, episodes: 148, status: "Completed", studio: "Madhouse", image: "/poster-8.jpg", genres: ["Action", "Adventure"], trending: 0 },
  { title: "Vinland Saga", synopsis: "A young Viking warrior seeks revenge against the man who killed his father.", year: 2019, rating: 90, episodes: 48, status: "Ongoing", studio: "WIT Studio", image: "/poster-9.jpg", genres: ["Action", "Adventure", "Historical"], trending: 0 },
  { title: "Mob Psycho 100", synopsis: "A powerful psychic middle schooler tries to live a normal life while suppressing his emotions.", year: 2016, rating: 87, episodes: 37, status: "Completed", studio: "Bones", image: "/poster-10.jpg", genres: ["Action", "Supernatural", "Comedy"], trending: 0 },
  { title: "Steins;Gate", synopsis: "A self-proclaimed mad scientist accidentally discovers time travel and faces dire consequences.", year: 2011, rating: 91, episodes: 24, status: "Completed", studio: "White Fox", image: "/poster-11.jpg", genres: ["Sci-Fi", "Thriller", "Drama"], trending: 0 },
  { title: "Fullmetal Alchemist: Brotherhood", synopsis: "Two brothers use alchemy in their quest to restore their bodies after a failed transmutation.", year: 2009, rating: 94, episodes: 64, status: "Completed", studio: "Bones", image: "/poster-12.jpg", genres: ["Action", "Adventure", "Fantasy"], trending: 0 },
  { title: "Death Note", synopsis: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name.", year: 2006, rating: 90, episodes: 37, status: "Completed", studio: "Madhouse", image: "/poster-2.jpg", genres: ["Thriller", "Supernatural", "Psychological"], trending: 0 },
  { title: "Code Geass", synopsis: "An exiled prince gains the power of absolute obedience and leads a rebellion against a corrupt empire.", year: 2006, rating: 89, episodes: 50, status: "Completed", studio: "Sunrise", image: "/poster-5.jpg", genres: ["Action", "Sci-Fi", "Mecha"], trending: 0 },
  { title: "Cowboy Bebop", synopsis: "Bounty hunters travel through space in the year 2071, chasing criminals and confronting their pasts.", year: 1998, rating: 89, episodes: 26, status: "Completed", studio: "Sunrise", image: "/poster-7.jpg", genres: ["Action", "Sci-Fi", "Noir"], trending: 0 },
  { title: "Demon Slayer", synopsis: "A kind-hearted boy becomes a demon slayer to avenge his family and cure his demon-turned sister.", year: 2019, rating: 94, episodes: 55, status: "Ongoing", studio: "ufotable", image: "/hero-bg.jpg", genres: ["Action", "Adventure", "Fantasy"], trending: 1 },
  { title: "One Punch Man", synopsis: "A hero who can defeat any enemy with a single punch searches for a worthy opponent.", year: 2015, rating: 87, episodes: 24, status: "Ongoing", studio: "Madhouse / J.C.Staff", image: "/poster-6.jpg", genres: ["Action", "Comedy", "Superhero"], trending: 0 },
  { title: "Bleach", synopsis: "A teenager gains the powers of a Soul Reaper and defends the living world from evil spirits.", year: 2004, rating: 85, episodes: 366, status: "Completed", studio: "Pierrot", image: "/poster-8.jpg", genres: ["Action", "Supernatural", "Adventure"], trending: 0 },
  { title: "Naruto", synopsis: "A young ninja seeks recognition from his peers and dreams of becoming the Hokage.", year: 2002, rating: 83, episodes: 220, status: "Completed", studio: "Pierrot", image: "/poster-1.jpg", genres: ["Action", "Adventure"], trending: 0 },
  { title: "Dr. Stone", synopsis: "A scientific genius rebuilds civilization from scratch after humanity is petrified for 3,700 years.", year: 2019, rating: 84, episodes: 59, status: "Ongoing", studio: "TMS Entertainment", image: "/poster-10.jpg", genres: ["Sci-Fi", "Adventure", "Comedy"], trending: 0 },
];

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const db = getDb();
  const existing = await db.select({ count: sql<number>`count(*)` }).from(anime);
  if (existing[0].count === 0) {
    await db.insert(anime).values(seedAnimeData);
  }
  seeded = true;
}

export const animeRouter = createRouter({
  /* ── List all anime (public) ── */
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          genre: z.string().optional(),
          status: z.string().optional(),
          page: z.number().int().min(1).optional().default(1),
          limit: z.number().int().min(1).max(500).optional().default(50),
          sortBy: z.enum(["rating", "year", "title", "createdAt"]).optional().default("rating"),
          sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
        })
        .optional()
    )
    .query(async ({ input }) => {
      await ensureSeeded();
      const db = getDb();
      const opts = input || {};
      const limit = opts.limit || 50;
      const offset = ((opts.page || 1) - 1) * limit;

      let query = db.select().from(anime);
      let results = await query.orderBy(desc(anime.createdAt));

      if (opts.search) {
        const q = `%${opts.search}%`;
        results = await db.select().from(anime).where(or(like(anime.title, q), like(anime.synopsis, q))).orderBy(desc(anime.rating));
      }
      if (opts.genre) {
        results = results.filter((a) => a.genres?.includes(opts.genre!));
      }
      if (opts.status) {
        results = results.filter((a) => a.status === opts.status);
      }

      // Sort
      const sortField = opts.sortBy || "rating";
      const sortDir = opts.sortDir || "desc";
      results.sort((a, b) => {
        const aVal = a[sortField] ?? 0;
        const bVal = b[sortField] ?? 0;
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      });

      return results.slice(offset, offset + limit);
    }),

  /* ── Get trending anime (public) ── */
  trending: publicQuery.query(async () => {
    await ensureSeeded();
    const db = getDb();
    return db.select().from(anime).where(eq(anime.trending, 1)).orderBy(desc(anime.rating));
  }),

  /* ── Get single anime by ID (public) ── */
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      await ensureSeeded();
      const db = getDb();
      const results = await db.select().from(anime).where(eq(anime.id, input.id)).limit(1);
      return results[0] || null;
    }),

  /* ── Create anime (admin only) ── */
  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        synopsis: z.string().min(1),
        year: z.number().int().min(1900).max(2100),
        rating: z.number().int().min(0).max(100),
        episodes: z.number().int().min(1),
        status: z.string(),
        studio: z.string(),
        image: z.string(),
        genres: z.array(z.string()),
        trending: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = {
        ...input,
        rating: Math.round(input.rating * 10),
        trending: input.trending ? 1 : 0,
      };
      const result = await db.insert(anime).values(values);
      return { success: true, id: Number(result[0].insertId) };
    }),

  /* ── Update anime (admin only) ── */
  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        synopsis: z.string().optional(),
        year: z.number().int().optional(),
        rating: z.number().int().optional(),
        episodes: z.number().int().optional(),
        status: z.string().optional(),
        studio: z.string().optional(),
        image: z.string().optional(),
        genres: z.array(z.string()).optional(),
        trending: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const setData: any = { ...updates };
      if (updates.rating !== undefined) setData.rating = Math.round(updates.rating * 10);
      if (updates.trending !== undefined) setData.trending = updates.trending ? 1 : 0;
      const db = getDb();
      await db.update(anime).set(setData).where(eq(anime.id, id));
      return { success: true };
    }),

  /* ── Delete anime (admin only) ── */
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(anime).where(eq(anime.id, input.id));
      return { success: true };
    }),

  /* ── Bulk import anime (admin) ── */
  bulkImport: adminQuery
    .input(z.object({
      animeList: z.array(z.object({
        title: z.string().min(1),
        synopsis: z.string().min(1),
        year: z.number().int().min(1900).max(2100),
        rating: z.number().int().min(0).max(100).optional(),
        episodes: z.number().int().min(1).optional(),
        status: z.string().optional(),
        studio: z.string().optional(),
        image: z.string().optional(),
        genres: z.array(z.string()).optional(),
        trending: z.boolean().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = input.animeList.map((a) => ({
        ...a,
        rating: Math.round((a.rating || 80) * 10),
        episodes: a.episodes || 12,
        status: a.status || "Ongoing",
        studio: a.studio || "",
        image: a.image || "",
        genres: a.genres || [],
        trending: a.trending ? 1 : 0,
      }));
      await db.insert(anime).values(values);
      return { success: true, count: values.length };
    }),

  /* ── Quick search for admin (lightweight) ── */
  search: publicQuery
    .input(z.object({ q: z.string().min(1), limit: z.number().int().min(1).max(50).optional().default(20) }))
    .query(async ({ input }) => {
      await ensureSeeded();
      const db = getDb();
      const results = await db
        .select({ id: anime.id, title: anime.title, image: anime.image, episodes: anime.episodes, status: anime.status })
        .from(anime)
        .where(like(anime.title, `%${input.q}%`))
        .limit(input.limit || 20);
      return results;
    }),

  /* ── Stats (admin) ── */
  stats: publicQuery.query(async () => {
    await ensureSeeded();
    const db = getDb();
    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(anime);
    const [trendingResult] = await db.select({ count: sql<number>`count(*)` }).from(anime).where(eq(anime.trending, 1));
    const [ongoingResult] = await db.select({ count: sql<number>`count(*)` }).from(anime).where(eq(anime.status, "Ongoing"));
    const [completedResult] = await db.select({ count: sql<number>`count(*)` }).from(anime).where(eq(anime.status, "Completed"));
    return {
      total: totalResult?.count || 0,
      trending: trendingResult?.count || 0,
      ongoing: ongoingResult?.count || 0,
      completed: completedResult?.count || 0,
    };
  }),
});
