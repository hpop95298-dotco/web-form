import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '@/types';
import { ROLE_PERMISSIONS, ROLE_DASHBOARD_PATH } from '@/types';
import type { Permission } from '@/types';
import { MOCK_USERS } from '@/mock/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  hasPermission: (permission: Permission) => boolean;
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: MOCK_USERS[8], // default to User
      isAuthenticated: true,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 600));
        const found = MOCK_USERS.find(u => u.email === email);
        if (found) {
          set({ user: found, isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      switchRole: (role: Role) => {
        const mockUser = MOCK_USERS.find(u => u.role === role);
        if (mockUser) {
          set({ user: mockUser, isAuthenticated: true });
        }
      },

      hasPermission: (permission: Permission): boolean => {
        const { user } = get();
        if (!user) return false;
        return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
      },

      getDashboardPath: (): string => {
        const { user } = get();
        if (!user) return '/auth/login';
        return ROLE_DASHBOARD_PATH[user.role];
      },
    }),
    {
      name: 'ieee-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
