'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MoodBoard } from '@/types';

import { BoardList } from './BoardList';
import { ROUTES } from '@/constants/routes';

interface MoodBoardGridProps {
  boards: MoodBoard[];
}

export function MoodBoardGrid({ boards }: MoodBoardGridProps) {
  if (boards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto max-w-sm space-y-4">
          <h3 className="text-lg font-semibold">No Mood Boards Yet</h3>
          <p className="text-muted-foreground">
            Create your first mood board to start organizing your fragrance
            discoveries.
          </p>
          <Button asChild>
            <Link href={ROUTES.BOARDS_NEW}>
              <Plus className="mr-2 size-4" />
              Create Mood Board
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BoardList />
      </motion.div>
    </AnimatePresence>
  );
}
