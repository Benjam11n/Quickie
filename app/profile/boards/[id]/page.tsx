'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BoardCanvas } from '@/components/mood-board/board-canvas';
import { BoardSidebar } from '@/components/mood-board/board-sidebar';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { products } from '@/lib/data';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile?tab=boards">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameChange}
            className="text-xl font-bold bg-transparent border-none hover:bg-accent px-2 rounded-md"
          />
        </div>

        <Button className="gap-2">
          <Save className="h-4 w-4" />
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
