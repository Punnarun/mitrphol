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
    const [expandedCard, setExpandedCard] = useState<number | null>(null); // State to track expanded card

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
        const dLon = toRadians(lon1 - lon2);

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
            const tempMatches: { customer: any; csvRow: any; distance: string; }[] = [];

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

    // Function to check if a customer has a match
    const hasMatch = (customer: any) => {
        return matches.some(match => match.customer.pickup_time === customer.pickup_time);
    };

    // Function to toggle the expanded state of a card
    const toggleCard = (index: number) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            {data.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-full h-full max-w-7xl overflow-auto">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Customer Deliveries:
                    </h2>
                    <div className="flex flex-wrap -mx-2">
                        {data.map((customer, index) => (
                            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                <div
                                    className={`bg-white border border-gray-200 rounded-lg shadow p-4 cursor-pointer transition-transform duration-300 ${expandedCard === index ? 'transform scale-105' : ''}`}
                                    onClick={() => toggleCard(index)}
                                >
                                    <p className="text-gray-700">
                                        <strong>Customer Pickup:  </strong> {customer.pickup_time}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Start Location:  </strong> {customer.start_lat}, {customer.start_lng}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Match:</strong> 
                                        <span className={`px-2 py-1 rounded ${hasMatch(customer) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {hasMatch(customer) ? "Yes" : "No"}
                                        </span>
                                    </p>
                                    {expandedCard === index && (
                                        <div className="mt-4">
                                            <p className="text-gray-700">
                                                <strong>Additional Details:</strong>
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>End Location:  </strong> {customer.end_lat}, {customer.end_lng}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Distance:  </strong> {matches.find(match => match.customer.pickup_time === customer.pickup_time)?.distance} km
                                            </p>
                                            {/* Add more details as needed */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">No customer data found or still loading...</p>
            )}
        </div>
    );
};

export default Matching;
