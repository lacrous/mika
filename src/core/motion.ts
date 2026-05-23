/**
 * MIKA MOTION SYSTEM
 * Reusable animation presets for consistent, cinematic motion across the platform.
 * Every animation follows the Mika easing philosophy: smooth, premium, GPU-accelerated.
 */

import type { Variants, Transition } from "framer-motion";
import { durations, easings } from "./tokens";

// ── Core Transition Presets ──
export const transitions: Record<string, Transition> = {
  smooth: { duration: durations.DEFAULT, ease: easings.smooth },
  smoothSlow: { duration: durations.slow, ease: easings.smooth },
  spring: { type: "spring", stiffness: 380, damping: 30 },
  springBounce: { type: "spring", stiffness: 300, damping: 20 },
  cinematic: { duration: durations.cinematic, ease: easings.smooth },
  fast: { duration: durations.fast, ease: easings.smooth },
  stagger: { duration: durations.DEFAULT, ease: easings.smooth, staggerChildren: 0.05 },
  staggerSlow: { duration: durations.slow, ease: easings.smooth, staggerChildren: 0.08 },
};

// ── Fade Variants ──
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.smoothSlow },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transitions.spring },
};

// ── Directional Slide Variants ──
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: transitions.smoothSlow },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: transitions.smoothSlow },
};

// ── 3D Perspective Variants ──
export const perspectiveIn: Variants = {
  hidden: { opacity: 0, rotateX: -15, y: 30 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth },
  },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -45 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: durations.slow, ease: easings.smooth },
  },
};

// ── Container + Stagger Variants ──
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

// ── Cinematic Reveal Variants ──
export const cinematicReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.cinematic, ease: easings.smooth },
  },
};

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slower,
      ease: easings.smooth,
      delay: 0.2 + i * 0.08,
    },
  }),
};

// ── Card/Grid Item Variants ──
export const cardHover = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: {
    scale: 1.02,
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

export const gridItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: durations.DEFAULT, ease: easings.smooth, delay: i * 0.04 },
  }),
};

// ── Navbar Variants ──
export const navbar: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

// ── Modal/Dialog Variants ──
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.fast },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

// ── Glow/Pulse Variants ──
export const pulseGlow: Variants = {
  initial: { boxShadow: "0 0 20px rgba(212, 175, 55, 0.1)" },
  animate: {
    boxShadow: [
      "0 0 20px rgba(212, 175, 55, 0.1)",
      "0 0 40px rgba(212, 175, 55, 0.2)",
      "0 0 20px rgba(212, 175, 55, 0.1)",
    ],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
};

// ── Scroll-triggered Section Variants ──
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth },
  },
};

export const scrollScale: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.slow, ease: easings.smooth },
  },
};

// ── Section-Specific Direction Variants ──
export const sectionFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.slow, ease: easings.smooth },
  },
};

export const sectionFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.slow, ease: easings.smooth },
  },
};

// ── Hover Interaction Helpers ──
export const hoverLift = {
  y: -4,
  scale: 1.02,
  transition: transitions.fast,
};

export const hoverGlow = {
  boxShadow: "0 0 30px rgba(212, 175, 55, 0.15), 0 12px 40px rgba(0, 0, 0, 0.4)",
  borderColor: "rgba(212, 175, 55, 0.3)",
  transition: transitions.fast,
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// ── Viewport Settings (for whileInView) ──
export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};

export const viewportHalf = {
  once: true,
  margin: "-50%" as const,
};
