"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onChange,
  readonly = true,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "text-yellow-400 transition-all",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
        >
          <Star
            className={cn(
              "h-5 w-5 transition-all",
              star <= rating ? "fill-current" : "fill-none",
              !readonly && star <= rating && "animate-pulse"
            )}
          />
        </button>
      ))}
    </div>
  );
}
