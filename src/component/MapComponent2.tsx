"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fix Leaflet's default icon issue with Next.js
L.Icon.Default.prototype.options.iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
L.Icon.Default.prototype.options.iconUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
L.Icon.Default.prototype.options.shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

interface MapComponentProps {
  data: { Latitude: string; Longitude: string; Rank: string; Count_Taxi: string }[];  // Adjust to match CSV structure
}

const MapComponent = ({ data }: MapComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only mount on client-side
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering on server-side
  }

  // Helper function to validate and parse Latitude/Longitude
  const isValidLatLng = (lat: number, lng: number) => {
    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // Default center to the first valid point, or Bangkok if no valid data
  const firstValidPoint = data.find(
    (point) => isValidLatLng(parseFloat(point.Latitude), parseFloat(point.Longitude))
  );
  const defaultCenter: [number, number] = firstValidPoint
    ? [parseFloat(firstValidPoint.Latitude), parseFloat(firstValidPoint.Longitude)]
    : [13.750598, 100.531536]; // Bangkok coordinates as default

  return (
    <div className="m-10">
      <div className="button-group flex flex-wrap my-2">
        <input
          type="button"
          value="⛽️  Petrol Station"
          className="rounded-button"
        />
        <input
          type="button"
          value="🧶  Fabric Factory"
          className="rounded-button"
        />
        <input
          type="button"
          value="⚓️  Metal Factory"
          className="rounded-button"
        />
        <input
          type="button"
          value="🍴  Restaurant"
          className="rounded-button"
        />
      </div>
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map through all CSV data and create circles for valid points */}
        {data.map((point, index) => {
          const lat = parseFloat(point.Latitude);
          const lng = parseFloat(point.Longitude);

          if (isValidLatLng(lat, lng)) {
            return (
              <Circle
                key={index}
                center={[lat, lng]}
                radius={1000} // 150 meters radius
                pathOptions={{ color: "blue" }}
              >
                <Popup>
                  <div>
                    <strong>Rank: {point.Rank}</strong>
                    <br />
                    Count Trucks: {point.Count_Taxi}
                    <br />
                    Latitude: {lat}, Longitude: {lng}
                  </div>
                </Popup>
              </Circle>
            );
          } else {
            console.warn(`Invalid LatLng at index ${index}: (${lat}, ${lng})`);
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
