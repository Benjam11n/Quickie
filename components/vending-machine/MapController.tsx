'use client';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { VendingMachineView } from '@/types';

export default function MapController({
  vendingMachines,
  selectedLocation,
}: {
  vendingMachines: VendingMachineView[];
  selectedLocation: string | null;
}) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && vendingMachines.length > 0) {
      const bounds = L.latLngBounds(
        vendingMachines.map((loc) => [
          loc.location.coordinates[1],
          loc.location.coordinates[0],
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      initialized.current = true;
    }

    if (selectedLocation) {
      const location = vendingMachines.find(
        (loc) => loc._id === selectedLocation
      );
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
  }, [map, vendingMachines, selectedLocation]);

  return null;
}
