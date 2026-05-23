/**
 * MIKA CURSOR GLOW
 * A subtle gold glow that follows the cursor, creating a lantern-like reveal effect.
 * Purely decorative, uses CSS custom properties for GPU-accelerated positioning.
 */
import { useEffect, useRef } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export function CursorGlow() {
 const { cursorGlow } = useThemeStore();
 const rafRef = useRef<number>(0);
 const posRef = useRef({ x: 0, y: 0 });

 useEffect(() => {
 if (!cursorGlow) return;

 const handleMouseMove = (e: MouseEvent) => {
 posRef.current = { x: e.clientX, y: e.clientY };
 };

 const update = () => {
 const { x, y } = posRef.current;
 document.documentElement.style.setProperty("--cursor-x", `${x}px`);
 document.documentElement.style.setProperty("--cursor-y", `${y}px`);
 rafRef.current = requestAnimationFrame(update);
 };

 window.addEventListener("mousemove", handleMouseMove, { passive: true });
 rafRef.current = requestAnimationFrame(update);

 return () => {
 window.removeEventListener("mousemove", handleMouseMove);
 cancelAnimationFrame(rafRef.current);
 };
 }, [cursorGlow]);

 if (!cursorGlow) return null;

 return (
 <div
 aria-hidden="true"
 style={{
 position: "fixed",
 top: 0,
 left: 0,
 width: "100%",
 height: "100%",
 pointerEvents: "none",
 zIndex: 9999,
 background: "radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(212, 175, 55, 0.035), transparent 40%)",
 mixBlendMode: "screen",
 }}
 />
 );
}
