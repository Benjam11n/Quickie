'use client';

import L from 'leaflet';
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { VendingMachineView } from '@/types';

import MapController from './MapController';

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
  vendingMachines: VendingMachineView[];
  selectedLocation: string | null;
  onLocationSelect: (id: string) => void;
}

export function LocationMap({
  vendingMachines,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  const userMarkerIcon = useMemo(
    () =>
      L.divIcon({
        className: 'bg-red-500 rounded-full border-2 border-white w-8 h-8',
        iconSize: [24, 24],
      }),
    []
  );

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
        vendingMachines={vendingMachines}
        selectedLocation={selectedLocation}
      />
      {vendingMachines.map((vendingMachine) => (
        <Marker
          key={vendingMachine._id}
          position={[
            vendingMachine.location.coordinates[1],
            vendingMachine.location.coordinates[0],
          ]}
          icon={icon}
          eventHandlers={{
            click: () => onLocationSelect(vendingMachine._id),
          }}
        >
          <Popup>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {vendingMachine.location.address}
                </h3>
              </div>

              <div>
                <h4 className="text-sm font-semibold">Available Fragrances:</h4>
                {vendingMachine.inventory.map((item) => {
                  const product = item.perfume;

                  if (!product) return null;

                  return (
                    <div
                      key={item.perfume._id}
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
      {userPosition && (
        <Marker position={userPosition} icon={userMarkerIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
