'use client';

import { create } from 'zustand';

import { MoodBoard } from '@/types';

interface useEditMoodboardStoreState {
  originalBoard: MoodBoard | null;
  currentBoard: MoodBoard | null;
  hasChanges: boolean;

  // Initialization
  initializeBoard: (board: MoodBoard) => void;

  // Board mutations
  updateName: (name: string) => void;
  updateDescription: (description: string) => void;
  addPerfume: (perfumeId: string, position: { x: number; y: number }) => void;
  removePerfume: (perfumeId: string) => void;
  updatePerfumePosition: (
    perfumeId: string,
    position: { x: number; y: number }
  ) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleVisibility: () => void;

  // Change management
  hasUnsavedChanges: () => boolean;
  resetChanges: () => void;
  getChanges: () => Partial<MoodBoard>;
}

export const useEditMoodboardStore = create<useEditMoodboardStoreState>(
  (set, get) => ({
    originalBoard: null,
    currentBoard: null,
    hasChanges: false,

    initializeBoard: (board) =>
      set({
        originalBoard: board,
        currentBoard: { ...board },
        hasChanges: false,
      }),

    updateName: (name) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: { ...state.currentBoard, name },
          hasChanges: true,
        };
      }),

    updateDescription: (description) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: { ...state.currentBoard, description },
          hasChanges: true,
        };
      }),

    addPerfume: (perfumeId, position) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            perfumes: [...state.currentBoard.perfumes, { perfumeId, position }],
          },
          hasChanges: true,
        };
      }),

    removePerfume: (perfumeId) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            perfumes: state.currentBoard.perfumes.filter(
              (p) => p.perfumeId !== perfumeId
            ),
          },
          hasChanges: true,
        };
      }),

    updatePerfumePosition: (perfumeId, position) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            perfumes: state.currentBoard.perfumes.map((p) =>
              p.perfumeId === perfumeId ? { ...p, position } : p
            ),
          },
          hasChanges: true,
        };
      }),

    addTag: (tag) =>
      set((state) => {
        if (!state.currentBoard || state.currentBoard.tags.includes(tag))
          return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            tags: [...state.currentBoard.tags, tag],
          },
          hasChanges: true,
        };
      }),

    removeTag: (tag) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            tags: state.currentBoard.tags.filter((t) => t !== tag),
          },
          hasChanges: true,
        };
      }),

    toggleVisibility: () =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            isPublic: !state.currentBoard.isPublic,
          },
          hasChanges: true,
        };
      }),

    hasUnsavedChanges: () => {
      const state = get();
      return state.hasChanges;
    },

    resetChanges: () =>
      set((state) => ({
        currentBoard: state.originalBoard ? { ...state.originalBoard } : null,
        hasChanges: false,
      })),

    getChanges: () => {
      const state = get();
      if (!state.currentBoard || !state.originalBoard) return {};

      const changes: Partial<MoodBoard> = {};

      // Only include changed fields
      if (state.currentBoard.name !== state.originalBoard.name) {
        changes.name = state.currentBoard.name;
      }
      if (state.currentBoard.description !== state.originalBoard.description) {
        changes.description = state.currentBoard.description;
      }
      if (state.currentBoard.isPublic !== state.originalBoard.isPublic) {
        changes.isPublic = state.currentBoard.isPublic;
      }
      // Deep comparison for perfumes and tags
      if (
        JSON.stringify(state.currentBoard.perfumes) !==
        JSON.stringify(state.originalBoard.perfumes)
      ) {
        changes.perfumes = state.currentBoard.perfumes;
      }
      if (
        JSON.stringify(state.currentBoard.tags) !==
        JSON.stringify(state.originalBoard.tags)
      ) {
        changes.tags = state.currentBoard.tags;
      }

      return changes;
    },
  })
);
