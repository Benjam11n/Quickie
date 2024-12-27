'use client';

import { create } from 'zustand';

import { MoodBoardView } from '@/types';

interface useEditMoodboardStoreState {
  originalBoard: MoodBoardView | null;
  currentBoard: MoodBoardView | null;
  hasChanges: boolean;

  // Initialization
  initializeBoard: (board: MoodBoardView) => void;

  // Board mutations
  updateName: (name: string) => void;
  updateDescription: (description: string) => void;
  addPerfume: (perfume: string, position: { x: number; y: number }) => void;
  removePerfume: (perfume: string) => void;
  updatePerfumePosition: (
    perfume: string,
    position: { x: number; y: number }
  ) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleVisibility: () => void;

  // Change management
  hasUnsavedChanges: () => boolean;
  resetChanges: () => void;
  getChanges: () => Partial<MoodBoardView>;
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

    addPerfume: (perfume, position) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            perfumes: [...state.currentBoard.perfumes, { perfume, position }],
          },
          hasChanges: true,
        };
      }),

    removePerfume: (perfume) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            perfumes: state.currentBoard.perfumes.filter(
              (p) => p.perfume !== perfume
            ),
          },
          hasChanges: true,
        };
      }),

    updatePerfumePosition: (perfume, position) =>
      set((state) => {
        if (!state.currentBoard) return state;
        return {
          currentBoard: {
            ...state.currentBoard,
            perfumes: state.currentBoard.perfumes.map((p) =>
              p.perfume === perfume ? { ...p, position } : p
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

      const changes: Partial<MoodBoardView> = {};

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
