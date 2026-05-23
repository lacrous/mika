import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type Lang = "ar" | "en";

interface LanguageContextType {
 lang: Lang;
 setLang: (lang: Lang) => void;
 t: (key: string) => string;
 isRTL: boolean;
}

const translations: Record<Lang, Record<string, string>> = {
 ar: {
 // Brand
 "brand.name": "ميكا انمي",

 // Navbar
 "nav.home": "الرئيسية",
 "nav.trending": "الأكثر رواجاً",
 "nav.topPicks": "الأفضل لك",
 "nav.continue": "متابعة المشاهدة",
 "nav.favorites": "المفضلة",
 "nav.signIn": "تسجيل الدخول",

 // Hero
 "hero.trendingNow": "الأكثر رواجاً الآن",
 "hero.playNow": "شاهد الآن",
 "hero.addFavorites": "أضف إلى المفضلة",

 // Trending
 "trending.title": "الأكثر رواجاً",
 "trending.viewAll": "عرض الكل",
 "trending.trendingBadge": "الأكثر رواجاً",

 // Top Picks
 "topPicks.title": "الأفضل لك",
 "topPicks.category": "التصنيف",
 "topPicks.popular": "الأكثر شعبية",
 "topPicks.latest": "الأحدث",
 "topPicks.noResults": "لا توجد أنميات في هذا التصنيف.",
 "topPicks.showAll": "عرض الكل",

 // Continue Watching
 "continue.title": "متابعة المشاهدة",
 "continue.subtitle": "استئناف من حيث توقفت",
 "continue.watched": "تم المشاهدة",
 "continue.ep": "حلقة",

 // Modal
 "modal.watchNow": "شاهد الآن",
 "modal.status": "الحالة",
 "modal.studio": "الاستوديو",
 "modal.episodes": "حلقات",
 "modal.forgotPassword": "نسيت كلمة المرور؟",

 // Auth
 "auth.welcomeBack": "أهلاً بعودتك",
 "auth.signInSubtitle": "سجل الدخول لمتابعة المشاهدة",
 "auth.createAccount": "إنشاء حساب",
 "auth.signUpSubtitle": "انضم إلى مجتمع الأنمي",
 "auth.email": "البريد الإلكتروني",
 "auth.password": "كلمة المرور",
 "auth.confirmPassword": "تأكيد كلمة المرور",
 "auth.username": "اسم المستخدم",
 "auth.signIn": "تسجيل الدخول",
 "auth.createAccountBtn": "إنشاء حساب",
 "auth.noAccount": "ليس لديك حساب؟",
 "auth.hasAccount": "لديك حساب بالفعل؟",
 "auth.signUpLink": "سجل الآن",
 "auth.signInLink": "تسجيل الدخول",
 "auth.forgotPassword": "نسيت كلمة المرور؟",
 "auth.or": "أو",

 // Footer
 "footer.about": "عنّا",
 "footer.privacy": "الخصوصية",
 "footer.terms": "الشروط",
 "footer.contact": "اتصل بنا",
 "footer.copyright": "© 2025 ميكا أنمي",

 // Search
 "search.placeholder": "ابحث عن أنمي...",
 "search.noResults": "لا توجد نتائج",

 // Language
 "lang.ar": "العربية",
 "lang.en": "English",
 "lang.backToHome": "العودة إلى الرئيسية",
 },
 en: {
 // Brand
 "brand.name": "Mika Anime",

 // Navbar
 "nav.home": "Home",
 "nav.trending": "Trending",
 "nav.topPicks": "Top Picks",
 "nav.continue": "Continue",
 "nav.favorites": "Favorites",
 "nav.signIn": "Sign In",

 // Hero
 "hero.trendingNow": "TRENDING NOW",
 "hero.playNow": "Play Now",
 "hero.addFavorites": "Add to Favorites",

 // Trending
 "trending.title": "Trending Now",
 "trending.viewAll": "View All",
 "trending.trendingBadge": "TRENDING",

 // Top Picks
 "topPicks.title": "Top Picks for You",
 "topPicks.category": "Category",
 "topPicks.popular": "Popular",
 "topPicks.latest": "Latest",
 "topPicks.noResults": "No anime found in this category.",
 "topPicks.showAll": "Show all anime",

 // Continue Watching
 "continue.title": "Continue Watching",
 "continue.subtitle": "Pick up where you left off",
 "continue.watched": "watched",
 "continue.ep": "Ep",

 // Modal
 "modal.watchNow": "Watch Now",
 "modal.status": "Status",
 "modal.studio": "Studio",
 "modal.episodes": "episodes",
 "modal.forgotPassword": "Forgot password?",

 // Auth
 "auth.welcomeBack": "Welcome Back",
 "auth.signInSubtitle": "Sign in to continue watching",
 "auth.createAccount": "Create Account",
 "auth.signUpSubtitle": "Join the anime community",
 "auth.email": "Email",
 "auth.password": "Password",
 "auth.confirmPassword": "Confirm Password",
 "auth.username": "Username",
 "auth.signIn": "Sign In",
 "auth.createAccountBtn": "Create Account",
 "auth.noAccount": "Don't have an account?",
 "auth.hasAccount": "Already have an account?",
 "auth.signUpLink": "Sign up",
 "auth.signInLink": "Sign in",
 "auth.forgotPassword": "Forgot password?",
 "auth.or": "or",

 // Footer
 "footer.about": "About",
 "footer.privacy": "Privacy",
 "footer.terms": "Terms",
 "footer.contact": "Contact",
 "footer.copyright": "© 2025 Mika Anime",

 // Search
 "search.placeholder": "Search anime...",
 "search.noResults": "No results found",

 // Language
 "lang.ar": "العربية",
 "lang.en": "English",
 "lang.backToHome": "Back to Home",
 },
};

const LanguageContext = createContext<LanguageContextType>({
 lang: "ar",
 setLang: () => {},
 t: (key: string) => key,
 isRTL: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
 const [lang, setLangState] = useState<Lang>("ar");

 useEffect(() => {
 document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
 document.documentElement.lang = lang;
 }, [lang]);

 const setLang = useCallback((newLang: Lang) => {
 setLangState(newLang);
 }, []);

 const t = useCallback(
 (key: string): string => {
 return translations[lang][key] || key;
 },
 [lang]
 );

 return (
 <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === "ar" }}>
 {children}
 </LanguageContext.Provider>
 );
}

export function useLanguage() {
 return useContext(LanguageContext);
}
