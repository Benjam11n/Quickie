'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { VendingLocation } from '@/lib/types';
import { products } from '@/lib/types/data';

// Fix for default marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationMapProps {
  locations: VendingLocation[];
  selectedLocation: string | null;
  onLocationSelect: (id: string) => void;
}

function MapController({
  locations,
  selectedLocation,
}: {
  locations: VendingLocation[];
  selectedLocation: string | null;
}) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.coordinates.lat, loc.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      initialized.current = true;
    }

    if (selectedLocation) {
      const location = locations.find((loc) => loc.id === selectedLocation);
      if (location) {
        map.setView([location.coordinates.lat, location.coordinates.lng], 16, {
          animate: true,
          duration: 1,
        });
      }
    }
  }, [map, locations, selectedLocation]);

  return null;
}

export function LocationMap({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[40.7128, -74.006]} // Default to NYC
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController
        locations={locations}
        selectedLocation={selectedLocation}
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.coordinates.lat, location.coordinates.lng]}
          icon={icon}
          eventHandlers={{
            click: () => onLocationSelect(location.id),
          }}
        >
          <Popup>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="font-semibold">{location.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {location.address}
                </p>
                <p className="mt-1 text-sm">{location.hours}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Fragrances:</h4>
                {location.availablePerfumes.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>
                      <Badge
                        variant={item.quantity > 3 ? 'default' : 'secondary'}
                      >
                        {item.quantity} left
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
