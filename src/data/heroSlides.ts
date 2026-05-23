export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  synopsis: string;
  image: string;
  rating: number;
  year: number;
  genres: string[];
  trending?: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Demon Slayer: Kimetsu no Yaiba",
    subtitle: "Season 4 \u00b7 Action \u00b7 Adventure",
    synopsis: "Tanjiro Kamado joins the Demon Slayer Corps to find a cure for his sister Nezuko, who has been turned into a demon. Along the way, he faces powerful demons and uncovers dark secrets of the demon world.",
    image: "/hero-bg.jpg",
    rating: 9.4,
    year: 2024,
    genres: ["Action", "Adventure", "Fantasy"],
    trending: true,
  },
  {
    id: 2,
    title: "Jujutsu Kaisen",
    subtitle: "Season 2 \u00b7 Action \u00b7 Supernatural",
    synopsis: "A boy swallows a cursed talisman and enters a hidden world of sorcerers, deadly curses, and supernatural battles that threaten the existence of humanity itself.",
    image: "/poster-1.jpg",
    rating: 9.2,
    year: 2023,
    genres: ["Action", "Supernatural"],
    trending: true,
  },
  {
    id: 3,
    title: "Attack on Titan",
    subtitle: "Final Season \u00b7 Action \u00b7 Drama",
    synopsis: "Humanity fights for survival behind massive walls against giant humanoid creatures known as Titans. The truth about the Titans and the world beyond the walls will change everything.",
    image: "/poster-2.jpg",
    rating: 9.5,
    year: 2013,
    genres: ["Action", "Drama"],
    trending: true,
  },
  {
    id: 4,
    title: "One Piece",
    subtitle: "Season 20 \u00b7 Action \u00b7 Adventure",
    synopsis: "Monkey D. Luffy and his pirate crew sail the Grand Sea in search of the ultimate treasure, the One Piece, to become the King of the Pirates.",
    image: "/poster-5.jpg",
    rating: 9.0,
    year: 1999,
    genres: ["Action", "Adventure"],
    trending: true,
  },
  {
    id: 5,
    title: "Solo Leveling",
    subtitle: "Season 1 \u00b7 Action \u00b7 Fantasy",
    synopsis: "The weakest hunter Sung Jin-Woo awakens a mysterious power that allows him to level up infinitely, rising from the weakest to become the strongest Shadow Monarch.",
    image: "/poster-7.jpg",
    rating: 9.1,
    year: 2024,
    genres: ["Action", "Fantasy"],
    trending: true,
  },
];
