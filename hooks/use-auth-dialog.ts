"use client";

import { create } from "zustand";

interface AuthDialogStore {
  isOpen: boolean;
  onSuccess?: () => void;
  open: (onSuccess?: () => void) => void;
  close: () => void;
}

export const useAuthDialog = create<AuthDialogStore>()((set) => ({
  isOpen: false,
  onSuccess: undefined,
  open: (onSuccess) => set({ isOpen: true, onSuccess }),
  close: () => set({ isOpen: false, onSuccess: undefined }),
}));
