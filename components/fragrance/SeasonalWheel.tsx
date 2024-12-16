'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Season, Weather } from '@/types/enums';
import { SeasonalRating } from '@/types/fragrance';

interface SeasonalWheelProps {
  seasonal: SeasonalRating[];
}

const COLORS = {
  [Season.Spring]: '#10B981',
  [Season.Summer]: '#F59E0B',
  [Season.Fall]: '#B45309',
  [Season.Winter]: '#60A5FA',
};

export function SeasonalWheel({ seasonal }: SeasonalWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedSeason, setSelectedSeason] = useState<SeasonalRating | null>(
    null
  );
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const radius = Math.min(dimensions.width, dimensions.height) / 2 - 40;
  const center = { x: dimensions.width / 2, y: dimensions.height / 2 };

  const getSeasonPath = (season: Season, rating: number) => {
    const index = Object.values(Season).indexOf(season);
    const startAngle = (index * Math.PI) / 2;
    const endAngle = ((index + 1) * Math.PI) / 2;
    const intensity = rating / 100;

    const x1 = center.x + Math.cos(startAngle) * radius * intensity;
    const y1 = center.y + Math.sin(startAngle) * radius * intensity;
    const x2 = center.x + Math.cos(endAngle) * radius * intensity;
    const y2 = center.y + Math.sin(endAngle) * radius * intensity;

    return `M ${center.x} ${center.y} L ${x1} ${y1} A ${radius * intensity} ${
      radius * intensity
    } 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <Card className="flex h-full flex-col space-y-6 p-6">
      <h3 className="text-lg font-semibold">Seasonal Compatibility</h3>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="aspect-square w-full"
          >
            {seasonal.map(({ season, rating }) => (
              <motion.path
                key={season}
                d={getSeasonPath(season as Season, rating)}
                fill={COLORS[season as Season]}
                opacity={0.2}
                strokeWidth={2}
                stroke={COLORS[season as Season]}
                whileHover={{ opacity: 0.4 }}
                onClick={() =>
                  setSelectedSeason(
                    seasonal.find((s) => s.season === season) || null
                  )
                }
                className="cursor-pointer"
              />
            ))}

            {/* Season Labels */}
            {Object.values(Season).map((season, index) => {
              const angle = (index * Math.PI) / 2;
              const x = center.x + Math.cos(angle) * (radius + 20);
              const y = center.y + Math.sin(angle) * (radius + 20);

              return (
                <text
                  key={season}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current text-sm font-medium"
                >
                  {season}
                </text>
              );
            })}
          </svg>

          {selectedSeason && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-x-4 bottom-4 rounded-lg border bg-background/95 p-4 backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedSeason.season}</h4>
                  <span className="text-sm text-muted-foreground">
                    {selectedSeason.rating}% Compatible
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Best Times</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeason.timeOfDay.map((time) => (
                      <Badge key={time} variant="secondary">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ideal Conditions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeason.conditions.map((condition) => (
                      <Badge
                        key={condition}
                        variant="outline"
                        className={cn(
                          'bg-background/50 backdrop-blur-sm',
                          condition === Weather.Hot && 'text-orange-500',
                          condition === Weather.Cold && 'text-blue-500',
                          condition === Weather.Rainy && 'text-indigo-500',
                          condition === Weather.Sunny && 'text-yellow-500'
                        )}
                      >
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
