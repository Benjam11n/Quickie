'use client';

import { create } from 'zustand';

import {
  BoardDimensions,
  MoodBoard,
  MoodBoardView,
  PerfumePositionView,
} from '@/types';

interface EditMoodboardStore {
  originalBoard: MoodBoardView | null;
  currentBoard: MoodBoardView | null;
  hasChanges: boolean;

  // Initialization
  initializeBoard: (board: MoodBoardView) => void;

  // Board mutations
  updateName: (name: string) => void;
  updateDescription: (description: string) => void;
  addPerfume: (
    perfume: { _id: string; name: string; images: string[] },
    position: { x: number; y: number }
  ) => void;
  removePerfume: (perfumeId: string) => void;
  updatePerfumePosition: (
    perfumeId: string,
    position: { x: number; y: number }
  ) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleVisibility: () => void;
  updateDimensions: (dimensions: BoardDimensions) => void;

  // Change management
  hasUnsavedChanges: () => boolean;
  resetChanges: () => void;
  getChanges: () => Partial<MoodBoard>;
}

export const useEditMoodboardStore = create<EditMoodboardStore>((set, get) => ({
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

      // Validate position is within grid bounds
      if (
        position.x >= state.currentBoard.dimensions.cols ||
        position.y >= state.currentBoard.dimensions.rows
      ) {
        console.error('Position out of bounds');
        return state;
      }

      const newPerfumePosition: PerfumePositionView = {
        perfume: {
          _id: perfume._id,
          name: perfume.name,
          images: perfume.images,
        },
        position,
      };
      return {
        currentBoard: {
          ...state.currentBoard,
          perfumes: [...state.currentBoard.perfumes, newPerfumePosition],
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
            (p) => p.perfume._id !== perfumeId
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
            p.perfume._id === perfumeId ? { ...p, position } : p
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

  updateDimensions: (dimensions) =>
    set((state) => {
      if (!state.currentBoard) return state;

      // Get the current grid size
      const currentSize =
        state.currentBoard.dimensions.cols * state.currentBoard.dimensions.rows;
      const newSize = dimensions.cols * dimensions.rows;

      // If new grid is smaller, remove perfumes that would be out of bounds
      let updatedPerfumes = state.currentBoard.perfumes;
      if (newSize < currentSize) {
        updatedPerfumes = state.currentBoard.perfumes.filter(
          (p) =>
            p.position.x < dimensions.cols && p.position.y < dimensions.rows
        );
      }

      return {
        currentBoard: {
          ...state.currentBoard,
          dimensions,
          perfumes: updatedPerfumes,
        },
        hasChanges: true,
      };
    }),

  getChanges: () => {
    const state = get();
    if (!state.currentBoard || !state.originalBoard) return {};

    const changes: Partial<MoodBoard> = {
      // ... existing changes ...
    };

    // Add dimensions to changes if modified
    if (
      JSON.stringify(state.currentBoard.dimensions) !==
      JSON.stringify(state.originalBoard.dimensions)
    ) {
      changes.dimensions = state.currentBoard.dimensions;
    }

    return changes;
  },
}));
