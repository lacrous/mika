import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { anime, episodes, newsPosts, comments } from "@db/schema";
import { sql } from "drizzle-orm";

const SEED_ANIME = [
  { title: "Attack on Titan", synopsis: "Humanity fights for survival against giant humanoid creatures known as Titans.", year: 2013, rating: 95, episodes: 87, status: "Completed", studio: "WIT / MAPPA", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80", genres: ["Action", "Drama", "Fantasy"], trending: 1 },
  { title: "Demon Slayer", synopsis: "A young man becomes a demon slayer to avenge his family and cure his sister.", year: 2019, rating: 94, episodes: 55, status: "Ongoing", studio: "ufotable", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&q=80", genres: ["Action", "Supernatural", "Adventure"], trending: 1 },
  { title: "Jujutsu Kaisen", synopsis: "A boy swallows a cursed talisman and enters a world of sorcerers and curses.", year: 2020, rating: 92, episodes: 24, status: "Ongoing", studio: "MAPPA", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&q=80", genres: ["Action", "Supernatural"], trending: 1 },
  { title: "Fullmetal Alchemist: Brotherhood", synopsis: "Two brothers use alchemy in their quest to restore their bodies.", year: 2009, rating: 94, episodes: 64, status: "Completed", studio: "Bones", image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&q=80", genres: ["Action", "Adventure", "Fantasy"], trending: 0 },
  { title: "One Piece", synopsis: "Monkey D. Luffy searches for the ultimate treasure, the One Piece.", year: 1999, rating: 90, episodes: 1070, status: "Ongoing", studio: "Toei", image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400&q=80", genres: ["Action", "Adventure", "Comedy"], trending: 1 },
  { title: "Steins;Gate", synopsis: "A mad scientist accidentally discovers time travel with dire consequences.", year: 2011, rating: 91, episodes: 24, status: "Completed", studio: "White Fox", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80", genres: ["Sci-Fi", "Thriller", "Drama"], trending: 0 },
  { title: "Hunter x Hunter", synopsis: "A young boy sets out to become a Hunter and find his missing father.", year: 2011, rating: 93, episodes: 148, status: "Completed", studio: "Madhouse", image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80", genres: ["Action", "Adventure"], trending: 0 },
  { title: "Vinland Saga", synopsis: "A young Viking warrior seeks revenge for his father's death.", year: 2019, rating: 90, episodes: 48, status: "Ongoing", studio: "WIT", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80", genres: ["Action", "Adventure", "Historical"], trending: 0 },
  { title: "Death Note", synopsis: "A student discovers a notebook that lets him kill anyone by writing their name.", year: 2006, rating: 90, episodes: 37, status: "Completed", studio: "Madhouse", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80", genres: ["Thriller", "Supernatural", "Psychological"], trending: 0 },
  { title: "Code Geass", synopsis: "An exiled prince gains a power of absolute obedience and leads a rebellion.", year: 2006, rating: 89, episodes: 50, status: "Completed", studio: "Sunrise", image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&q=80", genres: ["Action", "Sci-Fi", "Mecha"], trending: 0 },
  { title: "Solo Leveling", synopsis: "The weakest hunter awakens a power that lets him level up infinitely.", year: 2024, rating: 91, episodes: 12, status: "Completed", studio: "A-1 Pictures", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", genres: ["Action", "Fantasy"], trending: 1 },
  { title: "Spy x Family", synopsis: "A spy, an assassin, and a telepath form a fake family for a mission.", year: 2022, rating: 88, episodes: 25, status: "Ongoing", studio: "WIT / CloverWorks", image: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=400&q=80", genres: ["Action", "Comedy"], trending: 1 },
  { title: "Chainsaw Man", synopsis: "A young man merges with his pet devil to hunt other devils.", year: 2022, rating: 89, episodes: 12, status: "Completed", studio: "MAPPA", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80", genres: ["Action", "Horror"], trending: 0 },
  { title: "Mob Psycho 100", synopsis: "A powerful psychic middle schooler tries to live a normal life.", year: 2016, rating: 87, episodes: 37, status: "Completed", studio: "Bones", image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&q=80", genres: ["Action", "Supernatural", "Comedy"], trending: 0 },
  { title: "Cowboy Bebop", synopsis: "Bounty hunters travel through space in 2071, chasing criminals.", year: 1998, rating: 89, episodes: 26, status: "Completed", studio: "Sunrise", image: "https://images.unsplash.com/photo-1535446202401-7765f0806c94?w=400&q=80", genres: ["Action", "Sci-Fi", "Noir"], trending: 0 },
  { title: "My Hero Academia", synopsis: "In a world of superpowers, a powerless boy dreams of becoming a hero.", year: 2016, rating: 85, episodes: 138, status: "Ongoing", studio: "Bones", image: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=400&q=80", genres: ["Action", "Superhero"], trending: 0 },
  { title: "Dr. Stone", synopsis: "A genius rebuilds civilization after humanity is petrified for 3,700 years.", year: 2019, rating: 84, episodes: 59, status: "Ongoing", studio: "TMS", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80", genres: ["Sci-Fi", "Adventure", "Comedy"], trending: 0 },
  { title: "One Punch Man", synopsis: "A hero defeats any enemy with a single punch and seeks a worthy opponent.", year: 2015, rating: 87, episodes: 24, status: "Ongoing", studio: "Madhouse", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=80", genres: ["Action", "Comedy", "Superhero"], trending: 0 },
  { title: "Bleach", synopsis: "A teenager gains Soul Reaper powers and defends the living world.", year: 2004, rating: 85, episodes: 366, status: "Completed", studio: "Pierrot", image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80", genres: ["Action", "Supernatural", "Adventure"], trending: 0 },
  { title: "Naruto", synopsis: "A young ninja seeks recognition and dreams of becoming the Hokage.", year: 2002, rating: 83, episodes: 220, status: "Completed", studio: "Pierrot", image: "https://images.unsplash.com/photo-1603349206295-dde20117b164?w=400&q=80", genres: ["Action", "Adventure"], trending: 0 },
  { title: "Cyberpunk: Edgerunners", synopsis: "A street kid tries to survive in a tech-obsessed city of the future.", year: 2022, rating: 92, episodes: 10, status: "Completed", studio: "Trigger", image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80", genres: ["Sci-Fi", "Action"], trending: 1 },
  { title: "Made in Abyss", synopsis: "Young explorers descend into a giant, mysterious hole in the earth.", year: 2017, rating: 88, episodes: 25, status: "Ongoing", studio: "Kinema Citrus", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80", genres: ["Adventure", "Fantasy", "Sci-Fi"], trending: 0 },
  { title: "Oshi no Ko", synopsis: "A doctor is reincarnated as the child of his favorite idol.", year: 2023, rating: 90, episodes: 11, status: "Ongoing", studio: "Doga Kobo", image: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=400&q=80", genres: ["Drama", "Supernatural"], trending: 1 },
  { title: "Blue Lock", synopsis: "300 strikers compete to become the world's greatest forward.", year: 2022, rating: 87, episodes: 24, status: "Ongoing", studio: "8bit", image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80", genres: ["Sports", "Drama"], trending: 0 },
  { title: "Hell's Paradise", synopsis: "Deadly convicts search for the elixir of immortality on a mysterious island.", year: 2023, rating: 88, episodes: 13, status: "Completed", studio: "MAPPA", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80", genres: ["Action", "Supernatural"], trending: 0 },
];

const SEED_NEWS = [
  { title: "Demon Slayer Season 4 Announced for Spring 2025", slug: "demon-slayer-season-4", excerpt: " ufotable confirms the next season adapting the Hashira Training arc.", content: "In a surprise announcement at Jump Festa 2024, ufotable confirmed that Demon Slayer Season 4 will premiere in Spring 2025. The new season will adapt the Hashira Training arc from Koyoharu Gotouge's manga.", category: "news", authorName: "NUROVIA Team", views: 12500 },
  { title: "Solo Leveling Anime Breaks Viewership Records", slug: "solo-leveling-records", excerpt: "A-1 Pictures' adaptation surpasses 100 million views globally.", content: "The Solo Leveling anime has shattered records, surpassing 100 million views across all streaming platforms. Sung Jinwoo's journey from the weakest hunter has captivated audiences worldwide.", category: "news", authorName: "NUROVIA Team", views: 8900 },
  { title: "Spring 2025 Anime Lineup: What to Watch", slug: "spring-2025-preview", excerpt: "Our top picks for the upcoming season.", content: "Spring 2025 is shaping up to be an incredible season for anime. From returning favorites like Demon Slayer to new originals, here's our comprehensive preview of what to watch.", category: "previews", authorName: "NUROVIA Team", views: 6700 },
  { title: "MAPPA Studios Announces New Original Anime", slug: "mappa-new-original", excerpt: "The studio behind Jujutsu Kaisen reveals a new project.", content: "MAPPA Studios has announced a new original anime project set to premiere in 2025. Little is known about the plot, but the studio promises it will push animation boundaries.", category: "news", authorName: "NUROVIA Team", views: 5400 },
];

export const seedRouter = createRouter({
  run: adminQuery.mutation(async () => {
    const db = getDb();
    const results: Record<string, number> = {};

    // Check if anime already seeded
    const [existingAnime] = await db.select({ count: sql<number>`count(*)` }).from(anime);
    if ((existingAnime?.count || 0) < 20) {
      // Clear existing
      await db.delete(episodes);
      await db.delete(anime);

      // Seed anime
      await db.insert(anime).values(SEED_ANIME);
      results.anime = SEED_ANIME.length;

      // Seed episodes for each anime
      for (const a of SEED_ANIME) {
        const [row] = await db.select({ id: anime.id }).from(anime).where(sql`${anime.title} = ${a.title}`).limit(1);
        if (row) {
          const epCount = Math.min(a.episodes, 12);
          const eps = Array.from({ length: epCount }, (_, i) => ({
            animeId: row.id,
            number: i + 1,
            title: `Episode ${i + 1}`,
            videoUrl: i === 0 ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" : null,
            duration: 24,
            isFiller: 0,
          }));
          await db.insert(episodes).values(eps);
        }
      }
      results.episodes = SEED_ANIME.reduce((sum, a) => sum + Math.min(a.episodes, 12), 0);
    }

    // Seed news
    const [existingNews] = await db.select({ count: sql<number>`count(*)` }).from(newsPosts);
    if ((existingNews?.count || 0) === 0) {
      await db.insert(newsPosts).values(SEED_NEWS);
      results.news = SEED_NEWS.length;
    }

    return { success: true, seeded: results };
  }),
});
