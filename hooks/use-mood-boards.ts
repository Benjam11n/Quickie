'use client';

import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { MoodBoard } from '@/types';

interface MoodBoardsState {
  boards: MoodBoard[];
  createBoard: (name: string, description?: string) => MoodBoard;
  updateBoard: (id: string, updates: Partial<MoodBoard>) => void;
  likeBoard: (boardId: string, userName: string) => void;
  unlikeBoard: (boardId: string, userName: string) => void;
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
          userName: 'user-1', // Replace with actual user ID
          tags: [],
          perfumes: [],
          isPublic: false,
          likes: 0,
          likedBy: [],
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
        }));

        return newBoard;
      },
      likeBoard: (boardId: string, userName: string) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId && !board.likedBy.includes(userName)
              ? {
                  ...board,
                  likes: board.likes + 1,
                  likedBy: [...board.likedBy, userName],
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      unlikeBoard: (boardId: string, userName: string) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId && board.likedBy.includes(userName)
              ? {
                  ...board,
                  likes: Math.max(0, board.likes - 1), // Prevent negative likes
                  likedBy: board.likedBy.filter((id) => id !== userName),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),
      // isLikedByUser: (boardId: string, userId: string) => {
      //   const board = get().boards.find((b) => b.id === boardId);
      //   return board ? board.likedBy.includes(userId) : false;
      // },
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
