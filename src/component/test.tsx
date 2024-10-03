"use client"; 
import { findNearbyPetrolStations } from "@/libs/gasStation";
import { useState, useEffect } from "react";
import '../app/globals.css';
import Image from "next/image";

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
      <div className="flex flex-col items-center justify-center mb-10">
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
    <div className="m-4">
      <h2 className="text-2xl font-bold m-4 text-black">Nearby Petrol Stations</h2>
      <div className="flex flex-wrap m-4 gap-4">
        {topStations.length > 0 ? (
          topStations.map((station, index) => (
            <div key={index} className="flex text-center justify-between items-center w-64 px-4 py-2 border border-gray-300 roundlg text-black">
              <div className="flex gap-2 justify-center items-center">
                {station.name[0].toLowerCase() === "u" ? <Image src="/gas-station.png" alt="Gas Station Logo" width={30} height={40}/> : null}
                {station.name[0].toLowerCase() === "p" ? <Image src="/ptt.png" alt="PTT Logo" width={30} height={40}/> : null}
                {station.name[0].toLowerCase() === "ป" ? <Image src="/ptt.png" alt="PTT Logo" width={30} height={40}/> : null}
                {station.name[0].toLowerCase() === "c" ? <Image src="/caltex.jpeg" alt="Caltex Logo" width={30} height={30}/> : null}
                {station.name[0].toLowerCase() === "e" ? <Image src="/esso.png" alt="Esso Logo" width={40} height={30}/> : null}
                {station.name[0].toLowerCase() === "ส" ? <Image src="/siamgas.png" alt="Siam Gas Logo" width={36} height={40}/> : null}
                <h3 className="font-semibold">{station.name}</h3>
              </div>
              <div className="flex justify-center items-center w-10 h-10 bg-neutral-700 rounded-full">
                <p className="text-white">{station.count}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No petrol stations available.</p>
        )}
      </div>
      <div className="flex flex-col flex-wrap gap-1">
        {stations.length > 0 ? (
          stations.map((station, index) => (
            <div key={index} className="bg-white p-4 shadow-md">
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
