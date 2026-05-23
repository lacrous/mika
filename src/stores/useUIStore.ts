/**
 * MIKA UI STORE
 * Manages global UI state: sidebar, modals, toasts, loading states.
 */
import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;

  // Modal
  activeModal: string | null;
  modalData: unknown;
  openModal: (id: string, data?: unknown) => void;
  closeModal: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  // Loading
  globalLoading: boolean;
  setGlobalLoading: (v: boolean) => void;

  // Scroll
  scrollY: number;
  isScrolled: boolean;
  setScrollY: (y: number) => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  activeModal: null,
  modalData: null,
  openModal: (id, data) => set({ activeModal: id, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastId}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  globalLoading: false,
  setGlobalLoading: (v) => set({ globalLoading: v }),

  scrollY: 0,
  isScrolled: false,
  setScrollY: (y) => set({ scrollY: y, isScrolled: y > 50 }),
}));
