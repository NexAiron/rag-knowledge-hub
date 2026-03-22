"use client";

import { create } from "zustand";
import {
  getCurrentUser,
  loginByPassword,
  registerByPassword,
} from "@/lib/api/auth";
import type { UserProfile } from "@/types";

interface UserStoreState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  hasBootstrapped: boolean;
  setUser: (user: UserProfile, token?: string) => void;
  bootstrap: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  hasBootstrapped: false,

  setUser: (user, token) =>
    set({
      user,
      token: token ?? null,
      error: null,
    }), 

  bootstrap: async () => {
    try {
      const user = await getCurrentUser();
      set((state) => ({
        user,
        token: state.token,
        error: null,
        hasBootstrapped: true,
      }));
    } catch (error) {
      set({
        user: null,
        token: null,
        error:
          error instanceof Error ? error.message : "Failed to restore user session.",
        hasBootstrapped: true,
      });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginByPassword({ email, password });
      set({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
        hasBootstrapped: true,
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

  register: async ({ email, password, name }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerByPassword({ email, password, name });
      set({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
        hasBootstrapped: true,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
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
      hasBootstrapped: true,
    }),
}));
