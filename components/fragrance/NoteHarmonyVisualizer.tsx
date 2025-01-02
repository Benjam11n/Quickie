'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { NoteHarmony, Note } from '@/types/models/fragrance';

import { Button } from '../ui/button';

interface NoteHarmonyVisualizerProps {
  harmony: NoteHarmony[];
}

export function NoteHarmonyVisualizer({ harmony }: NoteHarmonyVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHarmony, setSelectedHarmony] = useState<NoteHarmony | null>(
    null
  );
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const calculatePosition = useCallback(
    (index: number, total: number, radius: number) => {
      const angle = (index * 2 * Math.PI) / total;
      return {
        x: Math.cos(angle) * radius + dimensions.width / 2,
        y: Math.sin(angle) * radius + dimensions.height / 2,
      };
    },
    [dimensions]
  );

  const renderNote = (
    note: Note,
    index: number,
    total: number,
    radius: number
  ) => {
    const position = calculatePosition(index, total, radius);

    return (
      <motion.div
        key={note.name}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: position.x - 40,
          y: position.y - 40,
        }}
        className={cn(
          'absolute flex size-24 items-center justify-center rounded-full',
          'cursor-pointer transition-shadow duration-300',
          'hover:shadow-lg hover:shadow-primary/20'
        )}
        style={{
          backgroundColor: `${note.family.color}20`,
          border: `2px solid ${note.family.color}`,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={() =>
          setSelectedHarmony(
            selectedHarmony ===
              harmony.find((h) => h.primary.name === note.name)
              ? null
              : harmony.find((h) => h.primary.name === note.name) || null
          )
        }
      >
        <div className="text-center">
          <div className="mx-4 text-xs font-medium">{note.name}</div>
          <div className="text-xs text-muted-foreground">
            {note.family.name}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Note Harmony</h3>

      <div ref={containerRef} className="relative h-[500px]">
        {dimensions.width > 0 &&
          harmony.map((h, i) =>
            renderNote(
              h.primary,
              i,
              harmony.length,
              Math.min(dimensions.width, dimensions.height) * 0.3
            )
          )}

        <AnimatePresence>
          {selectedHarmony && (
            <>
              {/* Connection Lines */}
              {[
                ...selectedHarmony.complementary,
                ...selectedHarmony.contrasting,
              ].map((note) => {
                const startPosition = calculatePosition(
                  harmony.findIndex(
                    (h) => h.primary.name === selectedHarmony.primary.name
                  ),
                  harmony.length,
                  Math.min(dimensions.width, dimensions.height) * 0.3
                );
                const endPosition = calculatePosition(
                  harmony.findIndex((h) => h.primary.name === note.name),
                  harmony.length,
                  Math.min(dimensions.width, dimensions.height) * 0.3
                );

                return (
                  <motion.line
                    key={`${selectedHarmony.primary.name}-${note.name}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    x1={startPosition.x}
                    y1={startPosition.y}
                    x2={endPosition.x}
                    y2={endPosition.y}
                    stroke={note.family.color}
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    className="absolute left-0 top-0"
                    style={{
                      zIndex: -1,
                    }}
                  />
                );
              })}

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-x-4 bottom-4 rounded-lg border bg-background/95 p-4 backdrop-blur-sm"
              >
                <div className="mb-2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{
                        backgroundColor: selectedHarmony.primary.family.color,
                      }}
                    />
                    <h4 className="font-medium">
                      {selectedHarmony.primary.name}
                    </h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHarmony(null)}
                  >
                    <X />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Complementary Notes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedHarmony.complementary.map((note) => (
                        <span
                          key={note.name}
                          className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: `${note.family.color}20`,
                            color: note.family.color,
                          }}
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Contrasting Notes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedHarmony.contrasting.map((note) => (
                        <span
                          key={note.name}
                          className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: `${note.family.color}20`,
                            color: note.family.color,
                          }}
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
