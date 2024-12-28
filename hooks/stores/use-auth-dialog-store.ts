'use client';

import { create } from 'zustand';

interface AuthDialogStore {
  isOpen: boolean;
  onSuccess?: () => void;
  callbackUrl?: string;
  open: (onSuccess?: () => void, callbackUrl?: string) => void;
  close: () => void;
}

export const useAuthDialogStore = create<AuthDialogStore>((set) => ({
  isOpen: false,
  onSuccess: undefined,
  callbackUrl: undefined,
  open: (onSuccess, callbackUrl) =>
    set({ isOpen: true, onSuccess, callbackUrl }),
  close: () =>
    set({ isOpen: false, onSuccess: undefined, callbackUrl: undefined }),
}));
