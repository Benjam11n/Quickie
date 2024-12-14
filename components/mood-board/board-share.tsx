"use client";

import { Copy, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoodBoard } from "@/lib/types";

interface BoardShareProps {
  board: MoodBoard;
  onToggleVisibility: () => void;
}

export function BoardShare({ board, onToggleVisibility }: BoardShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (board.shareUrl) {
      navigator.clipboard.writeText(board.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Board</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={board.shareUrl || "Make board public to get share link"}
              readOnly
              disabled={!board.isPublic}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!board.isPublic}
            >
              <Copy className="size-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {board.isPublic ? "Board is public" : "Board is private"}
            </span>
            <Button
              onClick={onToggleVisibility}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="size-4" />
              {board.isPublic ? "Make Private" : "Make Public"}
            </Button>
          </div>

          {copied && (
            <p className="text-sm text-green-500">
              Share link copied to clipboard!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
