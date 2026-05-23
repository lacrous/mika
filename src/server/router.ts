import { authRouter } from "./auth-router";
import { favoritesRouter } from "./favorites-router";
import { historyRouter } from "./history-router";
import { localAuthRouter } from "./local-auth-router";
import { reviewsRouter } from "./reviews-router";
import { adminRouter } from "./admin-router";
import { animeRouter } from "./anime-router";
import { episodesRouter } from "./episodes-router";
import { settingsRouter } from "./settings-router";
import { chatRouter } from "./chat-router";
import { commentsRouter } from "./comments-router";
import { collectionsRouter } from "./collections-router";
import { subtitlesRouter } from "./subtitles-router";
import { recommendationsRouter } from "./recommendations-router";
import { notificationsRouter } from "./notifications-router";
import { castRouter } from "./cast-router";
import { achievementsRouter } from "./achievements-router";
import { timestampsRouter } from "./timestamps-router";
import { uploadRouter } from "./upload-router";
import { socialRouter } from "./social-router";
import { watchPartyRouter } from "./watchparty-router";
import { newsRouter } from "./news-router";
import { mangaRouter } from "./manga-router";
import { requestsRouter } from "./requests-router";
import { bookmarksRouter } from "./bookmarks-router";
import { analyticsRouter } from "./analytics-router";
import { seedRouter } from "./seed-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  favorites: favoritesRouter,
  history: historyRouter,
  reviews: reviewsRouter,
  admin: adminRouter,
  anime: animeRouter,
  episodes: episodesRouter,
  settings: settingsRouter,
  chat: chatRouter,
  comments: commentsRouter,
  collections: collectionsRouter,
  subtitles: subtitlesRouter,
  recommendations: recommendationsRouter,
  notifications: notificationsRouter,
  upload: uploadRouter,
  cast: castRouter,
  achievements: achievementsRouter,
  timestamps: timestampsRouter,
  social: socialRouter,
  watchParty: watchPartyRouter,
  news: newsRouter,
  manga: mangaRouter,
  requests: requestsRouter,
  bookmarks: bookmarksRouter,
  analytics: analyticsRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;
