'use client';

import { ArrowLeft, Edit, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useState } from 'react';

import Loading from '@/app/(root)/loading';
import { ShareDialog } from '@/components/comparison/ShareDialog';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { toggleLike } from '@/lib/actions/moodboard.action';
import { MoodBoard } from '@/types';

import { BoardCanvasView } from './BoardCanvasView';

interface BoardViewProps {
  board: MoodBoard;
  user?: User | null;
}

export function BoardView({ board, user }: BoardViewProps) {
  const { data: perfumesResponse, isPending } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: '',
  });

  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const isOwner = user?.id === board.author._id;

  const handleLike = async () => {
    setIsLiked(!isLiked);
    toggleLike(board._id);
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
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          {isOwner && user?.id ? (
            <Button variant="ghost" size="icon" onClick={router.back}>
              <ArrowLeft className="size-4" />
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
              <span className="holographic-text text-4xl">{board.name}</span>
            </h1>
            <p className="text-lg font-semibold text-muted-foreground">
              Created by {board.author.username || 'Anonymous'}
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
                <Link href={`/boards/${board._id}/edit`}>
                  <Edit className="mr-2 size-4" />
                  Edit Board
                </Link>
              </Button>
            )}
          </div>
        </div>

        {board.description && (
          <p className="ml-14 max-w-xl text-sm text-muted-foreground lg:max-w-3xl">
            {board.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="relative w-full overflow-hidden rounded-lg bg-accent/10">
            <BoardCanvasView board={board} perfumes={perfumes} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Perfumes in this board</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {board.perfumes.map((perfumePosition) => (
              <Link
                key={perfumePosition.perfume._id}
                href={ROUTES.PRODUCT(perfumePosition.perfume._id)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-accent/10"
              >
                <Image
                  src={perfumePosition.perfume.images[0]}
                  alt={perfumePosition.perfume.name}
                  fill
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">
                    {perfumePosition.perfume.name}
                  </span>
                  <span className="text-sm font-medium text-primary">
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
