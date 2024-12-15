'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MoodBoard } from '@/types';
import { nanoid } from 'nanoid';

interface MoodBoardsState {
  boards: MoodBoard[];
  createBoard: (name: string, description?: string) => MoodBoard;
  updateBoard: (id: string, updates: Partial<MoodBoard>) => void;
  deleteBoard: (id: string) => void;
  addPerfumeToBoard: (
    boardId: string,
    perfumeId: string,
    position: { x: number; y: number }
  ) => void;
  removePerfumeFromBoard: (boardId: string, perfumeId: string) => void;
  updatePerfumePosition: (
    boardId: string,
    perfumeId: string,
    position: { x: number; y: number }
  ) => void;
  toggleBoardVisibility: (boardId: string) => void;
  addTagToBoard: (boardId: string, tag: string) => void;
  removeTagFromBoard: (boardId: string, tag: string) => void;
}

export const useMoodBoards = create<MoodBoardsState>()(
  persist(
    (set) => ({
      boards: [],
      createBoard: (name, description) => {
        const newBoard: MoodBoard = {
          id: nanoid(),
          name,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user-1', // Replace with actual user ID
          tags: [],
          perfumes: [],
          isPublic: false,
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
        }));

        return newBoard;
      },
      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, ...updates, updatedAt: new Date().toISOString() }
              : board
          ),
        })),
      deleteBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),
      addPerfumeToBoard: (boardId, perfumeId, position) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  perfumes: [...board.perfumes, { id: perfumeId, position }],
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      removePerfumeFromBoard: (boardId, perfumeId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  perfumes: board.perfumes.filter((p) => p.id !== perfumeId),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      updatePerfumePosition: (boardId, perfumeId, position) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  perfumes: board.perfumes.map((p) =>
                    p.id === perfumeId ? { ...p, position } : p
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      toggleBoardVisibility: (boardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  isPublic: !board.isPublic,
                  shareUrl: !board.isPublic
                    ? `${window.location.origin}/board/${board.id}`
                    : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      addTagToBoard: (boardId, tag) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId && !board.tags.includes(tag)
              ? {
                  ...board,
                  tags: [...board.tags, tag],
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      removeTagFromBoard: (boardId, tag) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tags: board.tags.filter((t) => t !== tag),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
    }),
    {
      name: 'mood-boards-storage',
    }
  )
);
