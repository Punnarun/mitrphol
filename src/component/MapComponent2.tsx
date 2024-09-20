'use client'
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with Next.js
L.Icon.Default.prototype.options.iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
L.Icon.Default.prototype.options.iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
L.Icon.Default.prototype.options.shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

const MapComponent = ({ latitude, longitude }: MapComponentProps) => {
  const [isMounted, setIsMounted] = useState(false); // Track whether the component is mounted

  useEffect(() => {
    setIsMounted(true); // Set to true when the component is mounted
  }, []);

  if (!isMounted) {
    return null; // Return null during SSR
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Circle center={position} radius={100} pathOptions={{ color: 'red' }} />
      <Marker position={position}>
        <Popup>Latitude: {latitude}, Longitude: {longitude}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
