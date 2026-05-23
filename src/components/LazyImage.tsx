import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

interface LazyImageProps {
 src: string;
 alt: string;
 className?: string;
 aspectRatio?: string;
 onLoad?: () => void;
}

/**
 * LazyImage - Optimized image component with skeleton loading state.
 * Uses react-lazy-load-image-component for viewport-based lazy loading
 * with a pulse animation skeleton placeholder until the image loads.
 */
export function LazyImage({
 src,
 alt,
 className = "",
 aspectRatio = "2/3",
}: LazyImageProps) {
 const [loaded, setLoaded] = useState(false);

 return (
 <div
 className={`relative overflow-hidden ${className}`}
 style={{ aspectRatio }}
 >
 {/* Skeleton placeholder - shows until image is fully loaded */}
 {!loaded && (
 <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse z-10" />
 )}

 {/* Lazy loaded image with opacity fade-in effect */}
 <LazyLoadImage
 src={src}
 alt={alt}
 effect="opacity"
 afterLoad={() => setLoaded(true)}
 className="w-full h-full object-cover"
 wrapperClassName="w-full h-full"
 placeholderSrc={undefined}
 threshold={200}
 style={{ opacity: loaded ? 0.95 : 0 }}
 />
 </div>
 );
}

/**
 * SimpleLazyImage - A lighter version that uses native loading="lazy"
 * with a built-in skeleton loader. Use this for simpler use cases.
 */
export function SimpleLazyImage({
 src,
 alt,
 className = "",
}: {
 src: string;
 alt: string;
 className?: string;
}) {
 const [loaded, setLoaded] = useState(false);

 return (
 <div className={`relative overflow-hidden ${className}`}>
 {!loaded && (
 <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse z-10" />
 )}
 <img
 src={src}
 alt={alt}
 loading="lazy"
 onLoad={() => setLoaded(true)}
 className={`w-full h-full object-cover transition-opacity duration-500 ${
 loaded ? "opacity-95" : "opacity-0"
 }`}
 />
 </div>
 );
}
