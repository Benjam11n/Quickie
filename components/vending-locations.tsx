"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { vendingLocations } from "@/lib/data";

export function VendingLocations() {
  const featuredLocations = vendingLocations.slice(0, 3);

  const handleNavigate = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <section className="container">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Find Us Nearby
        </h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Our vending machines are conveniently located throughout the city.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {featuredLocations.map((location) => (
          <Card
            key={location.id}
            className="p-6 hover-lift gradient-border relative overflow-hidden group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{location.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {location.address}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    handleNavigate(
                      location.coordinates.lat,
                      location.coordinates.lng
                    )
                  }
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{location.hours}</span>
                <span>{location.stockLevel} fragrances available</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild size="lg" className="glow-effect">
          <Link href="/locations">
            <MapPin className="mr-2 h-5 w-5" />
            View All Locations
          </Link>
        </Button>
      </div>
    </section>
  );
}
