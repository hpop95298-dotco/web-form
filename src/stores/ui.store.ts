import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toasts: [],

      toggleSidebar: () =>
        set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      toggleTheme: () =>
        set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      addToast: (toast) => {
        const id = crypto.randomUUID();
        set(s => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration ?? 4000);
      },

      removeToast: (id) =>
        set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
    }),
    {
      name: 'ieee-ui',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed, theme: state.theme }),
    }
  )
);

export const toast = {
  success: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'info', title, message }),
};
