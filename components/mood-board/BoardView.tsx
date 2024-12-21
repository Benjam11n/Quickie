'use client';

import { ArrowLeft, Edit, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useState } from 'react';

import { ShareDialog } from '@/components/comparison/ShareDialog';
import { BoardCanvas } from '@/components/mood-board/BoardCanvas';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { MoodBoard } from '@/types';
import { products } from '@/types/data';

interface ViewBoardProps {
  board: MoodBoard;
  user?: User | null;
}

export function ViewBoard({ board, user }: ViewBoardProps) {
  const { likeBoard } = useMoodBoards();
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const isOwner = user?.name === board.userName;

  const handleLike = () => {
    setIsLiked(!isLiked);
    likeBoard(board.id, user?.name || '');
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          {isOwner && user.id ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href={ROUTES.PROFILE(user.id)}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              asChild
            />
          )}
          <div className="flex-1 gap-2">
            <h1 className="text-3xl font-bold">
              <span className="holographic-text">{board.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Created by {board.userName || 'Anonymous'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={isLiked ? 'text-red-500' : ''}
            >
              <Heart className="size-4" />
            </Button>
            {isOwner && (
              <Button asChild variant="outline">
                <Link href={`/boards/${board.id}/edit`}>
                  <Edit className="mr-2 size-4" />
                  Edit Board
                </Link>
              </Button>
            )}
          </div>
        </div>

        {board.description && (
          <p className="ml-14 text-sm text-muted-foreground">
            {board.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-accent/10">
          {/* // TODO: Improve UI */}
          <BoardCanvas board={board} products={products} />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Perfumes in this board</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {board.perfumes.map((perfume) => (
              <Link
                key={perfume.id}
                href={`/fragrances/${perfume.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-accent/10"
              >
                {/* You can add perfume image here */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">
                    View Details
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ShareDialog text="Share Mood Board" />
    </div>
  );
}