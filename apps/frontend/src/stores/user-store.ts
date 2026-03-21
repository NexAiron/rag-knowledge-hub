"use client";

import { create } from "zustand";
import { loginByPassword } from "@/lib/api/auth";
import type { UserProfile } from "@/types";

interface UserStoreState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserProfile, token?: string) => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user, token) =>
    set({
      user,
      token: token ?? null,
      error: null,
    }),

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginByPassword({ email, password });
      set({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      });
      throw error;
    }
  },

  logout: () =>
    set({
      user: null,
      token: null,
      error: null,
      isLoading: false,
    }),
}));
