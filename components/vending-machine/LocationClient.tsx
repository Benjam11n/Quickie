'use client';

import { useState } from 'react';

import { LocationCard } from '@/components/vending-machine/LocationCard';
import { LocationMap } from '@/components/vending-machine/LocationMap';
import { VendingMachineView } from '@/types';

import LocalSearch from '../search/LocalSearch';

interface LocationClientProps {
  vendingMachines: VendingMachineView[];
}

export default function LocationClient({
  vendingMachines,
}: LocationClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">Find Your Fix</span>
          </h1>
          <p className="text-muted-foreground">
            Locate our vending machines for instant gratification.
          </p>
        </div>

        <div className="relative">
          <LocalSearch
            route="/locations"
            placeholder="Search vending machines..."
            otherClasses="flex-1"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="order-2 space-y-4 lg:order-1 lg:col-span-4">
            {vendingMachines.map((vendingMachine) => (
              <LocationCard
                key={vendingMachine._id}
                vendingMachine={vendingMachine}
                isSelected={selectedLocation === vendingMachine._id}
                onSelect={() => setSelectedLocation(vendingMachine._id)}
              />
            ))}
          </div>

          <div className="z-0 order-1 lg:order-2 lg:col-span-8">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border">
              <LocationMap
                locations={vendingMachines}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
