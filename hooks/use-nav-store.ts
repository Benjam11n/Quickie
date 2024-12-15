import { create } from 'zustand';

interface NavStore {
  isOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
}

export const useNavStore = create<NavStore>((set) => ({
  isOpen: false,
  openNav: () => set({ isOpen: true }),
  closeNav: () => set({ isOpen: false }),
}));
