import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, Pin, Trash2, ChevronDown } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

interface CommentsSectionProps {
  animeId: number;
  isRTL?: boolean;
}

export function CommentsSection({ animeId, isRTL = false }: CommentsSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sort, setSort] = useState<"top" | "newest">("top");
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const utils = trpc.useUtils();
  const commentsQuery = trpc.comments.list.useQuery({ animeId, sort }, { retry: false });
  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => { utils.comments.list.invalidate({ animeId, sort }); setContent(""); },
  });
  const createReply = trpc.comments.create.useMutation({
    onSuccess: () => { utils.comments.list.invalidate({ animeId, sort }); setReplyContent(""); setReplyTo(null); },
  });
  const likeComment = trpc.comments.like.useMutation({
    onSuccess: () => utils.comments.list.invalidate({ animeId, sort }),
  });
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => utils.comments.list.invalidate({ animeId, sort }),
  });

  const comments = commentsQuery.data || [];

  const handleSubmit = () => {
    if (!content.trim()) return;
    createComment.mutate({ animeId, content: content.trim() });
  };

  const handleReply = (parentId: number) => {
    if (!replyContent.trim()) return;
    createReply.mutate({ animeId, content: replyContent.trim(), parentId });
  };

  const toggleReplies = (id: number) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h3 className="text-[16px] font-semibold flex items-center gap-2" style={{ color: "var(--nv-text-primary)" }}>
          <MessageCircle className="w-4 h-4" style={{ color: "var(--nv-gold)" }} />
          {isRTL ? "التعليقات" : "Comments"} ({comments.reduce((sum, c: any) => sum + 1 + (c.replies?.length || 0), 0)})
        </h3>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.03)" }}>
          {(["top", "newest"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all"
              style={{ background: sort === s ? "rgba(212,175,55,0.1)" : "transparent", color: sort === s ? "#D4AF37" : "var(--nv-text-muted)" }}>
              {s === "top" ? (isRTL ? "الأفضل" : "Top") : (isRTL ? "الأحدث" : "Newest")}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      {isAuthenticated ? (
        <div className={`flex gap-3 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold" style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <input value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={isRTL ? "اكتب تعليقاً..." : "Write a comment..."}
                className="flex-1 h-9 rounded-lg text-[12px] px-3 admin-input" />
              <button onClick={handleSubmit} disabled={!content.trim() || createComment.isPending}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: content.trim() ? "rgba(212,175,55,0.12)" : "transparent" }}>
                <Send className="w-3.5 h-3.5" style={{ color: content.trim() ? "#D4AF37" : "var(--nv-text-dim)" }} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[12px] text-center py-4 mb-4 rounded-lg" style={{ color: "var(--nv-text-dim)", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {isRTL ? "سجل الدخول للتعليق" : "Sign in to comment"}
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
                {(comment.userName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--nv-text-primary)" }}>{comment.userName}</span>
                  <span className="text-[9px]" style={{ color: "var(--nv-text-dim)" }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  {comment.isPinned ? <Pin className="w-3 h-3" style={{ color: "#D4AF37" }} /> : null}
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--nv-text-secondary)" }}>{comment.content}</p>
                <div className={`flex items-center gap-3 mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button onClick={() => likeComment.mutate({ commentId: comment.id })} className="flex items-center gap-1 text-[11px] transition-colors hover:text-[#D4AF37]" style={{ color: "var(--nv-text-dim)" }}>
                    <ThumbsUp className="w-3 h-3" /> {comment.likes || 0}
                  </button>
                  <button onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyContent(""); }} className="text-[11px] transition-colors hover:text-[#D4AF37]" style={{ color: "var(--nv-text-dim)" }}>
                    {isRTL ? "رد" : "Reply"}
                  </button>
                  {user?.name === comment.userName && (
                    <button onClick={() => deleteComment.mutate({ commentId: comment.id })} className="text-[11px] transition-colors hover:text-[#ef4444]" style={{ color: "var(--nv-text-dim)" }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {replyTo === comment.id && (
                    <motion.div className={`flex gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <input value={replyContent} onChange={(e) => setReplyContent(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleReply(comment.id)}
                        placeholder={isRTL ? "اكتب رداً..." : "Write a reply..."} className="flex-1 h-8 rounded-lg text-[12px] px-3 admin-input" />
                      <button onClick={() => handleReply(comment.id)} disabled={!replyContent.trim()}
                        className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                        <Send className="w-3 h-3" style={{ color: "#D4AF37" }} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="mt-2">
                    <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-1 text-[11px] transition-colors hover:text-[#D4AF37]" style={{ color: "var(--nv-text-dim)" }}>
                      <ChevronDown className={`w-3 h-3 transition-transform ${expandedReplies.has(comment.id) ? "rotate-180" : ""}`} />
                      {comment.replies.length} {isRTL ? "رد" : "replies"}
                    </button>
                    <AnimatePresence>
                      {expandedReplies.has(comment.id) && (
                        <motion.div className="mt-2 space-y-2 pl-4 border-l" style={{ borderColor: "rgba(212,175,55,0.1)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "var(--nv-text-muted)" }}>
                                {(reply.userName || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                                  <span className="text-[11px] font-medium" style={{ color: "var(--nv-text-primary)" }}>{reply.userName}</span>
                                  <span className="text-[8px]" style={{ color: "var(--nv-text-dim)" }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[12px]" style={{ color: "var(--nv-text-secondary)" }}>{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && !commentsQuery.isLoading && (
          <p className="text-[13px] text-center py-8" style={{ color: "var(--nv-text-dim)" }}>{isRTL ? "لا توجد تعليقات بعد. كن أول من يعلق!" : "No comments yet. Be the first to comment!"}</p>
        )}
      </div>
    </div>
  );
}
