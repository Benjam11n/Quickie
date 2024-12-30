'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MoodBoard } from '@/types';

import { BoardList } from '../mood-board/BoardList';

interface MoodBoardGridProps {
  boards: MoodBoard[];
}

export function MoodBoardGrid({ boards }: MoodBoardGridProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BoardList boards={boards} />
      </motion.div>
    </AnimatePresence>
  );
}
