"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { TimelinePoint, Note } from "@/lib/types/fragrance";
import { cn } from "@/lib/utils";

interface ScentJourneyProps {
  timeline: TimelinePoint[];
  notes: {
    top: Note[];
    middle: Note[];
    base: Note[];
  };
}

export function ScentJourney({ timeline, notes }: ScentJourneyProps) {
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const allNotes = useMemo(
    () => ({
      ...notes.top.reduce((acc, note) => ({ ...acc, [note.name]: note }), {}),
      ...notes.middle.reduce(
        (acc, note) => ({ ...acc, [note.name]: note }),
        {}
      ),
      ...notes.base.reduce((acc, note) => ({ ...acc, [note.name]: note }), {}),
    }),
    [notes]
  );

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= timeline[timeline.length - 1].time) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, timeline]);

  const currentPoint = useMemo(() => {
    return timeline.find((point, index) => {
      const nextPoint = timeline[index + 1];
      return (
        point.time <= currentTime &&
        (!nextPoint || nextPoint.time > currentTime)
      );
    });
  }, [currentTime, timeline]);

  return (
    <Card className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scent Journey</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-sm text-primary transition-colors hover:text-primary/80"
        >
          {isPlaying ? "Pause" : "Play"} Journey
        </button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline}>
            <defs>
              <linearGradient
                id="intensityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={(value) =>
                `${Math.floor(value / 60)}h ${value % 60}m`
              }
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload as TimelinePoint;
                  return (
                    <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
                      <p className="font-medium">
                        {Math.floor(point.time / 60)}h {point.time % 60}m
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Intensity: {point.intensity}%
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Active Notes:</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {point.activeNotes.map((noteName) => {
                            const note = allNotes[noteName];
                            return (
                              <span
                                key={noteName}
                                className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                                style={{
                                  backgroundColor: `${note.color}20`,
                                  color: note.color,
                                }}
                              >
                                {noteName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="hsl(var(--primary))"
              fill="url(#intensityGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <AnimatePresence>
        {currentPoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Phase:</span>
              <span className="font-medium capitalize">
                {currentPoint.phase} Notes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {currentPoint.activeNotes.map((noteName) => {
                const note = allNotes[noteName];
                return (
                  <div
                    key={noteName}
                    className={cn(
                      "p-3 rounded-lg transition-colors",
                      "border border-transparent hover:border-primary"
                    )}
                    style={{
                      backgroundColor: `${note.color}10`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: note.color }}
                      />
                      <span className="font-medium">{noteName}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {note.family}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
