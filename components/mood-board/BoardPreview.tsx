'use client';

import { motion } from 'framer-motion';
import { Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { MoodBoard } from '@/types';

interface BoardPreviewProps {
  board: MoodBoard;
  onDelete: () => void;
}

export function BoardPreview({ board, onDelete }: BoardPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link href={ROUTES.BOARDS_VIEW(board._id)}>
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="relative aspect-square bg-accent/50">
            {/* Preview would go here */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Image
                src={board.perfumes[0].perfume.images[0]}
                alt={board.perfumes[0].perfume.name}
                fill
              />
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-semibold transition-colors group-hover:text-primary">
                  {board.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created{' '}
                  {board.createdAt
                    ? new Date(board.createdAt).toLocaleDateString()
                    : 'Unknown date'}
                </p>
              </div>

              <div className="flex gap-2">
                {board.isPublic && (
                  <Button variant="ghost" size="icon" className="size-8">
                    <Share2 className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                    toast.success('Successfully Deleted.');
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            {board.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {board.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
