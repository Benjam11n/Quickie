'use client';
import { ArrowLeft, Share2, Edit, Heart } from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BoardCanvas } from '@/components/mood-board/BoardCanvas';
import { Button } from '@/components/ui/button';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { products } from '@/types/data';
import { useSession } from 'next-auth/react';
import { ShareDialog } from '@/components/comparison/ShareDialog';

export default function ViewBoardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { boards, likeBoard } = useMoodBoards();
  const board = boards.find((b) => b.id === params.id);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!board) {
      notFound();
    }
  }, [board]);

  if (!board) return null;

  const isOwner = session?.user?.name === board.userName;

  const handleLike = () => {
    setIsLiked(!isLiked);
    likeBoard(board.id, session?.user?.name || '');
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile/boards">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
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

      <div className="flex flex-col gap-6">
        {board.description && (
          <p className="text-muted-foreground">{board.description}</p>
        )}

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