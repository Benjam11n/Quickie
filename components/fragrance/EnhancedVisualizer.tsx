import { EnhancedFragrance } from '@/types/fragrance';

import { NoteHarmonyVisualizer } from './NoteHarmonyVisualizer';
import { ScentJourney } from './ScentJourney';
import { ScentProfile } from './ScentProfile';
import { SeasonalWheel } from './SeasonalWheel';

interface EnhancedVisualizerProps {
  fragrance: EnhancedFragrance;
}

export function EnhancedVisualizer({ fragrance }: EnhancedVisualizerProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Scent Journey - Full width */}
      <div className="lg:col-span-12">
        <ScentJourney timeline={fragrance.timeline} notes={fragrance.notes} />
      </div>

      {/* Left Column - Note Harmony */}
      <div className="lg:col-span-4">
        <NoteHarmonyVisualizer harmony={fragrance.harmony} />
      </div>

      {/* Middle Column - Radar Chart */}
      <div className="lg:col-span-4">
        <ScentProfile scentProfile={fragrance.scentProfile} />
      </div>

      {/* Right Column - Seasonal Wheel */}
      <div className="lg:col-span-4">
        <SeasonalWheel seasonal={fragrance.seasonal} />
      </div>
    </div>
  );
}
