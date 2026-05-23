# MIKA - منصة بث الأنمي المتميزة | Premium Anime Streaming Platform

> منصة بث أنمي فاخرة وغنية بالميزات، مبنية باستخدام React 19, TypeScript, Three.js, و tRPC. تصميم داكن مع لمسات ذهبية، دعم كامل للعربية مع RTL، وأكثر من 40 ميزة جاهزة للإنتاج.

> A luxury, feature-rich anime streaming platform built with React 19, TypeScript, Three.js, and tRPC. Dark theme with gold accents, full RTL Arabic support, and 40+ production-ready features.

---

## نظرة عامة على الميزات | Feature Overview

| # | الميزة (Feature) | الحالة (Status) | التصنيف (Category) |
|---|---------|--------|----------|
| 1 | **مشغل فيديو مخصص | Custom Video Player** | جاهز Ready | أساسي Core |
| 2 | **لوحة تحكم كاملة | Full Admin Panel** | جاهز Ready | إدارة Admin |
| 3 | **نظام إدارة الحلقات | Episode Management** | جاهز Ready | أساسي Core |
| 4 | **تسجيل دخول (OAuth + محلي) | Authentication** | جاهز Ready | أمان Auth |
| 5 | **المفضلة وقائمة المشاهدة | Favorites & Watchlist** | جاهز Ready | مستخدم User |
| 6 | **سجل المشاهدة | Watch History** | جاهز Ready | مستخدم User |
| 7 | **التقييمات والمراجعات | Reviews & Ratings** | جاهز Ready | اجتماعي Social |
| 8 | **الوضع الداكن/الفاتح | Dark/Light Mode** | جاهز Ready | تجربة UX |
| 9 | **عربي/إنجليزي مع RTL | Arabic/English RTL** | جاهز Ready | توطين i18n |
| 10 | **بحث فوري | Real-time Search** | جاهز Ready | اكتشاف Discovery |
| 11 | **نظام التعليقات | Comments System** | جاهز Ready | اجتماعي Social |
| 12 | **توصيات الأنمي | Recommendations** | جاهز Ready | اكتشاف Discovery |
| 13 | **دعم الترجمة | Subtitles Support** | جاهز Ready | تشغيل Playback |
| 14 | **نظام المجموعات | Collections** | جاهز Ready | مستخدم User |
| 15 | **بحث متقدم (فلاتر) | Advanced Search** | جاهز Ready | اكتشاف Discovery |
| 16 | **الممثلون والشخصيات | Cast & Characters** | جاهز Ready | محتوى Content |
| 17 | **مقاطع الدعاية | Trailers** | جاهز Ready | محتوى Content |
| 18 | **تقويم الإصدارات | Release Calendar** | جاهز Ready | اكتشاف Discovery |
| 19 | **نظام الإنجازات | Achievements** | جاهز Ready | تحفيز Gamification |
| 20 | **صورة داخل صورة | Picture-in-Picture** | جاهز Ready | تشغيل Playback |
| 21 | **مقارنة الأنمي | Anime Comparison** | جاهز Ready | اكتشاف Discovery |
| 22 | **الطوابع الزمنية | Timestamps** | جاهز Ready | تشغيل Playback |
| 23 | **وضع تلقائي حسب الوقت | Auto Theme** | جاهز Ready | تجربة UX |
| 24 | **واجهة متعددة اللغات | Multi-Language** | جاهز Ready | توطين i18n |
| 25 | **الملفات الشخصية | User Profiles** | جاهز Ready | اجتماعي Social |
| 26 | **متابعة المستخدمين | Social Features** | جاهز Ready | اجتماعي Social |
| 27 | **متصفح المواسم | Seasonal Browser** | جاهز Ready | اكتشاف Discovery |
| 28 | **حفلة مشاهدة متزامنة | Watch Party** | جاهز Ready | اجتماعي Social |
| 29 | **الأخبار والمقالات | News & Articles** | جاهز Ready | محتوى Content |
| 30 | **قارئ المانجا | Manga Reader** | جاهز Ready | محتوى Content |
| 31 | **تحليلات متقدمة | Advanced Analytics** | جاهز Ready | إدارة Admin |
| 32 | **طلبات الأنمي والتصويت | Anime Requests** | جاهز Ready | مجتمع Community |
| 33 | **الإشارات المرجعية | Bookmarks** | جاهز Ready | مستخدم User |
| 34 | **مركز المراجعات | Reviews Hub** | جاهز Ready | اجتماعي Social |
| 35 | **تصدير البيانات | Admin Export** | جاهز Ready | إدارة Admin |
| 36 | **استيراد مجمع | Bulk Import** | جاهز Ready | إدارة Admin |
| 37 | **بيانات تجريبية | Database Seeder** | جاهز Ready | إدارة Admin |
| 38 | **قائمة تنقل | Navigation Menu** | جاهز Ready | تجربة UX |
| 39 | **إشعارات منبثقة | Toast Notifications** | جاهز Ready | تجربة UX |
| 40 | **تطبيق ويب تقدمي | PWA** | جاهز Ready | منصة Platform |
| 41 | **دردشة مباشرة | Live Chat** | جاهز Ready | اجتماعي Social |
| 42 | **تحسين محركات البحث | SEO** | جاهز Ready | منصة Platform |

---

## تشغيل الفيديو | Core Streaming

### مشغل فيديو مخصص | Video Player
- مشغل فيديو مخصص بتصميم فاخر وعناصر تحكم ذهبية
- اختصارات لوحة المفاتيح (Space, الأسهم, F, M)
- محدد الجودة، التحكم بالصوت، ملء الشاشة
- معاينة الصور المصغرة عند تحريك شريط التقدم
- الانتقال التلقائي بين الحلقات مع العد التنازلي
- عرض الوقت مع المدة الحالية/الإجمالية

### صورة داخل صورة | Picture-in-Picture
- وضع PiP للقيام بمهام متعددة أثناء المشاهدة
- مشغل صغير عائم يستمر عبر التنقل
- تبديل بنقرة واحدة من عناصر التحكم

### دعم الترجمة | Subtitles Support
- رفع وإدارة ملفات الترجمة (.srt, .vtt)
- مسارات ترجمة متعددة اللغات لكل حلقة
- تبديل تشغيل/إيقاف مع ضبط التوقيت

### الطوابع الزمنية | Video Timestamps
- إنشاء إشارات مرجعية زمنية أثناء المشاهدة
- مشاركة لحظات محددة مع روابط عميقة
- طوابع زمنية مجتمعية مرئية على شريط التقدم

---

## الاكتشاف والتصفح | Discovery & Browsing

### بحث فوري | Real-time Search
- بحث فوري مع نتائج فورية
- البحث بالعنوان، النوع، الاستوديو، أو السنة
- نتائج قابلة للتنقل عبر لوحة المفاتيح

### بحث متقدم | Advanced Search
- نظام فلاتر متعدد بالنوع، السنة، الحالة، التقييم
- خيارات فرز (الشعبية، التقييم، الأحدث)
- شبكة نتائج مع تحميل تلقائي

### توصيات الأنمي | Recommendations
- محرك توصيات ذكي بناءً على سجل المشاهدة
- اقتراحات "لأنك شاهدت X"
- مطابقة النوع والاستوديو

### نظام المجموعات | Collections
- إنشاء مجموعات أنمي مخصصة
- إضافة/إزالة الأنمي من المجموعات
- مجموعات عامة وخاصة

### مقارنة الأنمي | Anime Comparison
- مقارنة جنباً إلى جنب لـ 3 أنمي
- مقارنة التقييمات، الأنواع، الحلقات
- تمييز الاختلافات بصرياً

### متصفح المواسم | Seasonal Browser
- تصفح الأنمي حسب الموسم (شتاء، ربيع، صيف، خريف)
- أرشيف المواسم السابقة

### تقويم الإصدارات | Release Calendar
- جدول أسبوعي للحلقات القادمة
- شبكة أيام الإصدار

### الأخبار والمقالات | News & Articles
- تغذية أخبار منسقة
- تصفية حسب الفئة (أخبار، معاينات، مراجعات)

---

## اجتماعي ومجتمع | Social & Community

### نظام التعليقات | Comments System
- سلاسل تعليقات متداخلة
- إعجاب/عدم إعجاب بالتعليقات

### المراجعات والتقييمات | Reviews & Ratings
- نظام تقييم بنجوم (1-10)
- مراجعات مكتوبة مع إخفاء الحبكات
- تصويت على فائدة المراجعة

### حفلة مشاهدة | Watch Party
- إنشاء غرف مشاهدة متزامنة
- دعوة الأصدقاء عبر كود الغرفة
- مضيف يتحكم بالتشغيل للجميع
- دردشة مدمجة

### الملفات الشخصية | User Profiles
- صفحات عامة مع تغذية النشاط
- عرض المفضلات والإنجازات

### طلبات الأنمي | Anime Requests
- نظام طلب مجتمعي
- تصويت على العناوين المطلوبة

---

## تجربة المستخدم | User Experience

### المصادقة | Authentication
- OAuth 2.0 (Google, Discord, GitHub)
- تسجيل محلي بالاسم/كلمة المرور
- جلسات JWT
- تحكم بالوصول حسب الدور

### المفضلة وقائمة المشاهدة | Favorites
- إضافة للمفضلة بنقرة واحدة
- مفضلات متزامنة عبر الأجهزة

### الإشارات المرجعية | Bookmarks
- حفظ حلقات محددة لمشاهدتها لاحقاً
- تفضيلات إشعارات لكل سلسلة

### سجل المشاهدة | Watch History
- تتبع تلقائي للحلقات المشاهدة
- الاستمرار من حيث توقفت

### نظام الإنجازات | Achievements
- فتح إنجازات لنشاط المنصة
- فئات: مشاهدة، اجتماعي، مستكشف، مجمع

### الوضع الداكن/الفاتح | Dark/Light Mode
- تبديل فوري مع انتقال سلس
- وضع تلقائي حسب الوقت
- تفضيل مستمر في localStorage

### دعم RTL | RTL Support
- واجهة عربية كاملة
- خصائص CSS منطقية
- ترجمات عربية لجميع العناصر

---

## إدارة المحتوى | Content Management

### نظام الحلقات | Episode System
- CRUD كامل للحلقات
- إدارة روابط الفيديو
- بيانات وصفية (عنوان، رقم، مدة)

### الممثلون والشخصيات | Cast & Characters
- قاعدة بيانات الشخصيات مع المؤدين الصوتيين

### قارئ المانجا | Manga Reader
- قارئ فصول مانجا مدمج
- تنقل صفحة بصفحة

---

## لوحة الإدارة | Admin Panel

### لوحة التحكم | Dashboard
- بطاقات إحصائيات فورية
- رسوم بيانية Three.js ثلاثية الأبعاد
- تغذية نشاط حية
- جدول الأنمي الأكثر أداءً

### إدارة الأنمي | Anime Manager
- CRUD كامل
- عمليات مجمعة

### إدارة المستخدمين | User Management
- عرض جميع المستخدمين
- إدارة الأدوار

### الاستيراد المجمع | Bulk Import
- استيراد CSV

### التصدير | Export & Backup
- تصدير JSON/CSV

### بيانات تجريبية | Database Seeder
- زر واحد يسجل 25 أنمي

---

## المكدس التقني | Tech Stack

| الطبقة Layer | التقنية Technology |
|-------|-----------|
| الواجهة الأمامية Frontend | React 19 + TypeScript + Vite |
| التصميم Styling | Tailwind CSS 3.4 + shadcn/ui |
| 3D | Three.js + @react-three/fiber |
| الرسوم المتحركة Animation | Framer Motion |
| الرسوم البيانية Charts | Recharts |
| الخلفية Backend | tRPC 11.x + Hono |
| ORM | Drizzle ORM |
| قاعدة البيانات Database | MySQL |
| المصادقة Auth | OAuth 2.0 + JWT |

---

## نظام التصميم | Design System

- **اللون الأساسي Primary**: `#D4AF37` (ذهبي فاخر | Luxury Gold)
- **الخلفية Background**: `#0a0a0a` (داكن Dark)
- **السطح Surface**: `#141414`
- **النص الأساسي Text Primary**: `#ffffff`
- **النص الثانوي Text Secondary**: `#E0E0E0`
- **الخط Font**: Inter

---

*MIKA - حيث يلتقي الأنمي بالفخامة | Where Anime Meets Luxury.*

