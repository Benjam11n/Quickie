import { create } from 'zustand';

interface ComparisonStore {
  selectedItems: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

const MAXIMMUM_COMPARISONS = 2;

export const useComparisonStore = create<ComparisonStore>((set) => ({
  selectedItems: [],
  addItem: (id) =>
    set((state) => {
      if (state.selectedItems.length >= MAXIMMUM_COMPARISONS) {
        return { selectedItems: [...state.selectedItems.slice(1), id] };
      }
      return { selectedItems: [...state.selectedItems, id] };
    }),
  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((itemId) => itemId !== id),
    })),
  reset: () => set({ selectedItems: [] }),
}));
