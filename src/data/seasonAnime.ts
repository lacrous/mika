export interface SeasonAnime {
  id: number;
  title: string;
  year: number;
  season: string;
  rating: number;
  genres: string[];
  image: string;
  episodes: number;
  status: string;
}

export const seasonAnimeData: SeasonAnime[] = [
  {
    id: 301,
    title: "Demon Slayer",
    year: 2024,
    season: "Spring 2024",
    rating: 9.4,
    genres: ["Action", "Adventure", "Fantasy"],
    image: "/hero-bg.jpg",
    episodes: 12,
    status: "Ongoing",
  },
  {
    id: 302,
    title: "Jujutsu Kaisen",
    year: 2024,
    season: "Spring 2024",
    rating: 9.2,
    genres: ["Action", "Supernatural"],
    image: "/poster-1.jpg",
    episodes: 24,
    status: "Ongoing",
  },
  {
    id: 303,
    title: "Attack on Titan",
    year: 2024,
    season: "Winter 2024",
    rating: 9.5,
    genres: ["Action", "Drama"],
    image: "/poster-2.jpg",
    episodes: 87,
    status: "Completed",
  },
  {
    id: 304,
    title: "Spy x Family",
    year: 2024,
    season: "Spring 2024",
    rating: 8.8,
    genres: ["Action", "Comedy"],
    image: "/poster-3.jpg",
    episodes: 12,
    status: "Ongoing",
  },
  {
    id: 305,
    title: "One Piece",
    year: 2024,
    season: "Spring 2024",
    rating: 9.0,
    genres: ["Action", "Adventure"],
    image: "/poster-5.jpg",
    episodes: 1070,
    status: "Ongoing",
  },
  {
    id: 306,
    title: "Solo Leveling",
    year: 2024,
    season: "Winter 2024",
    rating: 9.1,
    genres: ["Action", "Fantasy"],
    image: "/poster-7.jpg",
    episodes: 12,
    status: "Completed",
  },
  {
    id: 307,
    title: "My Hero Academia",
    year: 2024,
    season: "Spring 2024",
    rating: 8.5,
    genres: ["Action", "Superhero"],
    image: "/poster-6.jpg",
    episodes: 25,
    status: "Ongoing",
  },
  {
    id: 308,
    title: "Hunter x Hunter",
    year: 2024,
    season: "Winter 2024",
    rating: 9.3,
    genres: ["Action", "Adventure"],
    image: "/poster-8.jpg",
    episodes: 148,
    status: "Completed",
  },
];
