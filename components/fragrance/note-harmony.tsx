"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { NoteHarmony, Note } from "@/lib/types/fragrance";
import { cn } from "@/lib/utils";

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
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
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
    const isSelected = selectedHarmony?.primary.name === note.name;

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
          "absolute w-20 h-20 rounded-full flex items-center justify-center",
          "cursor-pointer transition-shadow duration-300",
          "hover:shadow-lg hover:shadow-primary/20"
        )}
        style={{
          backgroundColor: `${note.color}20`,
          border: `2px solid ${note.color}`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={() =>
          setSelectedHarmony(
            harmony.find((h) => h.primary.name === note.name) || null
          )
        }
      >
        <div className="text-center">
          <div className="font-medium text-sm">{note.name}</div>
          <div className="text-xs text-muted-foreground">{note.family}</div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="p-6 space-y-6">
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
                    stroke={note.color}
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    className="absolute top-0 left-0"
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
                className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedHarmony.primary.color }}
                  />
                  <h4 className="font-medium">
                    {selectedHarmony.primary.name}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Complementary Notes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedHarmony.complementary.map((note) => (
                        <span
                          key={note.name}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${note.color}20`,
                            color: note.color,
                          }}
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Contrasting Notes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedHarmony.contrasting.map((note) => (
                        <span
                          key={note.name}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${note.color}20`,
                            color: note.color,
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
