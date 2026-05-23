import { trendingAnime, topPicksAnime } from "./anime";
import { seasonAnimeData } from "./seasonAnime";
import type { Anime } from "@/types";

export const allAnimeList: Anime[] = [
  ...trendingAnime,
  ...topPicksAnime,
  ...seasonAnimeData.map((s) => ({
    id: s.id,
    title: s.title,
    year: s.year,
    rating: s.rating,
    genres: s.genres,
    image: s.image,
    synopsis: `${s.title} \u2014 ${s.season} season anime with ${s.episodes} episodes.`,
    episodes: s.episodes,
    status: s.status,
    studio: "Various",
  })),
];

export const genreColors: Record<string, string> = {
  Action: "#ef4444",
  Adventure: "#f97316",
  Fantasy: "#a855f7",
  "Sci-Fi": "#06b6d4",
  Romance: "#ec4899",
  Horror: "#dc2626",
  Comedy: "#eab308",
  Drama: "#3b82f6",
  Supernatural: "#8b5cf6",
  "Slice of Life": "#22c55e",
  Historical: "#f59e0b",
  Thriller: "#6366f1",
  Psychological: "#14b8a6",
  Mecha: "#64748b",
  Noir: "#1e293b",
  "Superhero": "#f43f5e",
};
