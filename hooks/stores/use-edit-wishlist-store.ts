// hooks/stores/use-wishlist-edit-store.ts
import { create } from 'zustand';

interface WishlistEditStore {
  isEditing: boolean;
  editedName: string;
  editedDescription: string;
  // Actions
  setIsEditing: (isEditing: boolean) => void;
  setEditedName: (name: string) => void;
  setEditedDescription: (description: string) => void;
  initializeFromWishlist: (wishlist: {
    name: string;
    description?: string;
  }) => void;
  reset: () => void;
}

export const useWishlistEditStore = create<WishlistEditStore>((set) => ({
  isEditing: false,
  editedName: '',
  editedDescription: '',

  setIsEditing: (isEditing) => set({ isEditing }),
  setEditedName: (name) => set({ editedName: name }),
  setEditedDescription: (description) =>
    set({ editedDescription: description }),

  initializeFromWishlist: (wishlist) =>
    set({
      editedName: wishlist.name,
      editedDescription: wishlist.description || '',
      isEditing: false,
    }),

  reset: () =>
    set({
      isEditing: false,
      editedName: '',
      editedDescription: '',
    }),
}));
