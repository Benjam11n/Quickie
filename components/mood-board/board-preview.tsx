"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoodBoard } from "@/lib/types";
import { Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      <Link href={`/profile/boards/${board.id}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="aspect-video relative bg-accent/50">
            {/* Preview would go here */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {board.perfumes.length} perfumes
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {board.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                {board.isPublic && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {board.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
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
