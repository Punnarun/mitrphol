"use client";
import { findNearbyPetrolStations } from "@/libs/gasStation";
import { useState, useEffect } from "react";
import "../app/globals.css";

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
  const [error, setError] = useState<string | null>(null);

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

  // Function to group stations by name and count occurrences
  const groupByStationName = (stations: PetrolStation[]) => {
    const stationMap: { [key: string]: { count: number; station: PetrolStation } } = {};
    
    stations.forEach(station => {
      if (stationMap[station.name]) {
        stationMap[station.name].count += 1;
      } else {
        stationMap[station.name] = { count: 1, station };
      }
    });

    // Convert the map to an array and sort by count (descending)
    return Object.values(stationMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5
  };

  const top5Stations = groupByStationName(stations);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <img
          src="/truck.gif" // Replace with your actual GIF path
          alt="Loading GIF"
          className="w-32 h-32 mb-4"
        />
        <div className="text-lg font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-4 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-[#010101]">
        Top 5 Popular Petrol Stations
      </h2>
      <div className="flex flex-col gap-4 mb-8">
        {top5Stations.length > 0 ? (
          top5Stations.map((item, index) => (
            <div
              key={index}
              className="bg-[#fdbd1e] text-[#010101] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold">{item.station.name}</h3>
              <p className="text-gray-700">
                Location: {item.station.lat}, {item.station.lon}
              </p>
              <p className="text-sm text-gray-600">
                Occurrences: {item.count}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No petrol stations found within 100 meters.</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-[#010101]">
        Nearby Petrol Stations
      </h2>
      <div className="flex flex-col gap-4">
        {stations.length > 0 ? (
          stations.map((station, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#fdbd1e] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-[#010101]">
                {station.name}
              </h3>
              <p className="text-gray-700">
                Location: {station.lat}, {station.lon}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No petrol stations found within 100 meters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Yoyo;
