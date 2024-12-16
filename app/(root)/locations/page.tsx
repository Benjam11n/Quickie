'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import { LocationCard } from '@/components/location/LocationCard';
import { LocationMap } from '@/components/location/LocationMap';
import { Input } from '@/components/ui/input';
import { vendingLocations } from '@/types/data';

export default function LocationsPage() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredLocations = vendingLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Find Your Fix
            </span>
          </h1>
          <p className="text-muted-foreground">
            Locate our vending machines for instant gratification.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="order-2 space-y-4 lg:order-1 lg:col-span-4">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation === location.id}
                onSelect={() => setSelectedLocation(location.id)}
              />
            ))}
          </div>

          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border">
              <LocationMap
                locations={filteredLocations}
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
