"use client";

import { MoodBoard } from "@/lib/types";
import { BoardList } from "./board-list";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface MoodBoardGridProps {
  boards: MoodBoard[];
}

export function MoodBoardGrid({ boards }: MoodBoardGridProps) {
  if (boards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-sm mx-auto space-y-4">
          <h3 className="text-lg font-semibold">No Mood Boards Yet</h3>
          <p className="text-muted-foreground">
            Create your first mood board to start organizing your fragrance
            discoveries.
          </p>
          <Button asChild>
            <Link href="/profile/boards/create">
              <Plus className="mr-2 h-4 w-4" />
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
