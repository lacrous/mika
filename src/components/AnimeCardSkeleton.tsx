/**
 * AnimeCardSkeleton - Premium loading placeholder for AnimeCard.
 * Mimics the exact card layout with shimmer animation for skeleton state.
 */
export function AnimeCardSkeleton() {
 return (
 <div className="flex-shrink-0">
 <div className="rounded-xl overflow-hidden bg-[var(--nv-bg-secondary)] border border-[#1a1a1a]">
 {/* Image Placeholder - matches aspect-[2/3] */}
 <div className="aspect-[2/3] relative overflow-hidden">
 <div className="absolute inset-0 bg-[var(--nv-bg-tertiary)]" />
 {/* Gold-tinted shimmer sweep */}
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.04) 30%, rgba(240, 216, 120, 0.06) 50%, rgba(212, 175, 55, 0.04) 70%, transparent 100%)",
 backgroundSize: "200% 100%",
 animation: "shimmerGold 1.8s ease-in-out infinite",
 }}
 />
 {/* Secondary subtle shimmer */}
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)",
 animation: "shimmer 2.5s ease-in-out infinite",
 }}
 />
 </div>

 {/* Title Placeholder */}
 <div className="pt-3 pb-2 px-0.5 space-y-2">
 <div className="h-4 bg-[var(--nv-bg-tertiary)] rounded w-4/5 overflow-hidden relative">
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.03), transparent)",
 backgroundSize: "200% 100%",
 animation: "shimmerGold 2s ease-in-out infinite 0.3s",
 }}
 />
 </div>
 {/* Meta Placeholder */}
 <div className="flex justify-between items-center">
 <div className="h-3 bg-[var(--nv-bg-tertiary)] rounded w-12 overflow-hidden relative">
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.03), transparent)",
 backgroundSize: "200% 100%",
 animation: "shimmerGold 2s ease-in-out infinite 0.5s",
 }}
 />
 </div>
 <div className="h-3 bg-[var(--nv-bg-tertiary)] rounded w-8 overflow-hidden relative">
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.03), transparent)",
 backgroundSize: "200% 100%",
 animation: "shimmerGold 2s ease-in-out infinite 0.7s",
 }}
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

/**
 * AnimeGridSkeleton - Grid of skeleton cards for loading states.
 */
export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
 return (
 <>
 {Array.from({ length: count }).map((_, i) => (
 <AnimeCardSkeleton key={i} />
 ))}
 </>
 );
}

/**
 * SeasonCardSkeleton - Skeleton for season anime cards with season badge.
 */
export function SeasonCardSkeleton() {
 return (
 <div className="flex-shrink-0">
 <div className="rounded-xl overflow-hidden bg-[var(--nv-bg-secondary)] border border-[#1a1a1a]">
 <div className="aspect-[2/3] relative overflow-hidden">
 <div className="absolute inset-0 bg-[var(--nv-bg-tertiary)]" />
 <div
 className="absolute inset-0"
 style={{
 background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.04) 30%, rgba(240, 216, 120, 0.06) 50%, rgba(212, 175, 55, 0.04) 70%, transparent 100%)",
 backgroundSize: "200% 100%",
 animation: "shimmerGold 1.8s ease-in-out infinite",
 }}
 />
 </div>
 <div className="pt-3 pb-2 px-0.5 space-y-2">
 <div className="h-4 bg-[var(--nv-bg-tertiary)] rounded w-4/5" />
 <div className="flex justify-between items-center">
 <div className="h-3 bg-[var(--nv-bg-tertiary)] rounded w-12" />
 <div className="h-3 bg-[var(--nv-bg-tertiary)] rounded w-8" />
 </div>
 </div>
 </div>
 </div>
 );
}
