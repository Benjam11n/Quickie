"use client";

import { Radar } from "recharts";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ScentProfileProps {
  profile: {
    intensity: number;
    longevity: number;
    sillage: number;
    versatility: number;
    uniqueness: number;
    value: number;
  };
}

export function ScentProfile({ profile }: ScentProfileProps) {
  const data = [
    { subject: "Intensity", value: profile.intensity },
    { subject: "Longevity", value: profile.longevity },
    { subject: "Sillage", value: profile.sillage },
    { subject: "Versatility", value: profile.versatility },
    { subject: "Uniqueness", value: profile.uniqueness },
    { subject: "Value", value: profile.value },
  ];

  return (
    <div className="w-full aspect-square">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.2}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.2}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.2}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Radar
            name="Scent Profile"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
