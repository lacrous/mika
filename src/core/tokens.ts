/**
 * NUROVIA DESIGN TOKENS
 * Token-based design system for scalable, consistent theming.
 * All visual values are centralized here for maintainability.
 */

// ── Color Tokens ──
export const colors = {
  // Primary gold scale
  primary: {
    50: "#FDF8E8",
    100: "#F8EDC0",
    200: "#F0D878",
    300: "#E8C850",
    400: "#D4AF37",
    500: "#C4A030",
    600: "#A88328",
    700: "#8C6D22",
    800: "#6B5218",
    900: "#4A3810",
  },
  // Surface scale (dark backgrounds)
  surface: {
    0: "#000000",
    1: "#0A0A0A",
    2: "#111111",
    3: "#1A1A1A",
    4: "#222222",
    5: "#2A2A2A",
    6: "#333333",
    7: "#444444",
    8: "#555555",
  },
  // Content/text colors
  content: {
    primary: "#FFFFFF",
    secondary: "#E0E0E0",
    tertiary: "#9CA3AF",
    quaternary: "#6B7280",
    disabled: "#444444",
  },
  // Semantic colors
  semantic: {
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
  // Glassmorphism
  glass: {
    light: "rgba(255, 255, 255, 0.04)",
    medium: "rgba(255, 255, 255, 0.08)",
    heavy: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.06)",
    gold: "rgba(212, 175, 55, 0.08)",
    goldBorder: "rgba(212, 175, 55, 0.15)",
  },
  // Gradients
  gradient: {
    gold: "linear-gradient(135deg, #D4AF37, #F0D878)",
    goldText: "linear-gradient(to right, #F0D878, #D4AF37, #F0D878)",
    goldRadial: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
    hero: "linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.7) 40%, transparent 70%)",
    vignette: "radial-gradient(ellipse 80% 70% at 75% 60%, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 40%, transparent 75%)",
  },
} as const;

// ── Typography Tokens ──
export const typography = {
  fontFamily: {
    sans: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
    display: '"SF Pro Display", -apple-system, sans-serif',
  },
  size: {
    xs: "11px",
    sm: "12px",
    base: "13px",
    md: "14px",
    lg: "15px",
    xl: "16px",
    "2xl": "18px",
    "3xl": "20px",
    "4xl": "24px",
    "5xl": "32px",
    "6xl": "48px",
    "7xl": "64px",
    "8xl": "96px",
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  leading: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
  tracking: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.05em",
    wider: "0.1em",
    widest: "0.15em",
  },
} as const;

// ── Spacing Tokens ──
export const spacing = {
  0: "0",
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  // Layout-specific
  section: "clamp(5vw, 8vw, 10vw)",
  content: "clamp(320px, 1200px, 90vw)",
} as const;

// ── Border Radius Tokens ──
export const radius = {
  none: "0",
  xs: "2px",
  sm: "4px",
  md: "6px",
  DEFAULT: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

// ── Shadow/Elevation Tokens ──
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
  DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.3)",
  md: "0 8px 24px rgba(0, 0, 0, 0.4)",
  lg: "0 12px 40px rgba(0, 0, 0, 0.5)",
  xl: "0 24px 60px rgba(0, 0, 0, 0.6)",
  gold: "0 0 20px rgba(212, 175, 55, 0.15), 0 0 40px rgba(212, 175, 55, 0.05)",
  goldHover: "0 0 30px rgba(212, 175, 55, 0.2), 0 0 60px rgba(212, 175, 55, 0.1)",
  inner: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  glass: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
} as const;

// ── Transition Tokens ──
export const transitions = {
  fast: "150ms cubic-bezier(0.22, 1, 0.36, 1)",
  DEFAULT: "300ms cubic-bezier(0.22, 1, 0.36, 1)",
  slow: "500ms cubic-bezier(0.22, 1, 0.36, 1)",
  slower: "700ms cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// ── Z-Index Scale ──
export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  navbar: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
  toast: 600,
  overlay: 700,
} as const;

// ── Breakpoints ──
export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ── Animation Durations ──
export const durations = {
  instant: 0.1,
  fast: 0.2,
  DEFAULT: 0.3,
  slow: 0.5,
  slower: 0.7,
  cinematic: 1.2,
} as const;

// ── Easing Functions ──
export const easings = {
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
} as const;
