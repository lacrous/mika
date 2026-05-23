# NUROVIA - Premium Anime Streaming Platform

> A luxury, feature-rich anime streaming platform built with React 19, TypeScript, Three.js, and tRPC. Dark theme with gold accents, full RTL Arabic support, and 35+ production-ready features.

---

## Feature Overview

| # | Feature | Status | Category |
|---|---------|--------|----------|
| 1 | **Responsive Video Player** | Ready | Core |
| 2 | **Full Admin Control Panel** | Ready | Admin |
| 3 | **Episode Management System** | Ready | Core |
| 4 | **User Authentication (OAuth + Local)** | Ready | Auth |
| 5 | **Favorites & Watchlist** | Ready | User |
| 6 | **Watch History** | Ready | User |
| 7 | **Reviews & Ratings** | Ready | Social |
| 8 | **Light/Dark Mode Toggle** | Ready | UX |
| 9 | **Arabic/English with Full RTL** | Ready | i18n |
| 10 | **Real-time Search** | Ready | Discovery |
| 11 | **Comments System** | Ready | Social |
| 12 | **Anime Recommendations** | Ready | Discovery |
| 13 | **Subtitles Support** | Ready | Playback |
| 14 | **Collections System** | Ready | User |
| 15 | **Advanced Search (Filters)** | Ready | Discovery |
| 16 | **Cast & Characters** | Ready | Content |
| 17 | **Trailers Integration** | Ready | Content |
| 18 | **Release Calendar** | Ready | Discovery |
| 19 | **Achievements System** | Ready | Gamification |
| 20 | **Picture-in-Picture** | Ready | Playback |
| 21 | **Anime Comparison** | Ready | Discovery |
| 22 | **Video Timestamps** | Ready | Playback |
| 23 | **Auto Theme by Time** | Ready | UX |
| 24 | **Multi-Language UI** | Ready | i18n |
| 25 | **User Profiles** | Ready | Social |
| 26 | **Social Features (Follow, Activity)** | Ready | Social |
| 27 | **Seasonal Anime Browser** | Ready | Discovery |
| 28 | **Watch Party (Synchronized)** | Ready | Social |
| 29 | **News & Articles** | Ready | Content |
| 30 | **Manga Reader** | Ready | Content |
| 31 | **Advanced Analytics Dashboard** | Ready | Admin |
| 32 | **Anime Requests & Voting** | Ready | Community |
| 33 | **Bookmarks & Reminders** | Ready | User |
| 34 | **Reviews Hub** | Ready | Social |
| 35 | **Admin Export (JSON/CSV)** | Ready | Admin |
| 36 | **Bulk Import Tool** | Ready | Admin |
| 37 | **Database Seeder** | Ready | Admin |
| 38 | **Navigation Menu** | Ready | UX |
| 39 | **Toast Notifications** | Ready | UX |
| 40 | **PWA (Progressive Web App)** | Ready | Platform |
| 41 | **Live Chat System** | Ready | Social |
| 42 | **SEO & Meta Tags** | Ready | Platform |

---

## Core Streaming

### Video Player
- Custom-built HTML5 video player with luxury gold-themed controls
- Keyboard shortcuts (Space, arrows, F, M)
- Quality selector, volume control, fullscreen
- Thumbnail hover preview on progress bar
- Episode auto-advance with countdown
- Time display with current/total duration

### Picture-in-Picture
- PiP mode for multitasking while watching
- Mini floating player that persists across page navigation
- One-click toggle from the player controls

### Subtitles Support
- Upload and manage subtitle files (.srt, .vtt)
- Multiple language subtitle tracks per episode
- On/off toggle with timing offset adjustment

### Video Timestamps
- Users can create timestamp bookmarks while watching
- Share specific moments with deep links
- Community timestamps visible on progress bar

---

## Discovery & Browsing

### Real-time Search
- Debounced live search with instant results dropdown
- Search by title, genre, studio, or year
- Keyboard navigable results

### Advanced Search
- Multi-filter system with genre, year, status, rating, studio
- Sort options (popularity, rating, newest)
- Results grid with infinite scroll capability

### Anime Recommendations
- Smart recommendation engine based on watch history
- "Because you watched X" suggestions
- Similar genre and studio matching

### Collections System
- Create custom anime collections (e.g., "Summer 2024", "Top Fantasy")
- Add/remove anime from collections
- Public and private collection visibility

### Anime Comparison
- Side-by-side comparison of up to 3 anime
- Compare ratings, genres, episodes, studio, synopsis
- Visual difference highlighting

### Seasonal Browser
- Browse anime by season (Winter, Spring, Summer, Fall)
- Historical season archives
- Season preview with upcoming anime

### Release Calendar
- Weekly schedule of upcoming episodes
- Grid view of release days
- Subscribe to series for notifications

### News & Articles
- Curated anime news feed
- Category-based filtering (News, Previews, Reviews)
- Full article reading experience with related anime links

---

## Social & Community

### Comments System
- Nested comment threads on anime pages
- Like/dislike comments with reputation scoring
- Real-time comment updates

### Reviews & Ratings
- Star-based rating system (1-10 scale)
- Written reviews with spoiler tagging
- Review helpfulness voting
- Reviews Hub with distribution charts

### Watch Party
- Create synchronized watch rooms
- Invite friends via room code
- Host controls playback for all participants
- Built-in chat sidebar for real-time discussion
- Participant list with host crown indicator

### User Profiles
- Public profile pages with activity feed
- Favorite anime showcase
- Review history and statistics
- Achievement badges display

### Social Features
- Follow/unfollow other users
- Activity feed showing friends' actions
- Public activity timeline

### Live Chat
- Global chat room for all users
- Real-time messaging with user presence
- Arabic and English support

### Anime Requests
- Community-driven anime request system
- Voting on requested titles
- Admin dashboard for request management

---

## User Experience

### Authentication
- OAuth 2.0 (Google, Discord, GitHub)
- Local username/password registration
- JWT token-based sessions
- Role-based access control (User/Admin)

### Favorites & Watchlist
- One-click favorite toggle on any anime
- Persistent favorites across devices
- Quick access from profile and navigation

### Bookmarks & Reminders
- Bookmark specific episodes to watch later
- Set reminders for upcoming releases
- Notification preferences per series

### Watch History
- Automatic tracking of watched episodes
- Resume from where you left off
- History management (clear individual or all)

### Achievements System
- Unlock achievements for platform activity
- Categories: Watch, Social, Explorer, Collector
- Progress tracking toward next achievement

### Light/Dark Mode
- Instant theme toggle with smooth transition
- CSS variable-based theming system
- Auto theme based on time of day option
- Persistent preference saved to localStorage

### RTL Support
- Full Arabic interface with proper RTL layout
- Logical CSS properties for bidirectional text
- Arabic translations for all UI elements
- Right-aligned text and reversed layouts

### Toast Notifications
- Non-blocking toast messages for all user actions
- Success, error, warning, and info variants
- Auto-dismiss with progress indicator

### Navigation Menu
- Full-screen slide-out navigation panel
- Main and Admin section tabs
- 13 main links + 10 admin links
- Spring-based open/close animation

---

## Content Management

### Episode System
- Full CRUD for episodes per anime
- Video URL management with validation
- Episode metadata (title, number, duration, filler flag)
- Batch episode operations

### Cast & Characters
- Character database with voice actors
- Character profiles with images and descriptions
- Link characters to anime series

### Trailers
- Trailer video integration for anime
- BigBuckBunny sample trailer for seeded content
- Trailer playback in modal overlay

### Manga Reader
- Built-in manga chapter reader
- Page-by-page navigation
- Chapter list with progress tracking

---

## Admin Panel

### Dashboard
- Real-time statistics cards (views, users, reviews, favorites)
- Weekly activity charts with Recharts
- Genre distribution pie chart
- Recent activity feed
- Top-performing anime table
- 3D animated hero section with Three.js

### Anime Manager
- Full CRUD for anime entries
- Bulk operations (delete multiple)
- Search and filter within admin
- Episode count and status management

### User Management
- View all registered users
- Role management (promote/demote to admin)
- User activity overview
- Account status management

### Reviews Moderation
- View all user reviews
- Approve/reject reviews
- Filter by rating, date, or status
- Bulk moderation actions

### Analytics
- View counts and engagement metrics
- User growth charts
- Popular content breakdown
- Device and browser statistics

### Advanced Analytics
- Detailed charts with multiple data series
- Trend analysis with period comparison
- Exportable reports
- Custom date range selection

### Bulk Import
- CSV import for batch anime uploads
- Template download for correct format
- Validation and error reporting
- Preview before import

### Export & Backup
- Export anime data as JSON or CSV
- Export user data (admin only)
- Export reviews and activity logs
- Downloadable backup files

### Database Seeder
- One-click seed with 25 popular anime titles
- Auto-generated episodes with video links
- 4 seed news articles
- Safe to run multiple times (skips existing data)

### Activity Logs
- Track all admin actions
- Timestamped audit trail
- Filter by action type or user

### Settings
- Platform configuration
- Theme defaults
- Feature toggles

---

## Platform Features

### PWA (Progressive Web App)
- Service Worker for offline caching
- Installable on mobile home screens
- Web App Manifest with icons and theme
- Offline page support

### SEO
- React Helmet Async for dynamic meta tags
- Open Graph tags for social sharing
- Structured data support
- Sitemap generation ready

### Performance
- Lazy-loaded pages with code splitting
- Suspense boundaries with loading states
- Optimized images with lazy loading
- Cursor glow effect for luxury feel
- Scroll progress bar indicator

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Animation | Framer Motion |
| Charts | Recharts |
| Backend | tRPC 11.x + Hono |
| ORM | Drizzle ORM |
| Database | MySQL (cloud-compatible) |
| Auth | OAuth 2.0 + JWT |
| Icons | Lucide React |

---

## Database Schema (26 Tables)

- `users` - Registered users with OAuth/local auth
- `localUsers` - Local authentication accounts
- `anime` - Anime series metadata
- `episodes` - Episode data with video URLs
- `favorites` - User favorite anime
- `watchHistory` - Episode watch history
- `reviews` - User reviews and ratings
- `comments` - Nested comment threads
- `commentLikes` - Comment like/dislike tracking
- `collections` - User-created anime collections
- `collectionItems` - Anime within collections
- `subtitles` - Subtitle file references
- `notificationPreferences` - User notification settings
- `animeCharacters` - Character and cast data
- `userAchievements` - Unlocked achievements
- `watchTimestamps` - Video timestamp bookmarks
- `userFollows` - Social follow relationships
- `userActivities` - Activity feed entries
- `watchParties` - Watch party room data
- `watchPartyParticipants` - Party attendee tracking
- `newsPosts` - News and article content
- `mangaSeries` - Manga series metadata
- `mangaChapters` - Manga chapter data
- `animeRequests` - Community anime requests
- `requestVotes` - Request voting records
- `bookmarks` - User bookmarks and reminders
- `reviewVotes` - Review helpfulness votes
- `analyticsDaily` - Daily analytics snapshots

---

## API Endpoints (25+ Routers)

`auth`, `localAuth`, `favorites`, `history`, `reviews`, `admin`, `anime`, `episodes`, `settings`, `chat`, `comments`, `collections`, `subtitles`, `recommendations`, `notifications`, `upload`, `cast`, `achievements`, `timestamps`, `social`, `watchParty`, `news`, `manga`, `requests`, `bookmarks`, `analytics`, `seed`

---

## UI/UX Design System

- **Primary Accent**: `#D4AF37` (Luxury Gold)
- **Background**: `#0a0a0a` (Dark) / `#f5f5f0` (Light)
- **Surface**: `#141414` (Dark) / `#ffffff` (Light)
- **Text Primary**: `#ffffff` (Dark) / `#0a0a0a` (Light)
- **Text Secondary**: `#E0E0E0` (Dark) / `#555555` (Light)
- **Font**: Inter (geometric, modern)
- **Border Radius**: Consistent `0.75rem` - `1rem`
- **Shadows**: Gold-tinted glow effects
- **Transitions**: `0.2s` - `0.3s` ease

---

*NUROVIA - Where Anime Meets Luxury.*
