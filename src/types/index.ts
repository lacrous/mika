export interface Anime {
  id: string | number;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  image: string;
  synopsis: string;
  episodes: number;
  status: string;
  studio: string;
  trending?: boolean;
}

export interface ContinueWatchingItem {
  id: string | number;
  title: string;
  episode: string;
  progress: number;
  image: string;
  totalEpisodes: number;
  currentEpisode: number;
}

export interface AnimeCardProps {
  anime: Anime;
  compact?: boolean;
  index?: number;
  onClick?: () => void;
}

export interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  index?: number;
}

export interface FilterDropdownProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export interface SortToggleProps {
  sort: "popular" | "latest";
  onToggle: () => void;
}

export interface AnimeDetailModalProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
}
