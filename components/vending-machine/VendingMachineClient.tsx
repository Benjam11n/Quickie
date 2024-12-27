'use client';

import { useState } from 'react';

import { LocationCard } from '@/components/vending-machine/LocationCard';
import { LocationMap } from '@/components/vending-machine/LocationMap';
import { VendingMachineView } from '@/types';

interface VendingMachineClientProps {
  vendingMachines: VendingMachineView[];
}

export default function VendingMachineClient({
  vendingMachines,
}: VendingMachineClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="order-2 space-y-4 lg:order-1 lg:col-span-4">
        {vendingMachines?.map((vendingMachine) => (
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
            vendingMachines={vendingMachines}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
}
