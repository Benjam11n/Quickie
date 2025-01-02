'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LocationCard } from '@/components/vending-machine/LocationCard';
import { LocationMap } from '@/components/vending-machine/LocationMap';
import { VendingMachineView } from '@/types';

interface VendingMachineClientProps {
  vendingMachines: VendingMachineView[];
}

export default function VendingMachineClient({
  vendingMachines,
}: VendingMachineClientProps) {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position),
        (error) => console.error('Error getting location:', error)
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('lat', userLocation.coords.latitude.toString());
      searchParams.set('lng', userLocation.coords.longitude.toString());
      router.push(`${window.location.pathname}?${searchParams.toString()}`);
    }
  }, [userLocation, router]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="order-2 space-y-4 lg:order-1 lg:col-span-4">
        <div className="rounded-md bg-background/95 p-2 shadow-md">
          {userLocation ? (
            <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
              <span className="inline-block size-2 animate-pulse rounded-full bg-green-500"></span>
              Using your location • Results shown by proximity
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-yellow-500"></span>
              Location access required for proximity search
            </div>
          )}
        </div>

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
            vendingMachines={vendingMachines}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
}
