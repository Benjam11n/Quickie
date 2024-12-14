'use client';

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BoardCanvas } from '@/components/mood-board/board-canvas';
import { BoardSidebar } from '@/components/mood-board/board-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { products } from '@/lib/data';

export default function BoardPage() {
  const params = useParams();
  const { boards, updateBoard, addPerfumeToBoard } = useMoodBoards();
  const [name, setName] = useState('');

  const board = boards.find((b) => b.id === params.id);

  useEffect(() => {
    if (board) {
      setName(board.name);
    } else {
      notFound();
    }
  }, [board]);

  if (!board) {
    return null; // Let useEffect handle the notFound() redirect
  }

  const handleNameChange = () => {
    if (name.trim() !== board.name) {
      updateBoard(board.id, { name: name.trim() });
    }
  };

  const handleAddPerfume = (product: any) => {
    addPerfumeToBoard(board.id, product.id, {
      x: Math.random() * 300,
      y: Math.random() * 300,
    });
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile?tab=boards">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameChange}
            className="rounded-md border-none bg-transparent px-2 text-xl font-bold hover:bg-accent"
          />
        </div>

        <Button className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <BoardCanvas board={board} products={products} />
        </div>
        <BoardSidebar
          board={board}
          products={products}
          onAddPerfume={handleAddPerfume}
        />
      </div>
    </div>
  );
}
