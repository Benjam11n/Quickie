'use client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { BoardCanvas } from '@/components/mood-board/BoardCanvas';
import { BoardSidebar } from '@/components/mood-board/BoardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { useEditBoardStore } from '@/hooks/use-mood-boards';
import { updateMoodBoard } from '@/lib/actions/moodboard.action';
import { MoodBoard, transformToClientBoard } from '@/types';
import { products } from '@/types/data';
import { Product } from '@/types/fragrance';

interface EditBoardPageProps {
  initialBoard: MoodBoard;
  session: Session;
}

export default function EditBoardPageClient({
  initialBoard,
  session,
}: EditBoardPageProps) {
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const {
    currentBoard,
    hasChanges,
    initializeBoard,
    updateName,
    addPerfume,
    getChanges,
    // resetChanges,
  } = useEditBoardStore();

  // Initialize edit state
  useEffect(() => {
    initializeBoard(initialBoard);
  }, [initialBoard, initializeBoard]);

  console.log(currentBoard);
  const handleSaveChanges = async () => {
    if (!hasChanges || !currentBoard) return;

    const changes = getChanges();
    const result = await updateMoodBoard({
      boardId: currentBoard._id,
      name: changes.name || currentBoard.name,
      tags: changes.tags || currentBoard.tags,
      isPublic: changes.isPublic ?? currentBoard.isPublic,
      ...changes,
    });

    if (result.success && result.data) {
      // Transform the response data as well
      const clientBoard = transformToClientBoard(result.data);
      initializeBoard(clientBoard);
      toast.success('Changes saved successfully');
    } else {
      toast.error('Failed to save changes');
    }
  };

  // Add warning when leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleAddPerfume = (product: Product) => {
    if (selectedSquare !== null) {
      const x = selectedSquare % 3;
      const y = Math.floor(selectedSquare / 3);

      addPerfume(product.id, { x, y });
      setSelectedSquare(null);
    }
  };

  const handleNameChange = (newName: string) => {
    updateName(newName);
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.PROFILE(session?.user?.id ?? '')}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <Input
            value={currentBoard?.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
            className="rounded-md border-none bg-transparent px-2 text-xl font-bold hover:bg-accent"
          />
        </div>
        <Button className="gap-2" onClick={handleSaveChanges}>
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <BoardCanvas
            board={currentBoard || initialBoard}
            products={products}
            selectedSquare={selectedSquare}
            onSquareSelect={setSelectedSquare}
          />
        </div>
        <BoardSidebar
          products={products}
          onAddPerfume={handleAddPerfume}
          selectedSquare={selectedSquare}
        />
      </div>
    </div>
  );
}
