import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaitlistStore {
  hasSeenWaitlist: boolean;
  lastShown: number | null;
  email: string | null;
  setHasSeenWaitlist: (seen: boolean) => void;
  setLastShown: (date: number) => void;
  setEmail: (email: string) => void;
  shouldShowWaitlist: () => boolean;
}

export const useWaitlistStore = create<WaitlistStore>()(
  persist(
    (set, get) => ({
      hasSeenWaitlist: false,
      lastShown: null,
      email: null,

      setHasSeenWaitlist: (seen) => set({ hasSeenWaitlist: seen }),
      setLastShown: (date) => set({ lastShown: date }),
      setEmail: (email) => set({ email }),

      shouldShowWaitlist: () => {
        const { hasSeenWaitlist, lastShown } = get();

        // If user has never seen the waitlist
        if (!hasSeenWaitlist) return true;

        // If user has signed up (email exists)
        if (get().email) return false;

        // Show again after 7 days if they haven't signed up
        if (lastShown) {
          const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
          return Date.now() - lastShown > sevenDays;
        }

        return false;
      },
    }),
    {
      name: 'waitlist-storage',
    }
  )
);
