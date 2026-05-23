export interface AnimeSeason {
  seasonNumber: number;
  title: string;
  year: number;
  episodes: number;
  status: string;
  rating: number;
  image: string;
}

export interface AnimeSeasonsMap {
  [key: string]: AnimeSeason[];
}

// Season data for popular anime titles
export const animeSeasonsMap: AnimeSeasonsMap = {
  "Demon Slayer": [
    { seasonNumber: 1, title: "Demon Slayer: Kimetsu no Yaiba", year: 2019, episodes: 26, status: "Completed", rating: 9.2, image: "/hero-bg.jpg" },
    { seasonNumber: 2, title: "Mugen Train Arc / Entertainment District Arc", year: 2021, episodes: 11, status: "Completed", rating: 9.0, image: "/hero-bg.jpg" },
    { seasonNumber: 3, title: "Swordsmith Village Arc", year: 2023, episodes: 11, status: "Completed", rating: 9.1, image: "/hero-bg.jpg" },
    { seasonNumber: 4, title: "Hashira Training Arc", year: 2024, episodes: 8, status: "Completed", rating: 9.0, image: "/hero-bg.jpg" },
  ],
  "Jujutsu Kaisen": [
    { seasonNumber: 1, title: "Jujutsu Kaisen", year: 2020, episodes: 24, status: "Completed", rating: 9.0, image: "/poster-1.jpg" },
    { seasonNumber: 2, title: "Hidden Inventory / Shibuya Incident", year: 2023, episodes: 23, status: "Completed", rating: 9.2, image: "/poster-1.jpg" },
  ],
  "Attack on Titan": [
    { seasonNumber: 1, title: "Attack on Titan", year: 2013, episodes: 25, status: "Completed", rating: 9.1, image: "/poster-2.jpg" },
    { seasonNumber: 2, title: "Attack on Titan Season 2", year: 2017, episodes: 12, status: "Completed", rating: 9.0, image: "/poster-2.jpg" },
    { seasonNumber: 3, title: "Attack on Titan Season 3", year: 2018, episodes: 22, status: "Completed", rating: 9.3, image: "/poster-2.jpg" },
    { seasonNumber: 4, title: "The Final Season", year: 2020, episodes: 28, status: "Completed", rating: 9.5, image: "/poster-2.jpg" },
  ],
  "Spy x Family": [
    { seasonNumber: 1, title: "Spy x Family", year: 2022, episodes: 25, status: "Completed", rating: 8.8, image: "/poster-3.jpg" },
    { seasonNumber: 2, title: "Spy x Family Season 2", year: 2023, episodes: 12, status: "Completed", rating: 8.7, image: "/poster-3.jpg" },
  ],
  "One Piece": [
    { seasonNumber: 1, title: "East Blue Saga", year: 1999, episodes: 61, status: "Completed", rating: 8.8, image: "/poster-5.jpg" },
    { seasonNumber: 2, title: "Alabasta Saga", year: 2001, episodes: 74, status: "Completed", rating: 9.0, image: "/poster-5.jpg" },
    { seasonNumber: 3, title: "Sky Island Saga", year: 2003, episodes: 71, status: "Completed", rating: 8.9, image: "/poster-5.jpg" },
    { seasonNumber: 4, title: "Water 7 Saga", year: 2005, episodes: 119, status: "Completed", rating: 9.2, image: "/poster-5.jpg" },
    { seasonNumber: 5, title: "Thriller Bark to Marineford", year: 2008, episodes: 183, status: "Completed", rating: 9.3, image: "/poster-5.jpg" },
    { seasonNumber: 6, title: "Fish-Man Island to Wano", year: 2012, episodes: 462, status: "Completed", rating: 9.0, image: "/poster-5.jpg" },
    { seasonNumber: 7, title: "Egghead Arc", year: 2024, episodes: 30, status: "Ongoing", rating: 9.1, image: "/poster-5.jpg" },
  ],
  "My Hero Academia": [
    { seasonNumber: 1, title: "My Hero Academia", year: 2016, episodes: 13, status: "Completed", rating: 8.2, image: "/poster-6.jpg" },
    { seasonNumber: 2, title: "Sports Festival / Hero Killer", year: 2017, episodes: 25, status: "Completed", rating: 8.6, image: "/poster-6.jpg" },
    { seasonNumber: 3, title: "Provisional License / All For One", year: 2018, episodes: 25, status: "Completed", rating: 8.8, image: "/poster-6.jpg" },
    { seasonNumber: 4, title: "Overhaul / School Festival", year: 2019, episodes: 25, status: "Completed", rating: 8.5, image: "/poster-6.jpg" },
    { seasonNumber: 5, title: "Joint Training / Meta Liberation", year: 2021, episodes: 25, status: "Completed", rating: 8.4, image: "/poster-6.jpg" },
    { seasonNumber: 6, title: "Paranormal Liberation War", year: 2022, episodes: 25, status: "Completed", rating: 9.0, image: "/poster-6.jpg" },
    { seasonNumber: 7, title: "Final War Arc", year: 2024, episodes: 21, status: "Ongoing", rating: 8.9, image: "/poster-6.jpg" },
  ],
  "Solo Leveling": [
    { seasonNumber: 1, title: "Solo Leveling", year: 2024, episodes: 12, status: "Completed", rating: 9.1, image: "/poster-7.jpg" },
    { seasonNumber: 2, title: "Arise from the Shadow", year: 2025, episodes: 13, status: "Ongoing", rating: 9.3, image: "/poster-7.jpg" },
  ],
  "Hunter x Hunter": [
    { seasonNumber: 1, title: "Hunter Exam Arc", year: 2011, episodes: 21, status: "Completed", rating: 8.8, image: "/poster-8.jpg" },
    { seasonNumber: 2, title: "Zoldyck Family / Heavens Arena", year: 2012, episodes: 17, status: "Completed", rating: 9.0, image: "/poster-8.jpg" },
    { seasonNumber: 3, title: "Yorknew City Arc", year: 2012, episodes: 22, status: "Completed", rating: 9.2, image: "/poster-8.jpg" },
    { seasonNumber: 4, title: "Greed Island Arc", year: 2013, episodes: 17, status: "Completed", rating: 8.9, image: "/poster-8.jpg" },
    { seasonNumber: 5, title: "Chimera Ant Arc", year: 2013, episodes: 61, status: "Completed", rating: 9.5, image: "/poster-8.jpg" },
    { seasonNumber: 6, title: "Election Arc", year: 2014, episodes: 12, status: "Completed", rating: 9.0, image: "/poster-8.jpg" },
  ],
  "Vinland Saga": [
    { seasonNumber: 1, title: "Vinland Saga", year: 2019, episodes: 24, status: "Completed", rating: 9.0, image: "/poster-9.jpg" },
    { seasonNumber: 2, title: "Ketil's Farm Arc", year: 2023, episodes: 24, status: "Completed", rating: 8.9, image: "/poster-9.jpg" },
  ],
  "Mob Psycho 100": [
    { seasonNumber: 1, title: "Mob Psycho 100", year: 2016, episodes: 12, status: "Completed", rating: 8.5, image: "/poster-10.jpg" },
    { seasonNumber: 2, title: "Claw Arc / Divine Tree", year: 2019, episodes: 13, status: "Completed", rating: 8.9, image: "/poster-10.jpg" },
    { seasonNumber: 3, title: "Mob Psycho 100 III", year: 2022, episodes: 12, status: "Completed", rating: 8.8, image: "/poster-10.jpg" },
  ],
  "Steins;Gate": [
    { seasonNumber: 1, title: "Steins;Gate", year: 2011, episodes: 24, status: "Completed", rating: 9.1, image: "/poster-11.jpg" },
    { seasonNumber: 2, title: "Steins;Gate 0", year: 2018, episodes: 23, status: "Completed", rating: 8.8, image: "/poster-11.jpg" },
  ],
  "Fullmetal Alchemist: Brotherhood": [
    { seasonNumber: 1, title: "Fullmetal Alchemist: Brotherhood", year: 2009, episodes: 64, status: "Completed", rating: 9.4, image: "/poster-12.jpg" },
  ],
  "Chainsaw Man": [
    { seasonNumber: 1, title: "Chainsaw Man", year: 2022, episodes: 12, status: "Completed", rating: 8.9, image: "/poster-7.jpg" },
    { seasonNumber: 2, title: "Reze Arc / Bomb Girl", year: 2025, episodes: 12, status: "Upcoming", rating: 9.0, image: "/poster-7.jpg" },
  ],
};

// Helper function to find seasons by anime title
export function getSeasonsForAnime(title: string): AnimeSeason[] | null {
  // Try exact match first
  if (animeSeasonsMap[title]) {
    return animeSeasonsMap[title];
  }
  // Try partial match (e.g., "Demon Slayer" in "Demon Slayer: Kimetsu no Yaiba")
  for (const key of Object.keys(animeSeasonsMap)) {
    if (title.includes(key) || key.includes(title)) {
      return animeSeasonsMap[key];
    }
  }
  return null;
}
