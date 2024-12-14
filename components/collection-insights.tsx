import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface InsightsProps {
  insights: {
    categories: Record<string, number>;
    notes: Record<string, number>;
    brands: Record<string, number>;
    totalRating: number;
    ratedCount: number;
  };
}

export function CollectionInsights({ insights }: InsightsProps) {
  // Calculate percentages for categories
  const totalCategories = Object.values(insights.categories).reduce(
    (a, b) => a + b,
    0
  );
  const categoryPercentages = Object.entries(insights.categories)
    .map(([name, count]) => ({
      name,
      percentage: (count / totalCategories) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

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
    <Card className="p-6 space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-6">Collection Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Top Categories
            </h4>
            <div className="space-y-4">
              {categoryPercentages.map(({ name, percentage }) => (
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
            <h4 className="font-medium text-sm text-muted-foreground">
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
            <h4 className="font-medium text-sm text-muted-foreground">
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
            <h4 className="font-medium text-sm text-muted-foreground">
              Rating Overview
            </h4>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
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
