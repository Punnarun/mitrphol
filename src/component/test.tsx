"use client";
import { findNearbyPetrolStations } from "@/libs/gasStation";
import { useState, useEffect } from "react";

const Yoyo = ({ latitude, longitude }) => {
  const [stations, setStations] = useState([]);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stations.length > 0 ? (
          stations.map((station, index) => (
            <div key={index} className="font-bold">
              <h3 className="text-lg font-thin">{station.name}</h3>
              <p className="text-gray-600">
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
