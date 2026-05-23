/**
 * MIKA THEME STORE
 * Manages dark/light mode, gold accent intensity, and glass effects.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  goldIntensity: "subtle" | "normal" | "intense";
  glassEffect: boolean;
  reducedMotion: boolean;
  cursorGlow: boolean;
  toggleDark: () => void;
  setGoldIntensity: (i: "subtle" | "normal" | "intense") => void;
  setGlassEffect: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setCursorGlow: (v: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      goldIntensity: "normal",
      glassEffect: true,
      reducedMotion: false,
      cursorGlow: true,
      toggleDark: () => set((s) => ({ isDark: !s.isDark })),
      setGoldIntensity: (i) => set({ goldIntensity: i }),
      setGlassEffect: (v) => set({ glassEffect: v }),
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setCursorGlow: (v) => set({ cursorGlow: v }),
    }),
    { name: "mika-theme" }
  )
);
