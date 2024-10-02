"use client";
import dynamic from "next/dynamic";
import Papa from "papaparse"; // For parsing CSV
import { useState, useEffect } from "react";
import Yoyo from "@/component/test"; // Adjust the path to Yoyo if needed

const MapComponent = dynamic(() => import("@/component/MapComponent2"), {
  ssr: false, // Ensure it only renders on the client
});

export default function TestPage() {
  interface CsvRow {
    Latitude: string;
    Longitude: string;
    Rank: string;
    Count_Taxi: string;
  }

  const [csvData, setCsvData] = useState<CsvRow[]>([]); // Store CSV data as an array

  // Fetch the CSV file and parse it using PapaParse
  useEffect(() => {
    const fetchCSV = async () => {
      const response = await fetch("/trucks_clusters.csv"); // Fetch from public folder
      if (!response.body) {
        throw new Error("Response body is null");
      }
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvContent = decoder.decode(result.value);

      Papa.parse(csvContent, {
        header: true, // Assumes the CSV has a header
        complete: (result: { data: any }) => {
          const data = result.data;
          setCsvData(data); // Store parsed CSV data
        },
      });
    };

    fetchCSV();
  }, []);

  // Prepare the coordinates array from CSV data
  const coordinates = csvData
    .map((row) => ({
      latitude: parseFloat(row.Latitude),
      longitude: parseFloat(row.Longitude),
    }))
    .filter((coord) => !isNaN(coord.latitude) && !isNaN(coord.longitude)); // Filter out invalid coordinates

  return (
    <div>
      {csvData.length > 0 && (
        <>
          {/* Pass all CSV data to MapComponent */}
          <MapComponent data={csvData} />

          {/* Buttons to fetch different types of places */}
          <div className="button-group m-10">
          <input 
            type='button' 
            value='Petrol Station' 
            // onClick={() => handleFetchPlaces('petrol_station')} 
            className="rounded-button"
          />
          <input 
            type='button' 
            value='Fabric Factory' 
            // onClick={() => handleFetchPlaces('fabric_factory')} 
            className="rounded-button"
          />
          <input 
            type='button' 
            value='Metal Factory' 
            // onClick={() => handleFetchPlaces('metal_factory')} 
            className="rounded-button"
          />
        </div>

          {/* Pass the coordinates array to Yoyo */}
          <Yoyo coordinates={coordinates} />
        </>
      )}
    </div>
  );
}
