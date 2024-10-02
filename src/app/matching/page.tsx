"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import dayjs from "dayjs"; // For date/time manipulation
import isBetween from "dayjs/plugin/isBetween"; // Import the isBetween plugin

dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin

const Matching = () => {
  const [data, setData] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [matches, setMatches] = useState<{ customer: any; csvRow: any; distance: string; }[]>([]);

  // Fetch customer.json
  useEffect(() => {
    fetch("/customer.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fetch and parse CSV data
  async function fetchCSV() {
    const response = await fetch("/processed_results_with_original.csv");
    if (!response.body) {
      throw new Error("Response body is null");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = await reader.read();
    let csv = decoder.decode(result.value);

    Papa.parse(csv, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (error: any) => console.error("Error parsing CSV:", error),
    });
  }

  useEffect(() => {
    fetchCSV();
  }, []);

  // Calculate the Haversine distance in kilometers
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRadians = (degree: number) => degree * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const rLat1 = toRadians(lat1);
    const rLat2 = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(rLat1) * Math.cos(rLat2);
    const rad = 6371; // Radius of the Earth in kilometers
    const c = 2 * Math.asin(Math.sqrt(a));

    return rad * c;
  }

  // Check for matching data based on ±10 minutes and within 500 meters
  useEffect(() => {
    if (data && csvData) {
      const tempMatches: ((prevState: never[]) => never[]) | { customer: any; csvRow: any; distance: string; }[] = [];

      data.forEach((customer) => {
        csvData.forEach((csvRow) => {
          const csvTime = dayjs(csvRow.pickup_time); // Convert CSV time to dayjs object
          const customerTime = dayjs(customer.pickup_time, "D/M/YYYY H:mm"); // Convert customer time to dayjs object

          // Ensure both times are valid dayjs objects
          if (csvTime.isValid() && customerTime.isValid()) {
            // Check if time is within ±10 minutes
            if (
              csvTime.isBetween(
                customerTime.subtract(10, "minute"),
                customerTime.add(10, "minute")
              )
            ) {
              // Calculate the distance between customer's start and CSV's end points
              const distance = calculateDistance(
                customer.start_lat,
                customer.start_lng,
                csvRow.end_lat, // End latitude from CSV
                csvRow.end_lng // End longitude from CSV
              );

              // Check if the distance is less than or equal to 10 km and not already in matches
              if (distance <= 10) {
                const existingMatch = tempMatches.find(
                  (match) =>
                    match.customer.pickup_time === customer.pickup_time &&
                    match.distance === distance.toFixed(3)
                );

                if (!existingMatch) {
                  tempMatches.push({
                    customer: customer,
                    csvRow: csvRow,
                    distance: distance.toFixed(3), // Round the distance to 3 decimal places
                  });
                }
              }
            }
          } else {
            console.error("Invalid date format in customer or CSV data");
          }
        });
      });

      setMatches(tempMatches);
    }
  }, [data, csvData]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {matches.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Matching Deliveries:
          </h2>
          <ul className="space-y-4">
            {matches.map((match, index) => (
              <li key={index} className="border-b border-gray-200 pb-2">
                <p className="text-gray-700">
                  <strong>Customer Pickup:</strong> {match.customer.pickup_time}
                </p>
                <p className="text-gray-700">
                  <strong>CSV Pickup:</strong> {match.csvRow.pickup_time}
                </p>
                <p className="text-gray-600">
                  <strong>Distance:</strong> {match.distance} km
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">No matches found or still loading...</p>
      )}
    </div>
  );
};

export default Matching;
