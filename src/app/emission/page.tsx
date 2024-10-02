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
import { getRiskLevel } from '@/libs/getRiskLevel';
import { Badge } from '@/components/ui/badge';

interface TruckFuelConsumption {
    [key: string]: {
      min: number;
      max: number;
    };
  }
  
const fuelConsumption: TruckFuelConsumption = {
    "4ล้อ-คอก": {
        min: 0.08,
        max: 0.10,
    },
    "4ล้อ-จัมโบ้": {
        min: 0.08,
        max: 0.13,
    },
    "4ล้อ-ตู้ทึบ": {
        min: 0.08,
        max: 0.11,
    },
    "6ล้อ-เฮี๊ยบ": {
        min: 0.17,
        max: 0.25,
    },
    "6ล้อ-พื้นเรียบ": {
        min: 0.14,
        max: 0.20,
    },
    "6ล้อ-ตู้ทึบ": {
        min: 0.14,
        max: 0.20,
    },
    "6ล้อ-คอก": {
        min: 0.14,
        max: 0.20,
    },
    "10ล้อ-พ่วงเฮี๊ยบ": {
        min: 0.20,
        max: 0.33,
    },
    "10ล้อ-คอก(15 ตัน)": {
        min: 0.25,
        max: 0.33,
    },
    "10ล้อ-รถเฮี๊ยบ": {
        min: 0.20,
        max: 0.33,
    },
    "10ล้อ-ตู้ทึบ-พ่วง": {
        min: 0.25,
        max: 0.33,
    },
    "10ล้อ-ตู้ทึบ": {
        min: 0.17,
        max: 0.25,
    },
    "10ล้อ-คอก(16 ตัน)": {
        min: 0.25,
        max: 0.33,
    },
    "10ล้อ-คอก-พ่วง": {
        min: 0.20,
        max: 0.33,
    },
    "10ล้อ-พื้นเรียบ": {
        min: 0.17,
        max: 0.25,
    },
    "รถหัวลาก-พื้นเรียบ(30 ตัน)": {
        min: 0.25,
        max: 0.50,
    },
    "รถหัวลาก-พื้นเรียบ(32 ตัน)": {
        min: 0.25,
        max: 0.50,
    },
};

const TruckKey: { [key: string]: number } = {
    "4ล้อ-คอก": 0,
    "4ล้อ-จัมโบ้": 1,
    "4ล้อ-ตู้ทึบ": 2,
    "6ล้อ-เฮี๊ยบ": 3,
    "6ล้อ-พื้นเรียบ": 4,
    "6ล้อ-ตู้ทึบ": 5,
    "6ล้อ-คอก": 6,
    "10ล้อ-พ่วงเฮี๊ยบ": 7,
    "10ล้อ-คอก(15 ตัน)": 8,
    "10ล้อ-รถเฮี๊ยบ": 9,
    "10ล้อ-ตู้ทึบ-พ่วง": 10,
    "10ล้อ-ตู้ทึบ": 11,
    "10ล้อ-คอก(16 ตัน)": 12,
    "10ล้อ-คอก-พ่วง": 13,
    "10ล้อ-พื้นเรียบ": 14,
    "รถหัวลาก-พื้นเรียบ(30 ตัน)": 15,
    "รถหัวลาก-พื้นเรียบ(32 ตัน)": 16,
};

interface ProductType {
    key: number;
    productType: string;
  }

const productTypeData: ProductType[] = [
    { key: 0, productType: 'สินค้าอุปโภคบริโภค' },
    { key: 1, productType: 'น้ำตาลกระสอบ' },
    { key: 2, productType: 'น้ำตาลเทกอง' },
    { key: 3, productType: 'ปุ๋ยกระสอบ' },
    { key: 4, productType: 'อุปกรณ์การเกษตร' },
    { key: 5, productType: 'ผลผลิตทางการเกษตร (ข้าว แป้ง มันสำปะหลัง ยางพารา)' },
    { key: 6, productType: 'อาหารสัตว์' },
    { key: 7, productType: 'วัสดุก่อสร้าง' },
    { key: 8, productType: 'วัสดุทดแทนไม้ (MDF & PB)' },
    { key: 9, productType: 'ชิ้นส่วนยานยนต์' },
    { key: 10, productType: 'สินค้าอันตราย' },
    { key: 11, productType: 'กากน้ำตาล (Molasses)' },
    { key: 12, productType: 'อื่นๆ' },
    { key: 13, productType: 'เชื้อเพลิงชีวมวล (Biomasses)' },
    { key: 14, productType: 'สารเคมี' },
];

const FuelCostCalculator: React.FC = () => {
  const [startLat, setStartLat] = useState<number | null>(null);
  const [startLng, setStartLng] = useState<number | null>(null);
  const [endLat, setEndLat] = useState<number | null>(null);
  const [endLng, setEndLng] = useState<number | null>(null);
  const [productType, setProductType] = useState<string>('');
  const [productTypeKey, setProductTypeKey] = useState<number>(0);
  const [truckType, setTruckType] = useState<string>('');
  const [oilPrice, setOilPrice] = useState<number | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);

  const getOSRMDistance = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;
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

  const getFuelConsumptionPerKm = (truckType: string) => {
      const truck = fuelConsumption[truckType];
      return [truck.min, truck.max, truck.min + truck.max / 2];
  };

  const calculateFuelCost = (distance: number, fuelConsumption: number[], oilPrice: number) => {
    const minFuelUsed = distance * fuelConsumption[0];
    const maxFuelUsed = distance * fuelConsumption[1];
    const avgFuelUsed = distance * fuelConsumption[2];
    const minTotalCost = minFuelUsed * oilPrice;
    const maxTotalCost = maxFuelUsed * oilPrice;
    const carbonEmission = avgFuelUsed * 2.68; // CO2 emission in kg
    return { minFuelUsed, maxFuelUsed, minTotalCost, maxTotalCost, carbonEmission };
  };

  const handleSubmit = async () => {
    if (startLat && startLng && endLat && endLng && truckType && oilPrice) {
      const osrmResult = await getOSRMDistance(startLat, startLng, endLat, endLng);
      //console.log(osrmResult);
      if (osrmResult) {
        const { distance, duration } = osrmResult;
        const fuelConsumption = getFuelConsumptionPerKm(truckType);
        if (distance && duration && fuelConsumption !== null) {
          const { minFuelUsed, maxFuelUsed, minTotalCost, maxTotalCost, carbonEmission } = calculateFuelCost(distance, fuelConsumption, oilPrice);
          setResult({ distance, duration, minFuelUsed, maxFuelUsed, minTotalCost, maxTotalCost, carbonEmission });
        }
      }
    }
  };

const handleInsurance = async () => {
    await handleSubmit();
    if (isInsuranceChecked && result) {
        //console.log(result);
        const riskLevel = await getRiskLevel({
          start_lat: Number(startLat),
          start_lng: Number(startLng),
          end_lat: Number(endLat),
          end_lng: Number(endLng),
          productType: productTypeKey,
          truckType: TruckKey[truckType],
          rains: 0,
          precipitation: 0,
          visibility: 0,
          distance: result.distance,
          duration: result.duration,
        });
        //console.log(riskLevel);
        let insuranceCost = '';
        if (riskLevel <= 0.3) {
            insuranceCost = 'Low';
        } else if (riskLevel > 0.3 && riskLevel < 0.7) {
            insuranceCost = 'Mid';
        } else {
            insuranceCost = 'High';
        }
        setResult({ ...result, insuranceCost });
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
            handleInsurance();
          }}
        >
          <h3 className="text-xl font-semibold">Calculator</h3>
          <div className="space-y-2">
            <Label htmlFor="startLatitude">Start Latitude</Label>
            <Input
              className="px-2 py-1"
              id="startLatitude"
              type="number"
              value={startLat || ""}
              onChange={(e) => setStartLat(parseFloat(e.target.value))}
              placeholder="Enter start latitude"
              min={-90}
              max={90}
              step="0.00001"
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
              min={-180}
              max={180}
              step="0.00001"
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
              min={-90}
              max={90}
              step="0.00001"
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
              min={-180}
              max={180}
              step="0.00001"
            />
          </div>
          <div className="space-y-2">
            <Label>Truck Type</Label>
            <Select value={truckType} onValueChange={setTruckType}>
              <SelectTrigger className="w-full px-2 py-1">
                <SelectValue placeholder="Select a truck type" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                <SelectGroup className="p-2">
                  <SelectLabel className="px-2 py-1.5">
                    ประเภทรถขนส่ง
                  </SelectLabel>
                  <SelectLabel className="px-3 py-1.5">4 ล้อ</SelectLabel>
                  <SelectItem
                    value="4ล้อ-คอก"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    4ล้อ-คอก
                  </SelectItem>
                  <SelectItem
                    value="4ล้อ-จัมโบ้"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    4ล้อ-จัมโบ้
                  </SelectItem>
                  <SelectItem
                    value="4ล้อ-ตู้ทึบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    4ล้อ-ตู้ทึบ
                  </SelectItem>
                  <SelectLabel className="px-3 py-1.5">6 ล้อ</SelectLabel>
                  <SelectItem
                    value="6ล้อ-เฮี๊ยบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    6ล้อ-เฮี๊ยบ
                  </SelectItem>
                  <SelectItem
                    value="6ล้อ-พื้นเรียบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    6ล้อ-พื้นเรียบ
                  </SelectItem>
                  <SelectItem
                    value="6ล้อ-ตู้ทึบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    6ล้อ-ตู้ทึบ
                  </SelectItem>
                  <SelectItem
                    value="6ล้อ-คอก"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    6ล้อ-คอก
                  </SelectItem>
                  <SelectLabel className="px-3 py-1.5">10 ล้อ</SelectLabel>
                  <SelectItem
                    value="10ล้อ-พ่วงเฮี๊ยบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-พ่วงเฮี๊ยบ
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-คอก(15 ตัน)"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-คอก(15 ตัน)
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-รถเฮี๊ยบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-รถเฮี๊ยบ
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-ตู้ทึบ-พ่วง"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-ตู้ทึบ-พ่วง
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-ตู้ทึบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-ตู้ทึบ
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-คอก(16 ตัน)"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-คอก(16 ตัน)
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-คอก-พ่วง"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-คอก-พ่วง
                  </SelectItem>
                  <SelectItem
                    value="10ล้อ-พื้นเรียบ"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    10ล้อ-พื้นเรียบ
                  </SelectItem>
                  <SelectLabel className="px-3 py-1.5">อื่นๆ</SelectLabel>
                  <SelectItem
                    value="รถหัวลาก-พื้นเรียบ(30 ตัน)"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    รถหัวลาก-พื้นเรียบ(30 ตัน)
                  </SelectItem>
                  <SelectItem
                    value="รถหัวลาก-พื้นเรียบ(32 ตัน)"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    รถหัวลาก-พื้นเรียบ(32 ตัน)
                  </SelectItem>
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
              min={0}
            />
          </div>
          <div className="space-y-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded"
                checked={isInsuranceChecked}
                onChange={(e) => setIsInsuranceChecked(e.target.checked)}
              />
              <span className="text-gray-700">Insurance?</span>
            </label>
            {isInsuranceChecked && (
              <div className="mt-4 p-4 space-y-2 rounded">
                <h3 className="text-lg font-semibold text-sky-600">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select value={productType} onValueChange={(value) => {
                    setProductType(value);
                    const selectedProduct = productTypeData.find(product => product.productType === value);
                    if (selectedProduct) {
                      setProductTypeKey(selectedProduct.key);
                    }
                  }}>
                    <SelectTrigger className="w-full px-2 py-1">
                      <SelectValue placeholder="Select a product type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                      <SelectGroup className="p-2">
                        <SelectLabel className="px-2 py-1.5">
                          ประเภท
                        </SelectLabel>
                        {productTypeData.map((product) => (
                          <SelectItem
                            key={product.key}
                            value={product.productType}
                            className="px-4 py-2 hover:bg-gray-100"
                          >
                            {product.productType}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white px-2 py-1 rounded-md"
          >
            Calculate
          </Button>
        </form>
      </div>

      {result && (
        <div className="w-full h-full space-y-6 max-w-lg mx-auto my-4 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Results</h3>
          <p className="text-zinc-500">
            Distance{" "}
            <span className="text-xl text-black">
              {result.distance.toFixed(1)}
            </span>{" "}
            km
          </p>
          <p className="text-zinc-500">
            Duration{" "}
            <span className="text-xl text-black">
              {result.duration.toFixed(1)}
            </span>{" "}
            hours
          </p>
          <p className="text-zinc-500">
            Fuel Used{" ~ "}
            <span className="text-xl text-black">
              {result.minFuelUsed.toFixed(1)}
            </span>{" - "}
            <span className="text-xl text-black">
              {result.maxFuelUsed.toFixed(1)}
            </span>{" "}
            liters
          </p>
          <p className="text-zinc-500">
            Total Fuel Cost{" ~ "}
            <span className="text-xl text-black">
              {result.minTotalCost.toFixed(1)}
            </span>{" - "}
            <span className="text-xl text-black">
              {result.maxTotalCost.toFixed(1)}
            </span>{" "}
            baht
          </p>
          <p className="text-zinc-500">
            Carbon Emission{" ~ "}
            <span className="text-xl text-black">
              {result.carbonEmission.toFixed(1)}
            </span>{" "}
            kg CO2
          </p>
          { isInsuranceChecked && result.insuranceCost && (
          <p className="text-zinc-500">
            Risk Rating{" "}
            {result.insuranceCost === 'Low' ? (
              <Badge className="px-4 bg-green-500 text-white">
                {result.insuranceCost}
              </Badge>
            ) : result.insuranceCost === 'Mid' ? (
              <Badge className="px-4 bg-yellow-500 text-white">
                {result.insuranceCost}
              </Badge>
            ) : (
              <Badge className="px-4 bg-red-500 text-white">
                {result.insuranceCost}
              </Badge>
            )}
          </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FuelCostCalculator;
