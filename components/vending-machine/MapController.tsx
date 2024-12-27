'use client';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { VendingMachineView } from '@/types';

export default function MapController({
  locations,
  selectedLocation,
}: {
  locations: VendingMachineView[];
  selectedLocation: string | null;
}) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [
          loc.location.coordinates[1],
          loc.location.coordinates[0],
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      initialized.current = true;
    }

    if (selectedLocation) {
      const location = locations.find((loc) => loc._id === selectedLocation);
      if (location) {
        map.setView(
          [location.location.coordinates[1], location.location.coordinates[0]],
          16,
          {
            animate: true,
            duration: 1,
          }
        );
      }
    }
  }, [map, locations, selectedLocation]);

  return null;
}
