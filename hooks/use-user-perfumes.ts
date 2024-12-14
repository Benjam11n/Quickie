import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserPerfume } from "@/lib/types";

interface UserPerfumesState {
  collections: UserPerfume[];
  addToCollection: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  addRating: (productId: string, rating: number, review?: string) => void;
  removeFromCollection: (productId: string) => void;
}

export const useUserPerfumes = create<UserPerfumesState>()(
  persist(
    (set) => ({
      collections: [],
      addToCollection: (productId) =>
        set((state) => {
          const existing = state.collections.find(
            (p) => p.productId === productId
          );
          if (existing) {
            return {
              collections: state.collections.map((p) =>
                p.productId === productId ? { ...p, inCollection: true } : p
              ),
            };
          }
          return {
            collections: [
              ...state.collections,
              {
                productId,
                addedAt: new Date().toISOString(),
                inCollection: true,
                isFavorite: false,
              },
            ],
          };
        }),
      toggleFavorite: (productId) =>
        set((state) => {
          const existing = state.collections.find(
            (p) => p.productId === productId
          );
          if (existing) {
            return {
              collections: state.collections.map((p) =>
                p.productId === productId
                  ? { ...p, isFavorite: !p.isFavorite }
                  : p
              ),
            };
          }
          return {
            collections: [
              ...state.collections,
              {
                productId,
                addedAt: new Date().toISOString(),
                inCollection: false,
                isFavorite: true,
              },
            ],
          };
        }),
      addRating: (productId, rating, review) =>
        set((state) => {
          const existing = state.collections.find(
            (p) => p.productId === productId
          );
          if (existing) {
            return {
              collections: state.collections.map((p) =>
                p.productId === productId ? { ...p, rating, review } : p
              ),
            };
          }
          return {
            collections: [
              ...state.collections,
              {
                productId,
                rating,
                review,
                addedAt: new Date().toISOString(),
                inCollection: false,
                isFavorite: false,
              },
            ],
          };
        }),
      removeFromCollection: (productId) =>
        set((state) => ({
          collections: state.collections.filter(
            (p) => p.productId !== productId
          ),
        })),
    }),
    {
      name: "user-perfumes-storage",
    }
  )
);
