'use client';

import { motion } from 'framer-motion';
import { Plus, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMoodBoards } from '@/hooks/use-mood-boards';



export default function BoardsPage() {
  const { boards, createBoard, deleteBoard } = useMoodBoards();
  const [newBoardName, setNewBoardName] = useState('');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Your Mood Boards
          </span>
        </h2>

        <form onSubmit={handleCreateBoard} className="flex gap-2">
          <Input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name..."
            className="w-64"
          />
          <Button type="submit">
            <Plus className="mr-2 size-4" />
            Create Board
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((board, index) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/profile/boards/${board.id}`}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video bg-accent/50">
                  {/* Preview would go here */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    {board.perfumes.length} perfumes
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold transition-colors group-hover:text-primary">
                        {board.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(board.createdAt).toLocaleDateString()}
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
                          deleteBoard(board.id);
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
        ))}
      </div>
    </div>
  );
}
