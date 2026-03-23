"use client";

import { create } from "zustand";
import {
  createKnowledgeBase as createKnowledgeBaseApi,
  listKnowledgeBases,
} from "@/lib/api/kb";
import type { KnowledgeBase } from "@/types";

interface CreateKnowledgeBaseInput {
  name: string;
  description: string;
}

interface KbStoreState {
  knowledgeBases: KnowledgeBase[];
  activeKbId: string | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchKnowledgeBases: () => Promise<void>;
  syncKnowledgeBases: () => Promise<void>;
  createKnowledgeBase: (payload: CreateKnowledgeBaseInput) => Promise<KnowledgeBase>;
  selectKnowledgeBase: (id: string) => void;
}

export const useKbStore = create<KbStoreState>((set) => ({
  knowledgeBases: [],
  activeKbId: null,
  isLoading: false,
  isCreating: false,
  error: null,

  fetchKnowledgeBases: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await listKnowledgeBases();
      set((state) => ({
        knowledgeBases: data,
        isLoading: false,
        error: null,
        activeKbId: state.activeKbId ?? data[0]?.id ?? null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load knowledge bases.",
      });
      throw error;
    }
  },

  syncKnowledgeBases: async () => {
    try {
      const data = await listKnowledgeBases();
      set((state) => ({
        knowledgeBases: data,
        error: null,
        activeKbId:
          data.find((item) => item.id === state.activeKbId)?.id ?? data[0]?.id ?? null,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to sync knowledge bases.",
      });
      throw error;
    }
  },

  createKnowledgeBase: async ({ name, description }) => {
    set({ isCreating: true, error: null });
    try {
      const created = await createKnowledgeBaseApi({ name, description });
      set((state) => ({
        knowledgeBases: [created, ...state.knowledgeBases],
        activeKbId: created.id,
        isCreating: false,
        error: null,
      }));
      return created;
    } catch (error) {
      set({
        isCreating: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create knowledge base.",
      });
      throw error;
    }
  },

  selectKnowledgeBase: (id) => set({ activeKbId: id }),
}));
