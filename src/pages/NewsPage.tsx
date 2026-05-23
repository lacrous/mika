import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Newspaper, Eye, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";

export function NewsPage() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const newsQuery = trpc.news.list.useQuery({ limit: 20 }, { retry: false });
  const posts = (newsQuery.data || []) as any[];

  const cats = ["news", "previews", "discussions", "editorials", "seasonal"];
  const [activeCat, setActiveCat] = useState("all");

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: "var(--nv-bg-body)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1000px] mx-auto">
        <motion.h1 className="text-[24px] font-bold mb-6 flex items-center gap-3" style={{ color: "var(--nv-text-primary)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Newspaper className="w-6 h-6" style={{ color: "var(--nv-gold)" }} />{isRTL ? "أخبار الأنمي" : "Anime News"}
        </motion.h1>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveCat("all")} className="px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all"
            style={{ background: activeCat === "all" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", color: activeCat === "all" ? "#D4AF37" : "var(--nv-text-muted)", border: activeCat === "all" ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
            {isRTL ? "الكل" : "All"}
          </button>
          {cats.map((c) => (
            <button key={c} onClick={() => setActiveCat(c)} className="px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap capitalize transition-all"
              style={{ background: activeCat === c ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", color: activeCat === c ? "#D4AF37" : "var(--nv-text-muted)", border: activeCat === c ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.filter((p: any) => activeCat === "all" || p.category === activeCat).map((post: any, i: number) => (
            <motion.div key={post.id} className="rounded-xl p-4 cursor-pointer hover:brightness-110 transition-all"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
              onClick={() => navigate(`/news/${post.slug}`)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {post.coverImage && (
                  <img src={post.coverImage} alt="" className="w-32 h-20 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.08)", color: "#D4AF37" }}>{post.category}</span>
                  <h3 className="text-[15px] font-semibold mt-1.5 truncate" style={{ color: "var(--nv-text-primary)" }}>{post.title}</h3>
                  <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: "var(--nv-text-muted)" }}>{post.excerpt}</p>
                  <div className={`flex items-center gap-3 mt-2 text-[10px] ${isRTL ? "flex-row-reverse" : ""}`} style={{ color: "var(--nv-text-dim)" }}>
                    <span>{post.authorName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{post.views}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && <p className="text-center py-20 text-[13px]" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد أخبار بعد" : "No news yet"}</p>}
        </div>
      </div>
    </div>
  );
}
