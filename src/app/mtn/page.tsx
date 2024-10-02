'use client'
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import Papa from "papaparse";

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement);

const Maintenance = () => {
  const [data, setData] = useState([]);

  // Fetch and parse CSV data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/distance_sum.csv"); // Adjust the path as needed
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvContent = decoder.decode(result.value);

      Papa.parse(csvContent, {
        header: true,
        complete: (result) => {
          setData(result.data);
        },
      });
    };

    fetchData();
  }, []);

  // Prepare data for the bar chart
  const chartData = {
    labels: data.map((item) => item.id), // Assuming 'id' column exists in the CSV
    datasets: [
      {
        label: "Total Distance",
        data: data.map((item) => parseFloat(item.distance)), // Assuming 'distance' column exists
        backgroundColor: data.map((item) =>
          parseFloat(item.distance) > 50000 ? "red" : "green"
        ),
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="mb-4">Total Distance by Truck</h2>
      {data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Maintenance;
