import { EnhancedFragrance } from "@/lib/types/fragrance";

import { MoodVisualizer } from "./mood-visualizer";
import { NoteHarmonyVisualizer } from "./note-harmony";
import { ScentJourney } from "./scent-journey";
import { SeasonalWheel } from "./seasonal-wheel";

interface EnhancedVisualizerProps {
  fragrance: EnhancedFragrance;
}

export function EnhancedVisualizer({ fragrance }: EnhancedVisualizerProps) {
  return (
    <div className="space-y-8">
      <ScentJourney timeline={fragrance.timeline} notes={fragrance.notes} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <NoteHarmonyVisualizer harmony={fragrance.harmony} />
        <SeasonalWheel seasonal={fragrance.seasonal} />
      </div>

      <MoodVisualizer characteristics={fragrance.characteristics} />
    </div>
  );
}
