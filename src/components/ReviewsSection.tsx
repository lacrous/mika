import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, Send, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

interface ReviewsSectionProps {
 animeId: string;
 animeTitle: string;
}

const mockReviews = [
 { id: 1, userName: "Ahmed Hassan", userAvatar: null, rating: 9, content: "Amazing animation and storytelling! The fight scenes are incredible.", helpfulCount: 12, createdAt: "2025-05-20" },
 { id: 2, userName: "Sara Ali", userAvatar: null, rating: 10, content: "Best anime I've ever watched. The plot twists are mind-blowing.", helpfulCount: 24, createdAt: "2025-05-18" },
 { id: 3, userName: "Mohamed Khaled", userAvatar: null, rating: 8, content: "Great adventure anime. Highly recommended!", helpfulCount: 8, createdAt: "2025-05-15" },
];

export function ReviewsSection({ animeId, animeTitle }: ReviewsSectionProps) {
 const { isRTL } = useLanguage();
 const { isAuthenticated } = useAuth();

 const [rating, setRating] = useState(0);
 const [hoverRating, setHoverRating] = useState(0);
 const [content, setContent] = useState("");
 const [sortBy, setSortBy] = useState<"newest" | "highest" | "helpful">("newest");
 const [showLoginPrompt, setShowLoginPrompt] = useState(false);

 const statsQuery = trpc.reviews.stats.useQuery({ animeId }, { retry: false });
 const createReview = trpc.reviews.create.useMutation({
 onSuccess: () => {
 setRating(0);
 setContent("");
 statsQuery.refetch();
 },
 });

 const handleSubmit = () => {
 if (!isAuthenticated) {
 setShowLoginPrompt(true);
 return;
 }
 if (rating === 0 || !content.trim()) return;
 createReview.mutate({ animeId, animeTitle, rating, content });
 };

 const handleHelpful = (_reviewId: number) => {
 // trpc.reviews.helpful.useMutation({ reviewId });
 };

 const stats = statsQuery.data || { count: mockReviews.length, average: 9.0, distribution: [] };
 const displayReviews = mockReviews;

 return (
 <div className={isRTL ? "text-end" : ""}>
 {/* Header */}
 <div className={`flex items-center justify-between mb-6`}>
 <h2 className="text-[22px] font-bold text-white">
 {isRTL ? "التقييمات" : "Reviews"}
 <span className={`text-[14px] text-[#9CA3AF] font-normal ${isRTL ? "me-2" : "ms-2"}`}>({stats.count})</span>
 </h2>
 <div className={`flex gap-2`}>
 {(["newest", "highest", "helpful"] as const).map((s) => (
 <button key={s} onClick={() => setSortBy(s)} className="px-3 py-1.5 rounded-lg text-[12px] transition-all" style={{ background: sortBy === s ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.04)", color: sortBy === s ? "#D4AF37" : "#9CA3AF", border: sortBy === s ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)" }}>
 {s === "newest" ? (isRTL ? "الأحدث" : "Newest") : s === "highest" ? (isRTL ? "الأعلى" : "Highest") : (isRTL ? "الأكثر فائدة" : "Most Helpful")}
 </button>
 ))}
 </div>
 </div>

 <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isRTL ? "text-end" : ""}`}>
 {/* Rating Summary */}
 <motion.div className="rounded-xl p-5 h-fit" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
 <div className={`flex items-center gap-4 mb-4`}>
 <div className="text-[48px] font-bold text-white leading-none">{stats.average}</div>
 <div>
 <div className={`flex gap-0.5 mb-1`}>
 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
 <Star key={s} className={`w-3 h-3 ${s <= Math.round(stats.average) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#333]"}`} />
 ))}
 </div>
 <p className="text-[12px] text-[#9CA3AF]">{stats.count} {isRTL ? "تقييم" : "reviews"}</p>
 </div>
 </div>

 {/* Distribution */}
 <div className="space-y-1.5">
 {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => {
 const dist = stats.distribution?.find((d) => d.rating === score);
 const count = dist?.count || 0;
 const maxCount = Math.max(...(stats.distribution?.map((d) => d.count) || [1]));
 const percent = maxCount > 0 ? (count / maxCount) * 100 : 0;
 return (
 <div key={score} className={`flex items-center gap-2`}>
 <span className="text-[11px] text-[#9CA3AF] w-4">{score}</span>
 <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
 <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
 <div className="h-full rounded-full bg-[#D4AF37] transition-all" style={{ width: `${percent}%` }} />
 </div>
 <span className={`text-[10px] text-[#666] w-6 ${isRTL ? "text-start" : "text-end"}`}>{count}</span>
 </div>
 );
 })}
 </div>
 </motion.div>

 {/* Write Review + Review List */}
 <div className="lg:col-span-2 space-y-4">
 {/* Write Review */}
 <motion.div className="rounded-xl p-5" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
 <h3 className="text-[14px] font-semibold text-white mb-3">{isRTL ? "كتابة تقييم" : "Write a Review"}</h3>

 {/* Star Rating */}
 <div className={`flex items-center gap-1 mb-3`}>
 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
 <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
 <Star className={`w-5 h-5 transition-colors ${s <= (hoverRating || rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#444]"}`} />
 </button>
 ))}
 {rating > 0 && <span className={`text-[13px] text-[#D4AF37] ${isRTL ? "me-2" : "ms-2"}`}>{rating}/10</span>}
 </div>

 {/* Text Area */}
 <textarea
 value={content}
 onChange={(e) => setContent(e.target.value)}
 placeholder={isRTL ? "شارك رأيك في هذا الأنمي..." : "Share your thoughts on this anime..."}
 className="w-full h-24 rounded-lg text-[13px] text-white placeholder-[#555] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(212,175,55,0.4)] outline-none transition-colors px-3 py-2 resize-none mb-3"
 />

 {/* Submit */}
 <div className={`flex items-center justify-between`}>
 <span className="text-[11px] text-[#666]">{content.length}/2000</span>
 <button
 onClick={handleSubmit}
 disabled={rating === 0 || !content.trim() || createReview.isPending}
 className="flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium text-[#0a0a0a] disabled:opacity-40 transition-all hover:brightness-110"
 style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}
 >
 <Send className="w-3.5 h-3.5" />
 {isRTL ? "نشر" : "Post"}
 </button>
 </div>

 {/* Login Prompt */}
 <AnimatePresence>
 {showLoginPrompt && (
 <motion.div className="mt-3 p-3 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-between" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
 <span className="text-[12px] text-[#D4AF37]">{isRTL ? "يرجى تسجيل الدخول لكتابة تقييم" : "Please login to write a review"}</span>
 <button onClick={() => setShowLoginPrompt(false)}><X className="w-3 h-3 text-[#D4AF37]" /></button>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>

 {/* Review List */}
 {displayReviews.map((review, i) => (
 <motion.div key={review.id} className="rounded-xl p-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
 <div className={`flex items-start justify-between`}>
 <div className={`flex items-center gap-3`}>
 <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold" style={{ background: "rgba(212, 175, 55, 0.1)", color: "#D4AF37", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
 {review.userName.charAt(0)}
 </div>
 <div className={isRTL ? "text-end" : ""}>
 <p className="text-[13px] text-white font-medium">{review.userName}</p>
 <span className="text-[11px] text-[#9CA3AF]">{review.createdAt}</span>
 </div>
 </div>
 <div className={`flex items-center gap-1`}>
 {[...Array(10)].map((_, si) => (
 <Star key={si} className={`w-3 h-3 ${si < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#333]"}`} />
 ))}
 </div>
 </div>
 <p className="text-[13px] text-[#E0E0E0] mt-3 leading-relaxed">{review.content}</p>
 <button onClick={() => handleHelpful(review.id)} className={`flex items-center gap-1.5 mt-3 text-[12px] text-[#9CA3AF] hover:text-[#D4AF37] transition-colors`}>
 <ThumbsUp className="w-3.5 h-3.5" />
 {isRTL ? "مفيد" : "Helpful"} ({review.helpfulCount})
 </button>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 );
}
