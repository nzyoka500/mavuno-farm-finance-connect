import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, tokens, type Role, type User } from "./api";

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    region?: string;
    role: Role;
  }) => Promise<User>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await authApi.login({ email, password });
          tokens.set(res.accessToken, res.refreshToken);
          set({ currentUser: res.user });
          return res.user;
        } finally {
          set({ loading: false });
        }
      },

      register: async (payload) => {
        set({ loading: true });
        try {
          const res = await authApi.register(payload);
          tokens.set(res.accessToken, res.refreshToken);
          set({ currentUser: res.user });
          return res.user;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          tokens.clear();
          set({ currentUser: null });
        }
      },

      // Call once on app mount to re-validate the stored token
      hydrate: async () => {
        if (!tokens.getAccess()) return;
        try {
          const user = await authApi.me();
          set({ currentUser: user });
        } catch {
          tokens.clear();
          set({ currentUser: null });
        }
      },
    }),
    {
      name: "mavuno-auth",
      // Only persist the user object — tokens live in localStorage directly
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
