'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { Product } from '@/types/fragrance';

interface CharacteristicsChartProps {
  products: Product[];
}

export function CharacteristicsChart({ products }: CharacteristicsChartProps) {
  const characteristics = [
    'intensity',
    'longevity',
    'sillage',
    'versatility',
    'uniqueness',
    'value',
  ];

  const data = characteristics.map((characteristic) => ({
    characteristic:
      characteristic.charAt(0).toUpperCase() + characteristic.slice(1),
    ...products.reduce(
      (acc, product, index) => ({
        ...acc,
        [`product${index + 1}`]:
          product.scentProfile[
            characteristic as keyof typeof product.scentProfile
          ],
      }),
      {}
    ),
  }));

  const colors = [
    { stroke: '#EC4899', fill: '#EC4899' },
    { stroke: '#8B5CF6', fill: '#8B5CF6' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
        <PolarAngleAxis
          dataKey="characteristic"
          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          strokeOpacity={0.2}
        />
        {/* <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          stroke="hsl(var(--muted-foreground))"
          strokeOpacity={0.2}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        /> */}

        {products.map((product, index) => (
          <Radar
            key={product.id}
            name={product.name}
            dataKey={`product${index + 1}`}
            stroke={colors[index].stroke}
            fill={colors[index].fill}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        ))}

        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
                  <p className="font-medium">{label}</p>
                  <div className="mt-2 space-y-1">
                    {payload.map((entry: any) => (
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
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
