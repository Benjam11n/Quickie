'use client';

import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { EMPTY_VENDING_MACHINES } from '@/constants/states';
import { VendingMachineView } from '@/types';

import DataRenderer from '../ui/DataRenderer';

function getVendingMachineName(address: string): string {
  // Get first part before comma
  const name = address.split(',')[0];
  return name;
}

interface FeaturedVendingLocationsProps {
  vendingMachines?: VendingMachineView[];
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

export function FeaturedVendingLocations({
  vendingMachines,
  success,
  error,
}: FeaturedVendingLocationsProps) {
  const handleNavigate = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <section className="container">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Find Us Nearby
        </h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground">
          Our vending machines are conveniently located throughout the city.
        </p>
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={vendingMachines}
        empty={EMPTY_VENDING_MACHINES}
        render={(vendingMachines) => (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {vendingMachines.map((location) => (
              <Card
                key={location._id}
                className="hover-lift group relative overflow-hidden p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {getVendingMachineName(location.location.address)}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 size-4" />
                        {location.location.address}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() =>
                        handleNavigate(
                          location.location.coordinates[1],
                          location.location.coordinates[0]
                        )
                      }
                    >
                      <Navigation className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{'24 hrs'}</span>
                    <span>
                      {location.inventory.length} fragrances available
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      />
      {/* <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredLocations.map((location) => (
          <Card
            key={location.id}
            className="hover-lift group relative overflow-hidden p-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{location.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 size-4" />
                    {location.address}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() =>
                    handleNavigate(
                      location.coordinates.lat,
                      location.coordinates.lng
                    )
                  }
                >
                  <Navigation className="size-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{location.hours}</span>
                <span>{location.stockLevel} fragrances available</span>
              </div>
            </div>
          </Card>
        ))}
      </div> */}

      <div className="text-center">
        <Button asChild size="lg">
          <Link href={ROUTES.LOCATIONS} prefetch>
            <MapPin className="mr-2 size-5" />
            View All Locations
          </Link>
        </Button>
      </div>
    </section>
  );
}
