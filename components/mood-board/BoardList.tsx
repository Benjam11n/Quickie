'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useMoodBoards } from '@/hooks/use-mood-boards';

import { BoardPreview } from './BoardPreview';

export function BoardList() {
  const { boards, deleteBoard } = useMoodBoards();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Your Mood Boards
          </span>
        </h2>

        <Button asChild>
          <Link href="/profile/boards/create">
            <Plus className="mr-2 size-4" />
            Create Board
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <BoardPreview
            key={board.id}
            board={board}
            onDelete={() => deleteBoard(board.id)}
          />
        ))}
      </div>
    </div>
  );
}
