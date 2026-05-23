import {
  mysqlTable,
  varchar,
  int,
  bigint,
  timestamp,
  serial,
  json,
  text,
  date,
} from "drizzle-orm/mysql-core";

/* ── Users ── managed by Kimi OAuth ── */
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("union_id", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 255 }),
  avatar: varchar("avatar", { length: 1024 }),
  role: varchar("role", { length: 32 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at"),
});

/* ── Local Users ── email/password accounts ── */
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  avatar: varchar("avatar", { length: 1024 }),
  role: varchar("role", { length: 32 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at"),
});

/* ── User Favorites ── anime saved as favorites ── */
export const favorites = mysqlTable("favorites", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userType: varchar("user_type", { length: 16 }).notNull().default("local"),
  animeId: varchar("anime_id", { length: 64 }).notNull(),
  animeTitle: varchar("anime_title", { length: 255 }).notNull(),
  animeImage: varchar("anime_image", { length: 1024 }),
  animeRating: varchar("anime_rating", { length: 8 }),
  genres: json("genres").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Watch History ── episodes watched with progress ── */
export const watchHistory = mysqlTable("watch_history", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userType: varchar("user_type", { length: 16 }).notNull().default("local"),
  animeId: varchar("anime_id", { length: 64 }).notNull(),
  animeTitle: varchar("anime_title", { length: 255 }).notNull(),
  animeImage: varchar("anime_image", { length: 1024 }),
  episode: varchar("episode", { length: 64 }).notNull(),
  episodeNumber: int("episode_number", { unsigned: true }).notNull().default(1),
  totalEpisodes: int("total_episodes", { unsigned: true }).default(0),
  progress: int("progress", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ── Reviews ── user reviews on anime ── */
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userType: varchar("user_type", { length: 16 }).notNull().default("local"),
  userName: varchar("user_name", { length: 128 }).notNull(),
  userAvatar: varchar("user_avatar", { length: 1024 }),
  animeId: varchar("anime_id", { length: 64 }).notNull(),
  animeTitle: varchar("anime_title", { length: 255 }).notNull(),
  rating: int("rating", { unsigned: true }).notNull(),
  content: varchar("content", { length: 2000 }).notNull(),
  isApproved: varchar("is_approved", { length: 16 }).notNull().default("approved"),
  helpfulCount: int("helpful_count", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ── Anime ── anime catalog managed by admin ── */
export const anime = mysqlTable("anime", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  synopsis: varchar("synopsis", { length: 2000 }).notNull(),
  year: int("year", { unsigned: true }).notNull(),
  rating: int("rating", { unsigned: true }).notNull().default(80),
  episodes: int("episodes", { unsigned: true }).notNull().default(12),
  status: varchar("status", { length: 32 }).notNull().default("Ongoing"),
  studio: varchar("studio", { length: 128 }).notNull().default(""),
  image: varchar("image", { length: 1024 }).notNull().default(""),
  trailerUrl: varchar("trailer_url", { length: 2048 }),
  genres: json("genres").$type<string[]>(),
  trending: int("trending", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ── Episodes ── individual episodes per anime ── */
export const episodes = mysqlTable("episodes", {
  id: serial("id").primaryKey(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  number: int("number", { unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull().default(""),
  videoUrl: varchar("video_url", { length: 2048 }),
  thumbnail: varchar("thumbnail", { length: 2048 }),
  duration: int("duration", { unsigned: true }).default(24), // minutes
  isFiller: int("is_filler", { unsigned: true }).notNull().default(0),
  airDate: timestamp("air_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ── Site Settings ── admin-configurable settings ── */
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("setting_key", { length: 128 }).notNull().unique(),
  value: json("setting_value").$type<unknown>(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ── Comments ── nested discussion threads on anime ── */
export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userName: varchar("user_name", { length: 128 }).notNull(),
  userAvatar: varchar("user_avatar", { length: 1024 }),
  content: varchar("content", { length: 2000 }).notNull(),
  parentId: bigint("parent_id", { mode: "number", unsigned: true }),
  likes: int("likes", { unsigned: true }).notNull().default(0),
  isPinned: int("is_pinned", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ── Comment Likes ── track who liked what ── */
export const commentLikes = mysqlTable("comment_likes", {
  id: serial("id").primaryKey(),
  commentId: bigint("comment_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Collections ── user-created anime playlists ── */
export const collections = mysqlTable("collections", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  isPublic: int("is_public", { unsigned: true }).notNull().default(1),
  likes: int("likes", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ── Collection Items ── anime in a collection ── */
export const collectionItems = mysqlTable("collection_items", {
  id: serial("id").primaryKey(),
  collectionId: bigint("collection_id", { mode: "number", unsigned: true }).notNull(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  order: int("sort_order", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Subtitles ── per-episode subtitle files ── */
export const subtitles = mysqlTable("subtitles", {
  id: serial("id").primaryKey(),
  episodeId: bigint("episode_id", { mode: "number", unsigned: true }).notNull(),
  language: varchar("language", { length: 16 }).notNull(), // "en", "ar", "ja"
  languageName: varchar("language_name", { length: 64 }).notNull(), // "English", "Arabic"
  fileUrl: varchar("file_url", { length: 2048 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Notification Preferences ── per-user email settings ── */
export const notificationPrefs = mysqlTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().unique(),
  newEpisodes: int("new_episodes", { unsigned: true }).notNull().default(1),
  siteAnnouncements: int("site_announcements", { unsigned: true }).notNull().default(1),
  reviewReplies: int("review_replies", { unsigned: true }).notNull().default(1),
  collectionLikes: int("collection_likes", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ── Anime Cast ── characters & voice actors ── */
export const animeCharacters = mysqlTable("anime_characters", {
  id: serial("id").primaryKey(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  role: varchar("role", { length: 32 }).notNull().default("Supporting"), // Main, Supporting
  image: varchar("image", { length: 1024 }),
  voiceActor: varchar("voice_actor", { length: 128 }),
  voiceActorLang: varchar("voice_actor_lang", { length: 32 }).default("Japanese"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── User Achievements ── badges & milestones ── */
export const userAchievements = mysqlTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  badgeKey: varchar("badge_key", { length: 64 }).notNull(), // "first_watch", "streak_7", etc
  badgeName: varchar("badge_name", { length: 128 }).notNull(),
  badgeIcon: varchar("badge_icon", { length: 64 }).notNull().default("🎖️"),
  badgeColor: varchar("badge_color", { length: 32 }).default("#D4AF37"),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Watch Timestamps ── precise resume positions ── */
export const watchTimestamps = mysqlTable("watch_timestamps", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  episodeId: bigint("episode_id", { mode: "number", unsigned: true }).notNull(),
  timestamp: int("timestamp", { unsigned: true }).notNull().default(0), // seconds
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ── Types ── */
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LocalUser = typeof localUsers.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type WatchHistory = typeof watchHistory.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type NewWatchHistory = typeof watchHistory.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Anime = typeof anime.$inferSelect;
export type NewAnime = typeof anime.$inferInsert;
export type Episode = typeof episodes.$inferSelect;
export type NewEpisode = typeof episodes.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type Subtitle = typeof subtitles.$inferSelect;
export type NotificationPref = typeof notificationPrefs.$inferSelect;
export type AnimeCharacter = typeof animeCharacters.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type WatchTimestamp = typeof watchTimestamps.$inferSelect;

/* ── User Follows ── social following ── */
export const userFollows = mysqlTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: bigint("follower_id", { mode: "number", unsigned: true }).notNull(),
  followingId: bigint("following_id", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── User Activities ── activity feed ── */
export const userActivities = mysqlTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userName: varchar("user_name", { length: 128 }).notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }),
  animeTitle: varchar("anime_title", { length: 255 }),
  episodeNumber: int("episode_number", { unsigned: true }),
  collectionId: bigint("collection_id", { mode: "number", unsigned: true }),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Watch Parties ── synchronized group watching ── */
export const watchParties = mysqlTable("watch_parties", {
  id: serial("id").primaryKey(),
  roomCode: varchar("room_code", { length: 8 }).notNull().unique(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  episodeId: bigint("episode_id", { mode: "number", unsigned: true }).notNull(),
  hostId: bigint("host_id", { mode: "number", unsigned: true }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("waiting"),
  currentTime: int("current_time", { unsigned: true }).notNull().default(0),
  isPlaying: int("is_playing", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Watch Party Participants ── */
export const watchPartyParticipants = mysqlTable("watch_party_participants", {
  id: serial("id").primaryKey(),
  partyId: bigint("party_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userName: varchar("user_name", { length: 128 }).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

/* ── News Posts ── anime news & blog ── */
export const newsPosts = mysqlTable("news_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 1024 }),
  category: varchar("category", { length: 32 }).notNull().default("news"),
  authorName: varchar("author_name", { length: 128 }),
  views: int("views", { unsigned: true }).notNull().default(0),
  isPublished: int("is_published", { unsigned: true }).notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ── Manga Series ── */
export const mangaSeries = mysqlTable("manga_series", {
  id: serial("id").primaryKey(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 128 }),
  description: text("description"),
  coverImage: varchar("cover_image", { length: 1024 }),
  status: varchar("status", { length: 16 }).notNull().default("ongoing"),
  totalChapters: int("total_chapters", { unsigned: true }).notNull().default(0),
  rating: int("rating", { unsigned: true }),
  genres: json("genres").$type<string[]>(),
  isPublished: int("is_published", { unsigned: true }).notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Manga Chapters ── */
export const mangaChapters = mysqlTable("manga_chapters", {
  id: serial("id").primaryKey(),
  seriesId: bigint("series_id", { mode: "number", unsigned: true }).notNull(),
  number: int("number", { unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }),
  pages: json("pages").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Anime Requests ── users request anime to be added ── */
export const animeRequests = mysqlTable("anime_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userName: varchar("user_name", { length: 128 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  genres: json("genres").$type<string[]>(),
  year: int("year", { unsigned: true }),
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  votes: int("votes", { unsigned: true }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Request Votes ── */
export const requestVotes = mysqlTable("request_votes", {
  id: serial("id").primaryKey(),
  requestId: bigint("request_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Bookmarks ── watchlist with reminders ── */
export const bookmarks = mysqlTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  animeId: bigint("anime_id", { mode: "number", unsigned: true }).notNull(),
  animeTitle: varchar("anime_title", { length: 255 }).notNull(),
  animeImage: varchar("anime_image", { length: 1024 }),
  note: varchar("note", { length: 500 }),
  notifyNewEpisodes: int("notify_new_episodes", { unsigned: true }).notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Review Votes ── helpful/not helpful ── */
export const reviewVotes = mysqlTable("review_votes", {
  id: serial("id").primaryKey(),
  reviewId: bigint("review_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  isHelpful: int("is_helpful", { unsigned: true }).notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Analytics Daily ── daily stats tracking ── */
export const analyticsDaily = mysqlTable("analytics_daily", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  activeUsers: int("active_users", { unsigned: true }).notNull().default(0),
  newUsers: int("new_users", { unsigned: true }).notNull().default(0),
  totalWatchTime: int("total_watch_time", { unsigned: true }).notNull().default(0),
  episodesWatched: int("episodes_watched", { unsigned: true }).notNull().default(0),
  reviewsPosted: int("reviews_posted", { unsigned: true }).notNull().default(0),
  favoritesAdded: int("favorites_added", { unsigned: true }).notNull().default(0),
  pageViews: int("page_views", { unsigned: true }).notNull().default(0),
});

/* ── Type Exports ── */
export type UserFollow = typeof userFollows.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type WatchParty = typeof watchParties.$inferSelect;
export type WatchPartyParticipant = typeof watchPartyParticipants.$inferSelect;
export type NewsPost = typeof newsPosts.$inferSelect;
export type MangaSeries = typeof mangaSeries.$inferSelect;
export type MangaChapter = typeof mangaChapters.$inferSelect;
