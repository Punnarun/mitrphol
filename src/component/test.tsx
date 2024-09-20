"use client";
import { findNearbyPetrolStations } from "@/libs/gasStation";
import { useState, useEffect } from "react";
import '../app/globals.css';

interface YoyoProps {
  latitude: number;
  longitude: number;
}

interface PetrolStation {
  name: string;
  lat: number;
  lon: number;
}

const Yoyo = ({ latitude, longitude }: YoyoProps) => {
  const [stations, setStations] = useState<PetrolStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const nearbyStations = await findNearbyPetrolStations(
          latitude,
          longitude
        );
        setStations(nearbyStations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [latitude, longitude]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Nearby Petrol Stations</h2>
      <div className="flex flex-col gap-4">
        {stations.length > 0 ? (
          stations.map((station, index) => (
            <div key={index} className="bg-blue-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{station.name}</h3>
              <p className="text-gray-700">
                Location: {station.lat}, {station.lon}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No petrol stations found within 100 meters.</p>
        )}
      </div>
    </div>
  );
};

export default Yoyo;

// hello