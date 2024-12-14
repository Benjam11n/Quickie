"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardPreview } from "./board-preview";
import { useMoodBoards } from "@/hooks/use-mood-boards";
import Link from "next/link";

export function BoardList() {
  const { boards, deleteBoard } = useMoodBoards();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
            Your Mood Boards
          </span>
        </h2>

        <Button asChild>
          <Link href="/profile/boards/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
