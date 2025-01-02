import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { MoodBoard } from '@/types';
import { Perfume } from '@/types/models/fragrance';

interface BoardCanvasViewProps {
  board: MoodBoard;
  perfumes: Perfume[];
}

export function BoardCanvasView({ board, perfumes }: BoardCanvasViewProps) {
  // Get all notes from perfumes in the board
  const noteDistribution = board.perfumes.reduce(
    (acc, perfume) => {
      const product = perfumes.find((p) => p._id === perfume.perfume._id);
      if (!product) return acc;

      Object.values(product.notes)
        .flat()
        .forEach((note) => {
          acc[note.note.name] = (acc[note.note.name] || 0) + note.intensity;
        });

      return acc;
    },
    {} as Record<string, number>
  );

  const totalPercentage = Object.values(noteDistribution).reduce(
    (a, b) => a + b,
    0
  );

  const normalizedDistribution = Object.entries(noteDistribution)
    .map(([name, value]) => ({
      name,
      percentage: (value / totalPercentage) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const getPerfumeAtPosition = (x: number, y: number) => {
    return board.perfumes?.find(
      (p) => p.position.x === x && p.position.y === y
    );
  };

  return (
    <div className="space-y-8">
      {/* Perfume Grid */}
      <div className="grid auto-rows-auto gap-4">
        {Array.from({ length: board.dimensions.rows }).map((_, rowIndex) => {
          const rowPerfumes = Array.from({ length: board.dimensions.cols })
            .map((_, colIndex) => getPerfumeAtPosition(colIndex, rowIndex))
            .filter(Boolean);

          // Skip empty rows
          if (rowPerfumes.length === 0) return null;

          return (
            <div
              key={rowIndex}
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${board.dimensions.cols}, 1fr)`,
              }}
            >
              {Array.from({ length: board.dimensions.cols }).map(
                (_, colIndex) => {
                  const perfume = getPerfumeAtPosition(colIndex, rowIndex);
                  const product = perfume
                    ? perfumes.find((p) => p._id === perfume.perfume._id)
                    : null;

                  if (!product) return null;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        'relative overflow-hidden rounded-lg transition-all',
                        board.dimensions.layout === 'pinterest' &&
                          colIndex % 3 === 1 &&
                          'aspect-[3/4]',
                        'aspect-square'
                      )}
                    >
                      <Link
                        href={ROUTES.PRODUCT(product._id)}
                        className="group block size-full"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="p-4">
                            <p className="font-medium text-white">
                              {product.name}
                            </p>
                            <p className="text-sm text-white/80">
                              Click to view details
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                }
              )}
            </div>
          );
        })}
      </div>

      {/* Note Distribution */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-medium">Note Distribution</h3>
        <div className="space-y-2">
          {normalizedDistribution.map(({ name, percentage }) => (
            <div key={name} className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{name}</p>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-accent">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
