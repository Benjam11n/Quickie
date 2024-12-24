import { Star } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface Insights {
  notes: Record<string, number>;
  brands: Record<string, number>;
  totalRating: number;
  ratedCount: number;
}
interface InsightsProps {
  insights: Insights;
}

export function CollectionInsights({ insights }: InsightsProps) {
  // Calculate top notes
  const totalNotes = Object.values(insights.notes).reduce((a, b) => a + b, 0);
  const topNotes = Object.entries(insights.notes)
    .map(([name, value]) => ({
      name,
      percentage: (value / totalNotes) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const averageRating =
    insights.ratedCount > 0 ? insights.totalRating / insights.ratedCount : 0;

  return (
    <Card className="space-y-8 p-6">
      <div>
        <h3 className="mb-6 text-xl font-bold">Collection Insights</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Dominant Notes
            </h4>
            <div className="space-y-4">
              {topNotes.map(({ name, percentage }) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} className="h-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Brand Distribution
            </h4>
            <div className="space-y-4">
              {Object.entries(insights.brands)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([brand, count]) => (
                  <div key={brand} className="flex justify-between text-sm">
                    <span>{brand}</span>
                    <span>{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Rating Overview
            </h4>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <Star className="size-6 fill-current text-yellow-500" />
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {insights.ratedCount} ratings
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
