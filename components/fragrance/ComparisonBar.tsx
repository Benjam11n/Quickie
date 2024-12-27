import { Button } from '../ui/button';

export default function ComparisonBar({
  selectedCount,
  onCompare,
}: {
  selectedCount: number;
  onCompare: () => void;
}) {
  return (
    <div className="sticky top-20 z-10 rounded-lg border bg-background/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedCount} selected for comparison
        </p>
        <Button onClick={onCompare} disabled={selectedCount < 2}>
          Compare Selected
        </Button>
      </div>
    </div>
  );
}
