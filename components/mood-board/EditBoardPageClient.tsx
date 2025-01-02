'use client';
import { ArrowLeft, Save } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Loading from '@/app/(root)/loading';
import { BoardCanvas } from '@/components/mood-board/BoardCanvas';
import { BoardSidebar } from '@/components/mood-board/BoardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { useEditMoodboardStore } from '@/hooks/stores/use-edit-mood-boards-store';
import { updateMoodBoard } from '@/lib/actions/moodboard.action';
import { MoodBoard, PerfumePosition } from '@/types';
import { Perfume } from '@/types/models/fragrance';

import { Textarea } from '../ui/textarea';

interface EditBoardPageProps {
  initialBoard: MoodBoard;
  session: Session;
}

export default function EditBoardPageClient({
  initialBoard,
}: EditBoardPageProps) {
  const router = useRouter();
  const { data: perfumesResponse, isPending } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: '',
  });

  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const {
    currentBoard,
    hasChanges,
    initializeBoard,
    updateName,
    updateDescription,
    addPerfume,
    removePerfume,
    getChanges,
  } = useEditMoodboardStore();

  // Initialize edit state
  useEffect(() => {
    initializeBoard(initialBoard);
  }, [initialBoard, initializeBoard]);

  const handleSaveChanges = async () => {
    if (!hasChanges || !currentBoard) return;

    const changes = getChanges();

    const mapPerfumePosition = (p: PerfumePosition) => ({
      perfume: p.perfume._id,
      position: p.position,
    });

    const updatedPerfumes =
      changes.perfumes?.map(mapPerfumePosition) ||
      currentBoard.perfumes.map(mapPerfumePosition);

    const result = await updateMoodBoard({
      boardId: currentBoard._id,
      name: changes.name || currentBoard.name,
      description: changes.description || currentBoard.description,
      tags: changes.tags || currentBoard.tags,
      isPublic: changes.isPublic ?? currentBoard.isPublic,
      perfumes: updatedPerfumes,
      dimensions: changes.dimensions || currentBoard.dimensions,
      ...changes,
    });

    if (result.success && result.data) {
      // Transform the response data as well
      initializeBoard(result.data);
      toast.success('Changes saved successfully.');
    } else {
      toast.error('Failed to save changes.');
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

      addPerfume(product, { x, y });
      setSelectedSquare(null);
    }
  };

  const handleNameChange = (newName: string) => {
    updateName(newName);
  };

  if (isPending) {
    return <Loading />;
  }

  if (!perfumesResponse?.data) {
    return notFound();
  }

  const { perfumes } = perfumesResponse.data || {};

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={router.back}>
          <ArrowLeft className="size-4" />
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
      <div className="mb-6">
        <Textarea
          placeholder="Add a description for your board..."
          value={currentBoard?.description || ''}
          onChange={(e) => updateDescription(e.target.value)}
          className="min-h-[100px] resize-none rounded-md bg-transparent hover:bg-accent"
        />
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <BoardCanvas
            board={currentBoard || initialBoard}
            perfumes={perfumes}
            selectedSquare={selectedSquare}
            onSquareSelect={setSelectedSquare}
            onRemovePerfume={(perfumeId) => {
              removePerfume(perfumeId);
            }}
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
