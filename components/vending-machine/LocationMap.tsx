'use client';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { VendingMachineView } from '@/types';

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
  locations: VendingMachineView[];
  selectedLocation: string | null;
  onLocationSelect: (id: string) => void;
}

function MapController({
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
      const location = locations.find((loc) => loc.id === selectedLocation);
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

export function LocationMap({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) {
  return (
    <MapContainer
      center={[1.3521, 103.8198]}
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
          key={location._id}
          position={[
            location.location.coordinates[1],
            location.location.coordinates[0],
          ]}
          icon={icon}
          eventHandlers={{
            click: () => onLocationSelect(location.id),
          }}
        >
          <Popup>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="font-semibold">{location.location.address}</h3>
                <p className="text-sm text-muted-foreground">
                  {location.location.address}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Fragrances:</h4>
                {location.inventory.map((item) => {
                  const product = item.perfumeId;

                  if (!product) return null;

                  return (
                    <div
                      key={item.perfumeId._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand.name}
                        </p>
                      </div>
                      <Badge variant={item.stock > 3 ? 'default' : 'secondary'}>
                        {item.stock} left
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
