# Mika Anime - Complete Next Steps Plan

## Current State Summary

**Frontend (UI Complete):** 11 pages, 8 sections, 20+ components, 3D effects, RTL support, glassmorphism design
**Backend (API Complete):** tRPC + Drizzle ORM + MySQL, full auth, `adminQuery` middleware ready, role field exists
**Database:** users, local_users, favorites, watch_history tables — all operational
**Key Gap:** Backend APIs exist but frontend uses mock data. Admin role infrastructure is ready but unused.

---

## Part 1: Connect Frontend to Real Backend (Week 1)

Your backend already has complete CRUD APIs. The frontend just needs to call them.

### 1.1 Favorites → Real Database
| Current | Target |
|---------|--------|
| `localStorage` mock data | `trpc.favorites.list.useQuery()` |
| Fake remove animation | `trpc.favorites.remove.useMutation()` |
| 6 hardcoded items | User's actual saved anime |
| No auth gate | Login redirect for unauthenticated users |

**Files:** `src/pages/FavoritesPage.tsx`, `src/components/AnimeCard.tsx`

### 1.2 Watch History → Real Database
| Current | Target |
|---------|--------|
| `generateMockHistory()` | `trpc.history.list.useQuery()` |
| Fake progress bars | Real progress from `trpc.history.getProgress()` |
| No persistence | `trpc.history.save.mutate()` on every episode change |

**Files:** `src/pages/HistoryPage.tsx`, `src/pages/WatchPage.tsx`

### 1.3 Heart Buttons on Cards
| Current | Target |
|---------|--------|
| Decorative only | `trpc.favorites.add.mutate()` + toast notification |
| No visual feedback | Heart fills gold, "Added to Favorites" tooltip |
| Not persisted | Saved to MySQL, survives across sessions |

**Files:** `src/components/AnimeCard.tsx`, `src/pages/AnimeDetailPage.tsx`, `src/pages/WatchPage.tsx`

---

## Part 2: Reviews & Community (Week 1-2)

### 2.1 Reviews Database + API
**New table `reviews`:**
- `id` (serial PK), `userId` (int), `animeId` (varchar)
- `rating` (int 1-10), `content` (text), `createdAt`, `updatedAt`

**New `api/reviews-router.ts`:**
- `list` — all reviews for an anime (public)
- `create` — add review (requires auth)
- `update` — edit own review (requires auth)
- `delete` — remove own review (requires auth)
- `myReview` — get current user's review for an anime
- `stats` — get average rating + count for an anime

### 2.2 Reviews UI on Anime Detail Page
**New component `src/components/ReviewsSection.tsx`:**
- Star rating input (1-10 scale, 0.5 increments)
- Review text area with character limit
- List of reviews with user avatar, name, date, rating
- "Helpful" thumbs up/down per review
- Sort: newest, highest rated, most helpful

### 2.3 Rating Summary Card
- Large average rating number (e.g., "9.2")
- Rating distribution bar chart (10★, 9★, 8★... 1★)
- Total review count
- "Write a Review" CTA button

---

## Part 3: Admin Dashboard (Week 2-3) — YOUR ADDITION

Your backend already has `adminQuery` middleware + `role` field on both user tables. This unlocks a full admin panel.

### 3.1 Admin Authentication & Access Control
- **Route guard:** `/admin/*` routes check `user?.role === "admin"`
- **Redirect:** Non-admin users get redirected to home page
- **Admin link:** Conditionally render "Dashboard" link in Profile Dropdown when `user.role === "admin"`
- **New hook:** `useIsAdmin()` returns boolean for role checks

### 3.2 Admin Layout — Collapsible Sidebar
**New component `src/components/admin/AdminLayout.tsx`:**
- Fixed left sidebar (240px, collapsible to 64px)
- Sidebar items with icons: Dashboard, Anime, Users, Reviews, Analytics, Settings
- Gold active state indicator on current page
- Mobile: sidebar becomes slide-out drawer
- Top bar: search, admin avatar, notifications bell

**Sidebar navigation:**
| Route | Icon | Label AR | Label EN |
|-------|------|----------|----------|
| `/admin` | LayoutDashboard | لوحة التحكم | Dashboard |
| `/admin/anime` | Film | الأنمي | Anime |
| `/admin/users` | Users | المستخدمين | Users |
| `/admin/reviews` | MessageSquare | التقييمات | Reviews |
| `/admin/analytics` | BarChart3 | التحليلات | Analytics |
| `/admin/settings` | Settings | إعدادات | Settings |

### 3.3 Dashboard Overview Page (`/admin`)
**New page `src/pages/admin/AdminDashboard.tsx`:**

**Stats Cards Row (4 cards):**
- Total Anime — count from anime data
- Total Users — `db.select({ count: count() }).from(users)`
- Total Reviews — review count
- Active Today — users with watch history today

**Recent Activity Feed:**
- "User X added Anime Y to favorites"
- "User Z completed Episode 5 of Demon Slayer"
- "New review posted for Attack on Titan"
- Timestamps with "2 min ago" formatting

**Quick Action Buttons:**
- "+ Add Anime" → navigates to /admin/anime/add
- "Manage Users" → navigates to /admin/users
- "View Analytics" → navigates to /admin/analytics

### 3.4 Anime Management (`/admin/anime`)
**New page `src/pages/admin/AdminAnimePage.tsx`:**

**Anime List Table:**
- Columns: Thumbnail, Title, Year, Rating, Episodes, Status, Genres, Actions
- Sortable by clicking column headers
- Pagination (10 per page)
- Search bar for filtering
- Bulk select with delete

**Add/Edit Anime Form:**
- Title (text input)
- Synopsis (textarea)
- Year (number input)
- Rating (slider 0-10, 0.1 step)
- Episodes (number input)
- Status (dropdown: Ongoing, Completed, Upcoming)
- Studio (text input)
- Genres (multi-select chips)
- Image URL (text input with preview)
- Trending toggle (switch)
- Validation with error messages

**Delete Confirmation:**
- Modal: "Are you sure you want to delete [Anime Name]?"
- Red delete button, cancel option
- Toast: "Anime deleted successfully"

### 3.5 User Management (`/admin/users`)
**New page `src/pages/admin/AdminUsersPage.tsx`:**

**Users Table:**
- Columns: Avatar, Name, Email, Role, Auth Type, Joined Date, Actions
- Filter by role: All, Admin, User
- Search by name/email
- Sortable columns

**Actions per user:**
- View details (modal with full user info)
- Change role (dropdown: user → admin, admin → user)
- Delete user with confirmation

### 3.6 Reviews Moderation (`/admin/reviews`)
**New page `src/pages/admin/AdminReviewsPage.tsx`:**

**Reviews Table:**
- Columns: User, Anime, Rating, Content, Date, Actions
- Filter by rating range
- Search by anime title or user name
- Status badges: Approved, Flagged, Deleted

**Actions:**
- Approve/reject review
- Delete inappropriate content
- View anime page link

### 3.7 Analytics Page (`/admin/analytics`)
**New page `src/pages/admin/AdminAnalyticsPage.tsx`:**

**Charts (using recharts or chart.js):**
- Daily Active Users — line chart (last 30 days)
- Most Watched Anime — horizontal bar chart (top 10)
- User Registration Trend — line chart (last 12 months)
- Genre Popularity — pie chart
- Watch Time by Day — heatmap-style grid

**Stats Summary:**
- Total watch time (hours)
- Average session duration
- New users this week
- Most active user

### 3.8 Admin Settings (`/admin/settings`)
**New page `src/pages/admin/AdminSettingsPage.tsx`:**

**General Settings:**
- Site name (editable, default "Mika Anime")
- Logo upload/preview
- Default language (AR/EN toggle)
- Maintenance mode toggle

**Homepage Settings:**
- Select featured anime for hero slider
- Reorder sections (drag & drop)
- Enable/disable sections

**API:** New `admin-router.ts` with `adminQuery` protected endpoints:
- `stats` — aggregated dashboard data
- `users.list` — paginated user list
- `users.updateRole` — change user role
- `users.delete` — remove user
- `reviews.list` — all reviews with filters
- `reviews.moderate` — approve/reject/delete
- `settings.get` / `settings.update` — site configuration

---

## Part 4: Smart Recommendations & Discovery (Week 3)

### 4.1 "Because You Watched" Section
**Logic:** Based on `watchHistory` + `favorites`, find anime sharing genres/studio
**New component:** `src/components/Recommendations.tsx`
**Placement:** Anime detail page, below "Related Anime"

### 4.2 Personalized Home
After "Continue Watching", add:
- "Recommended For You" — algorithmic picks based on history
- "Top Rated in [Favorite Genre]" — genre the user watches most

### 4.3 Genre Pages
**Route:** `/genre/:genreName`
**New page:** `src/pages/GenrePage.tsx`
- Hero banner with genre name
- Filterable grid of all anime in genre
- Related genres sidebar
- Make all genre badges clickable

---

## Part 5: Release Calendar (Week 3-4)

### 5.1 Schedule Page
**Route:** `/schedule`
**New page:** `src/pages/SchedulePage.tsx`
- Weekly calendar (Sun-Sat)
- Anime airing each day with episode number + time
- "Today" highlight with gold border
- Click anime → go to detail page
- "Airing Now" section at top

### 5.2 Schedule Data
**New file:** `src/data/schedule.ts`
- Mock schedule for popular ongoing anime
- Day, time, episode number, anime reference

---

## Part 6: Performance Polish (Ongoing)

### 6.1 Code Splitting
- `React.lazy()` for all pages except Home
- Separate chunk for Three.js particles
- Admin dashboard lazy-loaded only when accessed

### 6.2 Image Optimization
- `loading="lazy"` on all images
- WebP format with JPEG fallback
- Blur placeholder while loading

### 6.3 Animation Performance
- Reduce particle count on mobile (< 768px)
- `prefers-reduced-motion` media query support
- GPU-accelerated transforms only

---

## Database Schema Additions

```sql
-- New: reviews table
reviews:
  id (serial PK)
  userId (int, unsigned)
  userType (varchar: "local" | "oauth")
  animeId (varchar)
  animeTitle (varchar)
  rating (int, 1-10)
  content (text)
  isApproved (boolean, default true)
  createdAt (timestamp)
  updatedAt (timestamp)

-- New: site_settings table
site_settings:
  id (serial PK)
  key (varchar, unique)
  value (json)
  updatedAt (timestamp)
```

---

## Complete File Inventory (New Files to Create)

### Frontend Pages (7 new)
```
src/pages/admin/
  AdminDashboard.tsx      — Overview with stats + activity
  AdminAnimePage.tsx      — Anime CRUD table + form
  AdminAnimeForm.tsx      — Add/Edit anime form modal
  AdminUsersPage.tsx      — User management table
  AdminReviewsPage.tsx    — Reviews moderation table
  AdminAnalyticsPage.tsx  — Charts + stats
  AdminSettingsPage.tsx   — Site configuration

src/pages/
  GenrePage.tsx           — Genre browsing page
  SchedulePage.tsx        — Weekly release calendar
```

### Frontend Components (5 new)
```
src/components/admin/
  AdminLayout.tsx         — Sidebar + top bar layout
  AdminSidebar.tsx        — Collapsible sidebar navigation
  AdminStatCard.tsx       — Dashboard stat card
  AdminTable.tsx          — Reusable sortable table
  ReviewsSection.tsx      — Reviews on anime detail page
```

### Backend API (2 new)
```
api/
  reviews-router.ts       — CRUD for reviews
  admin-router.ts         — Admin-only stats + management
```

### Database (1 modified)
```
db/schema.ts             — Add reviews + site_settings tables
```

---

## Recommended Implementation Order

| Week | Phase | Tasks | Deliverable |
|------|-------|-------|-------------|
| **Week 1** | 1.1-1.3 | Connect favorites + history to DB | Real user data persists |
| **Week 1** | 2.1-2.3 | Reviews system | Users can rate & review anime |
| **Week 2** | 3.1-3.3 | Admin sidebar + dashboard + anime CRUD | Working admin panel |
| **Week 2** | 3.4-3.5 | User management + reviews moderation | Full user & review control |
| **Week 3** | 3.6-3.8 | Analytics charts + admin settings | Complete admin dashboard |
| **Week 3** | 4.1-4.3 | Recommendations + genre pages | Smart discovery |
| **Week 4** | 5.1-5.2 | Release calendar | Weekly schedule page |
| **Week 4** | 6.1-6.3 | Code splitting + image optimization | Fast production build |

---

## Total Scope Summary

| Category | Count |
|----------|-------|
| New frontend pages | 9 |
| New components | 5 |
| New API routers | 2 |
| Modified pages | 5 |
| Database tables added | 2 |
| **Total new files** | **16** |
| **Total files modified** | **7** |

---

Tell me:
- **"Do all"** — Full implementation across all 6 parts
- **"Start with Part 1"** — Connect backend first
- **"Start with Part 3 (Admin)"** — Build the dashboard first
- **Custom order** — Tell me which parts in which order
