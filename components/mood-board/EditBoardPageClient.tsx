'use client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Loading from '@/app/(root)/loading';
import { BoardCanvas } from '@/components/mood-board/BoardCanvas';
import { BoardSidebar } from '@/components/mood-board/BoardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { useEditMoodboardStore } from '@/hooks/stores/use-edit-mood-boards-store';
import { updateMoodBoard } from '@/lib/actions/moodboard.action';
import { MoodBoardView } from '@/types';
import { Perfume } from '@/types/fragrance';

interface EditBoardPageProps {
  initialBoard: MoodBoardView;
  session: Session;
}

export default function EditBoardPageClient({
  initialBoard,
  session,
}: EditBoardPageProps) {
  const { data: perfumesResponse, isLoading } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: '',
    filter: '',
  });

  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const {
    currentBoard,
    hasChanges,
    initializeBoard,
    updateName,
    addPerfume,
    getChanges,
    // resetChanges,
  } = useEditMoodboardStore();

  // Initialize edit state
  useEffect(() => {
    initializeBoard(initialBoard);
  }, [initialBoard, initializeBoard]);

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
      initializeBoard(result.data);
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

  const handleAddPerfume = (product: Perfume) => {
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

  if (isLoading) {
    return <Loading />;
  }

  if (!perfumesResponse?.data) {
    return notFound();
  }

  const { perfumes } = perfumesResponse.data || {};

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
            perfumes={perfumes}
            selectedSquare={selectedSquare}
            onSquareSelect={setSelectedSquare}
          />
        </div>
        <BoardSidebar
          perfumes={perfumes}
          onAddPerfume={handleAddPerfume}
          selectedSquare={selectedSquare}
        />
      </div>
    </div>
  );
}
