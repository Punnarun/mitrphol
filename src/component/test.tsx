"use client"; 
import { findNearbyPetrolStations } from "@/libs/gasStation";
import { useState, useEffect } from "react";
import '../app/globals.css';

interface YoyoProps {
  coordinates: { latitude: number; longitude: number }[]; // Expecting an array of coordinates
}

interface PetrolStation {
  name: string;
  lat: number;
  lon: number;
}

const Yoyo = ({ coordinates }: YoyoProps) => {
  const [stations, setStations] = useState<PetrolStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchCount, setFetchCount] = useState(0); // Track the number of fetched stations

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const allStations = [];
        for (const { latitude, longitude } of coordinates) {
          const nearbyStations = await findNearbyPetrolStations(longitude, latitude);
          allStations.push(...nearbyStations);
          setFetchCount(prev => prev + 1); // Increment fetch count after each fetch
        }
        setStations(allStations);
      } catch (err) {
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [coordinates]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img
          src="/truck.gif"  // Replace with your actual GIF path
          alt="Loading GIF"
          className="w-32 h-32 mb-4 rounded-xl"    // Adjust size as needed, and add margin
        />
        <div className="text-lg font-semibold text-gray-700">Fetching Data</div>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  // Group by station name and get top 5
  const groupedStations = stations.reduce((acc, station) => {
    if (!acc[station.name]) {
      acc[station.name] = [];
    }
    acc[station.name].push(station);
    return acc;
  }, {} as Record<string, PetrolStation[]>);

  const topStations = Object.keys(groupedStations)
    .slice(0, 5)
    .map(name => ({
      name,
      count: groupedStations[name].length,
    }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Nearby Petrol Stations</h2>
      <div className="flex flex-wrap justify-between bg-white p-4 rounded-lg shadow-md mb-4 border border-black">
        {topStations.length > 0 ? (
          topStations.map((station, index) => (
            <div key={index} className="flex-1 text-center p-2 border border-gray-300 m-2 rounded-lg bg-[#fdbd1f] text-black">
              <h3 className="font-semibold">{station.name}</h3>
              <p className="text-gray-700">Count: {station.count}</p>
            </div>
          ))
        ) : (
          <p>No petrol stations available.</p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {stations.length > 0 ? (
          stations.map((station, index) => (
            <div key={index} className="bg-[#fdbd1f] p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-black">{station.name}</h3>
              <p className="text-gray-700">
                Location: {station.lat}, {station.lon}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No petrol stations found within 2000 meters.</p>
        )}
      </div>
    </div>
  );
};

export default Yoyo;
