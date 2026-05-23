import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUp, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { NuroviaHero } from "@/sections/NuroviaHero";
import { SeasonAnime } from "@/sections/SeasonAnime";
import { TrendingCarousel } from "@/sections/TrendingCarousel";
import { TopPicksGrid } from "@/sections/TopPicksGrid";
import { ContinueWatching } from "@/sections/ContinueWatching";
import { Footer } from "@/sections/Footer";
import { CursorGlow } from "@/core/CursorGlow";
import { ToastContainer } from "@/core/ToastContainer";
import { useAuth } from "@/hooks/useAuth";
import type { Anime } from "@/types";

/* Lazy-loaded pages */
const AuthPage = lazy(() => import("@/pages/AuthPage").then(m => ({ default: m.AuthPage })));
const AnimeDetailPage = lazy(() => import("@/pages/AnimeDetailPage").then(m => ({ default: m.AnimeDetailPage })));
const BrowsePage = lazy(() => import("@/pages/BrowsePage").then(m => ({ default: m.BrowsePage })));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage").then(m => ({ default: m.FavoritesPage })));
const HistoryPage = lazy(() => import("@/pages/HistoryPage").then(m => ({ default: m.HistoryPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const WatchPage = lazy(() => import("@/pages/WatchPage").then(m => ({ default: m.WatchPage })));
const GenrePage = lazy(() => import("@/pages/GenrePage").then(m => ({ default: m.GenrePage })));
const SchedulePage = lazy(() => import("@/pages/SchedulePage").then(m => ({ default: m.SchedulePage })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.default })));

/* Lazy-loaded admin pages */
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminAnimePage = lazy(() => import("@/pages/admin/AdminAnimePage").then(m => ({ default: m.AdminAnimePage })));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage").then(m => ({ default: m.AdminUsersPage })));
const AdminReviewsPage = lazy(() => import("@/pages/admin/AdminReviewsPage").then(m => ({ default: m.AdminReviewsPage })));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage").then(m => ({ default: m.AdminAnalyticsPage })));
const AdminActivityPage = lazy(() => import("@/pages/admin/AdminActivityPage").then(m => ({ default: m.AdminActivityPage })));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage").then(m => ({ default: m.AdminSettingsPage })));
const AdminImportPage = lazy(() => import("@/pages/admin/AdminImportPage").then(m => ({ default: m.AdminImportPage })));
const AdvancedSearchPage = lazy(() => import("@/pages/AdvancedSearchPage").then(m => ({ default: m.AdvancedSearchPage })));
const CollectionsPage = lazy(() => import("@/pages/CollectionsPage").then(m => ({ default: m.CollectionsPage })));
const AnimeComparePage = lazy(() => import("@/pages/AnimeComparePage").then(m => ({ default: m.AnimeComparePage })));
const NewsPage = lazy(() => import("@/pages/NewsPage").then(m => ({ default: m.NewsPage })));
const MangaReaderPage = lazy(() => import("@/pages/MangaReaderPage").then(m => ({ default: m.MangaReaderPage })));
const SeasonalPage = lazy(() => import("@/pages/SeasonalPage").then(m => ({ default: m.SeasonalPage })));
const WatchPartyPage = lazy(() => import("@/pages/WatchPartyPage").then(m => ({ default: m.WatchPartyPage })));
const AnimeRequestsPage = lazy(() => import("@/pages/AnimeRequestsPage").then(m => ({ default: m.AnimeRequestsPage })));
const BookmarksPage = lazy(() => import("@/pages/BookmarksPage").then(m => ({ default: m.BookmarksPage })));
const ReviewsHubPage = lazy(() => import("@/pages/ReviewsHubPage").then(m => ({ default: m.ReviewsHubPage })));
const AdminAdvancedAnalyticsPage = lazy(() => import("@/pages/admin/AdminAdvancedAnalyticsPage").then(m => ({ default: m.AdminAdvancedAnalyticsPage })));
const AdminExportPage = lazy(() => import("@/pages/admin/AdminExportPage").then(m => ({ default: m.AdminExportPage })));
const WatchPartyRoomPage = lazy(() => import("@/pages/WatchPartyRoomPage").then(m => ({ default: m.WatchPartyRoomPage })));
const AdminSeedPage = lazy(() => import("@/pages/admin/AdminSeedPage").then(m => ({ default: m.AdminSeedPage })));

/* Admin route guard — waits for auth to load before deciding */
function AdminRoute({ children }: { children: React.ReactNode }) {
 const { isAuthenticated, isLoading } = useAuth();

 // Show loading spinner while auth state is resolving
 if (isLoading) {
   return (
     <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
       <div className="flex flex-col items-center gap-4">
         <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
           <Shield className="w-5 h-5 text-[#0a0a0a]" />
         </div>
         <div className="w-6 h-6 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
       </div>
     </div>
   );
 }

 // Only redirect after we've confirmed user is NOT authenticated
 if (!isAuthenticated) return <Navigate to="/login" replace />;
 return <>{children}</>;
}

function HomePage() {
 const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const timer = setTimeout(() => {
 setIsLoading(false);
 }, 1500);
 return () => clearTimeout(timer);
 }, []);

 const handleAnimeClick = (anime: Anime) => {
 navigate(`/watch/${anime.id}`);
 };

 return (
 <>
      <Helmet>
        <title>NUROVIA - Premium Anime Streaming</title>
        <meta name="description" content="Watch anime in premium quality. Thousands of titles, HD streaming, no ads." />
        <meta property="og:title" content="NUROVIA - Premium Anime Streaming" />
        <meta property="og:description" content="Watch anime in premium quality." />
        <meta property="og:type" content="website" />
      </Helmet>
 <NuroviaHero />
 <SeasonAnime onAnimeClick={handleAnimeClick} isLoading={isLoading} />
 <TrendingCarousel onAnimeClick={handleAnimeClick} isLoading={isLoading} />
 <TopPicksGrid onAnimeClick={handleAnimeClick} isLoading={isLoading} />
 <ContinueWatching isLoading={isLoading} />
 <Footer />
 </>
 );
}

/* Loading fallback */
function PageLoader() {
 return (
 <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nv-bg-body)" }}>
 <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
 </div>
 );
}

function App() {
 const location = useLocation();
 const isAuthPage = location.pathname === "/login";
 const isWatchPage = location.pathname.startsWith("/watch/");
 const isAdminPage = location.pathname.startsWith("/admin");
 const showNav = !isAuthPage && !isWatchPage && !isAdminPage;

 /* Scroll progress bar */
 const { scrollYProgress } = useScroll();
 const scaleX = useSpring(scrollYProgress, {
 stiffness: 100,
 damping: 30,
 restDelta: 0.001,
 });

 /* Back to top visibility */
 const [showBackToTop, setShowBackToTop] = useState(false);

 useEffect(() => {
 const handleScroll = () => {
 setShowBackToTop(window.scrollY > window.innerHeight * 0.5);
 };
 window.addEventListener("scroll", handleScroll, { passive: true });
 return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: "smooth" });
 };

 /* Scroll to top on route change */
 useEffect(() => {
 window.scrollTo(0, 0);
 }, [location.pathname]);

 return (
 <div className="min-h-screen" style={{ background: "var(--nv-bg-body)" }}>
 {/* Scroll Progress Bar */}
 {!isWatchPage && !isAdminPage && (
 <motion.div
 className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left rtl-flip"
 style={{
 scaleX,
 background: "linear-gradient(to right, #D4AF37, #F0D878, #D4AF37)",
 boxShadow: "0 0 8px rgba(212, 175, 55, 0.4), 0 0 16px rgba(212, 175, 55, 0.2)",
 }}
 />
 )}

 {showNav && <Navbar />}

 <Suspense fallback={<PageLoader />}>
 <Routes>
 {/* Public routes */}
 <Route path="/" element={<HomePage />} />
 <Route path="/login" element={<AuthPage />} />
 <Route path="/anime/:id" element={<AnimeDetailPage />} />
 <Route path="/watch/:animeId" element={<WatchPage />} />
 <Route path="/browse" element={<BrowsePage />} />
 <Route path="/favorites" element={<FavoritesPage />} />
 <Route path="/history" element={<HistoryPage />} />
 <Route path="/profile" element={<ProfilePage />} />
 <Route path="/settings" element={<SettingsPage />} />
 <Route path="/genre/:genreName" element={<GenrePage />} />
 <Route path="/schedule" element={<SchedulePage />} />
 <Route path="/search" element={<AdvancedSearchPage />} />
 <Route path="/collections" element={<CollectionsPage />} />
 <Route path="/compare" element={<AnimeComparePage />} />
 <Route path="/seasonal" element={<SeasonalPage />} />
 <Route path="/news" element={<NewsPage />} />
 <Route path="/party" element={<WatchPartyPage />} />
 <Route path="/party/:roomCode" element={<WatchPartyRoomPage />} />
 <Route path="/requests" element={<AnimeRequestsPage />} />
 <Route path="/bookmarks" element={<BookmarksPage />} />
 <Route path="/reviews-hub" element={<ReviewsHubPage />} />

 {/* Admin routes */}
 <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
 <Route path="/admin/anime" element={<AdminRoute><AdminAnimePage /></AdminRoute>} />
 <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
 <Route path="/admin/reviews" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
 <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
 <Route path="/admin/advanced-analytics" element={<AdminRoute><AdminAdvancedAnalyticsPage /></AdminRoute>} />
 <Route path="/admin/activity" element={<AdminRoute><AdminActivityPage /></AdminRoute>} />
 <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
 <Route path="/admin/export" element={<AdminRoute><AdminExportPage /></AdminRoute>} />
 <Route path="/admin/seed" element={<AdminRoute><AdminSeedPage /></AdminRoute>} />

 <Route path="*" element={<NotFound />} />
 </Routes>
 </Suspense>

 {/* Back to Top Button */}
 <AnimatePresence>
 {showBackToTop && showNav && (
 <motion.button
 onClick={scrollToTop}
 className="fixed bottom-6 end-[clamp(3vw,5vw,8vw)] z-50 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
 style={{
 background: "rgba(212, 175, 55, 0.15)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(212, 175, 55, 0.3)",
 boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 12px rgba(212, 175, 55, 0.1)",
 }}
 initial={{ opacity: 0, y: 20, scale: 0.8 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.8 }}
 whileHover={{ scale: 1.1, boxShadow: "0 6px 24px rgba(212, 175, 55, 0.25)" }}
 whileTap={{ scale: 0.9 }}
 transition={{ duration: 0.3 }}
 >
 <ArrowUp className="w-4 h-4 text-[#D4AF37]" />
 </motion.button>
 )}
 </AnimatePresence>

 {/* Nurovia Global Systems */}
 <CursorGlow />
 <ToastContainer />
 </div>
 );
}

export default App;
