'use client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { BoardCanvas } from '@/components/mood-board/BoardCanvas';
import { BoardSidebar } from '@/components/mood-board/BoardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { useAuth } from '@/lib/utils/auth';
import { products } from '@/types/data';
import { Product } from '@/types/fragrance';

export default function EditBoardPage() {
  const params = useParams();
  const { boards, updateBoard, addPerfumeToBoard } = useMoodBoards();
  const [name, setName] = useState('');
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const { user } = useAuth();

  const board = boards.find((b) => b.id === params.id);

  useEffect(() => {
    if (board) {
      setName(board.name);
    } else {
      notFound();
    }
  }, [board]);

  if (!board) return null;

  const handleNameChange = () => {
    if (name.trim() !== board.name) {
      updateBoard(board.id, { name: name.trim() });
    }
  };

  const handleAddPerfume = (product: Product) => {
    if (selectedSquare !== null) {
      // Calculate grid position based on selected square
      const x = selectedSquare % 3; // For 3-column grid
      const y = Math.floor(selectedSquare / 3);

      addPerfumeToBoard(board.id, product.id, { x, y });
      setSelectedSquare(null);
    }
  };

  const handleSquareSelect = (squareId: number) => {
    setSelectedSquare(squareId);
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.PROFILE(user?.id!)}>
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
        {/* TODO: Implement onClick */}
        <Button
          className="gap-2"
          onClick={() => toast.success('Changes Saved Successfully')}
        >
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <BoardCanvas
            board={board}
            products={products}
            selectedSquare={selectedSquare}
            onSquareSelect={handleSquareSelect}
          />
        </div>
        <BoardSidebar
          board={board}
          products={products}
          onAddPerfume={handleAddPerfume}
          selectedSquare={selectedSquare}
        />
      </div>
    </div>
  );
}
