'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { useMoodBoards } from '@/hooks/use-mood-boards';

export default function CreateBoardPage() {
  const router = useRouter();
  const { createBoard } = useMoodBoards();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const board = createBoard(name.trim(), description.trim());
      router.push(ROUTES.BOARDS_EDIT(board.id));
    }
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            {/* TODO: Change to use userId instead */}
            <ArrowLeft className="size-4" onClick={() => router.back()} />
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="holographic-text">Create New Board</span>
          </h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Board Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Summer Fragrances..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A collection of fresh and vibrant scents..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="glow-effect">
                Create Board
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
