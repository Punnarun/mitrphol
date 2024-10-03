"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import Papa from "papaparse";

Chart.register(CategoryScale, LinearScale, BarElement);

const Maintenance = () => {
  interface DataItem {
    id: string;
    distance: string;
  }

  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/distance_sum.csv");
      if (!response.body) throw new Error("Response body is null");
      const reader = response.body.getReader();
      const result = await reader.read();
      const csvContent = new TextDecoder("utf-8").decode(result.value);

      Papa.parse(csvContent, {
        header: true,
        complete: (result) => setData(result.data as DataItem[]),
      });
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map((item) => item.id),
    datasets: [
      {
        label: "Total Distance (> 50k)",
        data: data.map((item) => parseFloat(item.distance)),
        backgroundColor: data.map((item) =>
          parseFloat(item.distance) > 50000 ? "red" : "green"
        ),
      },
    ],
  };

  let sum = 0;

  const chartData2 = {
    labels: data.map((item) => item.id),
    datasets: [
      {
        label: "Total Distance (> 10k)",
        data: data.map((item) => sum += parseFloat(item.distance)),
        backgroundColor: data.map((item) =>
          parseFloat(item.distance) > 10000 ? "red" : "blue"
        ),
      },
    ],
  };

  const options = {
    scales: { y: { beginAtZero: true } },
    animation: { duration: 1000, easing: "easeInOutQuart" as const },
    layout: { padding: { left: 20, right: 20 } },
  };

  return (
    <div className="flex flex-col items-center">
      <div>{sum}</div>
      <h2 className="mb-4"></h2>
      {data.length > 0 ? (
        <>
          <div className="w-3/4 h-96 flex justify-center items-center mb-8">
          <div>Tire limit exceed</div>
            <Bar data={chartData} options={options} />
          </div>
          <div className="w-3/4 h-96 flex justify-center items-center">
          <div>Oil change limit</div>
            <Bar data={chartData2} options={options} />
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Maintenance;
