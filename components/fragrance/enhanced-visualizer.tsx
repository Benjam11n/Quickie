import { EnhancedFragrance } from "@/lib/types/fragrance";
import { ScentJourney } from "./scent-journey";
import { NoteHarmonyVisualizer } from "./note-harmony";
import { SeasonalWheel } from "./seasonal-wheel";
import { MoodVisualizer } from "./mood-visualizer";

interface EnhancedVisualizerProps {
  fragrance: EnhancedFragrance;
}

export function EnhancedVisualizer({ fragrance }: EnhancedVisualizerProps) {
  return (
    <div className="space-y-8">
      <ScentJourney timeline={fragrance.timeline} notes={fragrance.notes} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NoteHarmonyVisualizer harmony={fragrance.harmony} />
        <SeasonalWheel seasonal={fragrance.seasonal} />
      </div>

      <MoodVisualizer characteristics={fragrance.characteristics} />
    </div>
  );
}
