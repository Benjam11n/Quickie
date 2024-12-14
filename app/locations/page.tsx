"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationCard } from "@/components/location-card";
import { Search, MapPin } from "lucide-react";
import { vendingLocations } from "@/lib/data";
import "@/styles/map.css";
import dynamic from "next/dynamic";
import { LocationMap } from "@/components/location-map";

export default function LocationsPage() {
  const [search, setSearch] = useState("");
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
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
              Find Your Fix
            </span>
          </h1>
          <p className="text-muted-foreground">
            Locate our vending machines for instant gratification.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search locations..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation === location.id}
                onSelect={() => setSelectedLocation(location.id)}
              />
            ))}
          </div>

          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="aspect-[4/3] rounded-lg overflow-hidden border">
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
