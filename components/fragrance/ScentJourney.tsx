'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TimelinePoint, Note } from '@/types/fragrance';

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
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // Speed multiplier

  // Combine all notes into a single lookup object
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

  // Animation logic
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + playbackSpeed;
          const maxTime = timeline[timeline.length - 1].time;

          if (next >= maxTime) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    }
  }, [isPlaying, timeline, playbackSpeed]);

  // Find current timeline point
  const currentPoint = useMemo(() => {
    return timeline.find((point, index) => {
      const nextPoint = timeline[index + 1];
      return (
        point.time <= currentTime &&
        (!nextPoint || nextPoint.time > currentTime)
      );
    });
  }, [currentTime, timeline]);

  // Progress indicator for the chart
  const CustomDot = ({ cx, cy, payload }: any) => {
    if (payload.time === Math.floor(currentTime)) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="hsl(var(--primary))"
          stroke="white"
          strokeWidth={2}
        />
      );
    }
    return null;
  };

  // Handle play/pause
  const togglePlayback = () => {
    if (!isPlaying) {
      // If starting from the end, reset to beginning
      if (currentTime >= timeline[timeline.length - 1].time) {
        setCurrentTime(0);
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scent Journey</h3>
        <div className="flex items-center gap-4">
          <select
            className="rounded-md border bg-transparent px-2 py-1 text-sm"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
          <button
            onClick={togglePlayback}
            className="text-sm text-primary transition-colors hover:text-primary/80"
          >
            {isPlaying ? 'Pause' : 'Play'} Journey
          </button>
        </div>
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
              dot={<CustomDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-100"
          style={{
            width: `${(currentTime / timeline[timeline.length - 1].time) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
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
                      'rounded-lg p-3 transition-colors',
                      'border border-transparent hover:border-primary'
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
