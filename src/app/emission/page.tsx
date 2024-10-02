"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface TruckBrand {
  brand: string;
  fuel_consumption_per_km: number; // Liters per km
}

const truckData: TruckBrand[] = [
  { brand: 'Volvo Trucks', fuel_consumption_per_km: 0.4 },
  { brand: 'Freightliner', fuel_consumption_per_km: 0.45 },
  { brand: 'Scania', fuel_consumption_per_km: 0.42 },
  { brand: 'Mercedes-Benz', fuel_consumption_per_km: 0.38 },
  { brand: 'Kenworth', fuel_consumption_per_km: 0.43 },
  { brand: 'Peterbilt', fuel_consumption_per_km: 0.44 },
  { brand: 'Mack Trucks', fuel_consumption_per_km: 0.48 },
  { brand: 'MAN Trucks', fuel_consumption_per_km: 0.41 },
  { brand: 'DAF Trucks', fuel_consumption_per_km: 0.39 },
  { brand: 'Isuzu Trucks', fuel_consumption_per_km: 0.35 }
];

const FuelCostCalculator: React.FC = () => {
  const [startLat, setStartLat] = useState<number | null>(null);
  const [startLng, setStartLng] = useState<number | null>(null);
  const [endLat, setEndLat] = useState<number | null>(null);
  const [endLng, setEndLng] = useState<number | null>(null);
  const [truckBrand, setTruckBrand] = useState<string>('');
  const [oilPrice, setOilPrice] = useState<number | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const getOSRMDistance = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;
      const response = await axios.get(url);
      if (response.status === 200) {
        const data = response.data;
        const distance = data.routes[0].distance / 1000; // in km
        const duration = data.routes[0].duration / 3600; // in hours
        return { distance, duration };
      }
      return null;
    } catch (error) {
      console.error('Error fetching distance:', error);
      return null;
    }
  };

  const getFuelConsumptionPerKm = (brand: string) => {
    const truck = truckData.find((t) => t.brand.toLowerCase() === brand.toLowerCase());
    return truck ? truck.fuel_consumption_per_km : null;
  };

  const calculateFuelCost = (distance: number, fuelConsumption: number, oilPrice: number) => {
    const fuelUsed = distance * fuelConsumption;
    const totalCost = fuelUsed * oilPrice;
    const carbonEmission = fuelUsed * 2.68; // CO2 emission in kg
    return { fuelUsed, totalCost, carbonEmission };
  };

  const handleSubmit = async () => {
    if (startLat && startLng && endLat && endLng && truckBrand && oilPrice) {
      const osrmResult = await getOSRMDistance(startLat, startLng, endLat, endLng);
      console.log(osrmResult);
      if (osrmResult) {
        const { distance, duration } = osrmResult;
        const fuelConsumption = getFuelConsumptionPerKm(truckBrand);
        if (distance && duration && fuelConsumption !== null) {
          const { fuelUsed, totalCost, carbonEmission } = calculateFuelCost(distance, fuelConsumption, oilPrice);
          setResult({ distance, duration, fuelUsed, totalCost, carbonEmission });
        }
      }
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-center m-2 flex-wrap">
      <div className="w-1/2 h-full">
        <form
          className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="startLatitude">Start Latitude</Label>
            <Input
              className="px-2 py-1"
              id="startLatitude"
              type="number"
              value={startLat || ""}
              onChange={(e) => setStartLat(parseFloat(e.target.value))}
              placeholder="Enter start latitude"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startLongitude">Start Longitude</Label>
            <Input
              className="px-2 py-1"
              id="startLongitude"
              type="number"
              value={startLng || ""}
              onChange={(e) => setStartLng(parseFloat(e.target.value))}
              placeholder="Enter start longitude"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLatitude">End Latitude</Label>
            <Input
              className="px-2 py-1"
              id="endLatitude"
              type="number"
              value={endLat || ""}
              onChange={(e) => setEndLat(parseFloat(e.target.value))}
              placeholder="Enter end latitude"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLongitude">End Longitude</Label>
            <Input
              className="px-2 py-1"
              id="endLongitude"
              type="number"
              value={endLng || ""}
              onChange={(e) => setEndLng(parseFloat(e.target.value))}
              placeholder="Enter end longitude"
            />
          </div>
          <div className="space-y-2">
            <Label>Truck Brand</Label>
            <Select value={truckBrand} onValueChange={setTruckBrand}>
              <SelectTrigger className="w-full px-2 py-1">
                <SelectValue placeholder="Select a truck brand" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup className='p-2'>
                  <SelectLabel className='px-2 py-1.5'>Truck Brand</SelectLabel>
                  {truckData.map((truck) => (
                    <SelectItem key={truck.brand} value={truck.brand} className='px-4 py-2'>
                      {truck.brand}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Oil Price per Liter (บาท/ลิตร)</Label>
            <Input
              type="number"
              value={oilPrice || ""}
              onChange={(e) => setOilPrice(parseFloat(e.target.value))}
              placeholder="Enter oil price"
              className="px-2 py-1"
            />
          </div>
          <Button type="submit" className="w-full bg-black text-white px-2 py-1 rounded-md">
            Calculate
          </Button>
        </form>
      </div>

      {result && (
        <div className="w-full h-full space-y-6 max-w-lg mx-auto my-4 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Results:</h3>
          <p className="text-zinc-500">
            Distance: <span className="text-xl text-black">{result.distance.toFixed(1)}</span> km
          </p>
          <p className="text-zinc-500">
            Duration: <span className="text-xl text-black">{result.duration.toFixed(1)}</span> hours
          </p>
          <p className="text-zinc-500">
            Fuel Used: <span className="text-xl text-black">{result.fuelUsed.toFixed(1)}</span> liters
          </p>
          <p className="text-zinc-500">
            Total Fuel Cost: <span className="text-xl text-black">{result.totalCost.toFixed(1)}</span> baht
          </p>
          <p className="text-zinc-500">
            Carbon Emission: <span className="text-xl text-black">{result.carbonEmission.toFixed(1)}</span> kg CO2
          </p>
        </div>
      )}
    </div>
  );
};

export default FuelCostCalculator;
