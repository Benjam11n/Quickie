import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { deleteMoodBoard } from '@/lib/actions/moodboard.action';
import { MoodBoard } from '@/types';

import { BoardPreview } from './BoardPreview';
import { useRouter } from 'next/navigation';

interface BoardListProps {
  boards: MoodBoard[];
}

export function BoardList({ boards }: BoardListProps) {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    await deleteMoodBoard(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          <span className="holographic-text">Your Mood Boards</span>
        </h2>

        <Button asChild>
          <Link href={ROUTES.BOARDS_NEW}>
            <Plus className="mr-1 size-4" />
            Create Mood Board
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <BoardPreview
            key={board._id}
            board={board}
            onDelete={() => handleDelete(board._id)}
          />
        ))}
      </div>
    </div>
  );
}
