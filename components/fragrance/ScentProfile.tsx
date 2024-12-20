'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ScentProfileProps {
  scentProfile: {
    intensity: number;
    longevity: number;
    sillage: number;
    versatility: number;
    uniqueness: number;
    value: number;
  };
}

export function ScentProfile({ scentProfile }: ScentProfileProps) {
  const data = [
    { subject: 'Intensity', value: scentProfile.intensity },
    { subject: 'Longevity', value: scentProfile.longevity },
    { subject: 'Sillage', value: scentProfile.sillage },
    { subject: 'Versatility', value: scentProfile.versatility },
    { subject: 'Uniqueness', value: scentProfile.uniqueness },
    { subject: 'Value', value: scentProfile.value },
  ];

  return (
    <div className="aspect-square size-full space-y-2 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Scent Profile</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.2}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.2}
          />
          <Radar
            name="Scent Profile"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
                    <p className="font-medium">{label}</p>
                    <div className="mt-2 space-y-1">
                      {payload.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>{entry.name}:</span>
                          <span className="font-medium">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
