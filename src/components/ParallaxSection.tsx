import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

interface ParallaxSectionProps {
 children: ReactNode;
 className?: string;
 offset?: number;
 dir?: "up" | "down" | "left" | "right";
 rotateX?: number;
 depth?: number;
}

export function ParallaxSection({
 children,
 className = "",
 offset = 50,
 dir = "up",
 depth = 1,
}: ParallaxSectionProps) {
 const ref = useRef<HTMLDivElement>(null);

 const { scrollYProgress } = useScroll({
 target: ref,
 offset: ["start end", "end start"],
 });

 // Different transforms based on direction
 const y = useTransform(
 scrollYProgress,
 [0, 1],
 dir === "up" ? [offset * depth, -offset * depth] : dir === "down" ? [-offset * depth, offset * depth] : [0, 0]
 );

 const x = useTransform(
 scrollYProgress,
 [0, 1],
 dir === "left" ? [offset * depth, -offset * depth] : dir === "right" ? [-offset * depth, offset * depth] : [0, 0]
 );

 // Subtle rotation based on scroll
 const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2 * depth, 0, -2 * depth]);

 // Scale effect - items appear to come forward
 const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.96, 1, 1, 0.96]);

 return (
 <motion.div
 ref={ref}
 style={{
 y,
 x,
 rotateX,
 scale,
 perspective: 1000,
 transformStyle: "preserve-3d",
 }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

// Floating element with 3D hover
interface Float3DProps {
 children: ReactNode;
 className?: string;
 intensity?: number;
}

export function Float3D({ children, className = "", intensity = 1 }: Float3DProps) {
 return (
 <motion.div
 className={className}
 style={{ perspective: 800, transformStyle: "preserve-3d" }}
 whileHover={{
 rotateY: 5 * intensity,
 rotateX: -3 * intensity,
 scale: 1.02,
 transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
 }}
 >
 {children}
 </motion.div>
 );
}
