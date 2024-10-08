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
  const [riskRating, setRiskRating] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);

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

  const handleSubmit = async () => {
    if (startLat && startLng && endLat && endLng) {
      const osrmResult = await getOSRMDistance(startLat, startLng, endLat, endLng);
      if (osrmResult) {
        const { distance, duration } = osrmResult;
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
          distance: distance,
          duration: duration,
        });
        if (riskLevel <= 0.3) {
          setRiskRating('Low');
        } else if (riskLevel > 0.3 && riskLevel < 0.7) {
          setRiskRating('Mid');
        } else {
          setRiskRating('High');
        }
        setResult({ distance, duration });
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
          <h3 className="text-xl font-semibold">Insurance</h3>
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
            <Label>Product Type</Label>
            <Select
              value={productType}
              onValueChange={(value) => {
                setProductType(value);
                const selectedProduct = productTypeData.find(
                  (product) => product.productType === value
                );
                if (selectedProduct) {
                  setProductTypeKey(selectedProduct.key);
                }
              }}
            >
              <SelectTrigger className="w-full px-2 py-1">
                <SelectValue placeholder="Select a product type" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                <SelectGroup className="p-2">
                  <SelectLabel className="px-2 py-1.5">ประเภท</SelectLabel>
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
          <Button
            type="submit"
            className="w-full bg-black text-white px-2 py-1 rounded-md"
          >
            Submit
          </Button>
        </form>
      </div>

      {result && (
        <div className="w-full h-full space-y-6 max-w-lg mx-auto my-4 p-6 bg-white rounded-lg shadow-md">
          <div className="text-zinc-500">
            Risk Rating{" "}
            {riskRating === "Low" ? (
              <Badge className="px-4 bg-green-500 text-white">
                {riskRating}
              </Badge>
            ) : riskRating === "Mid" ? (
              <Badge className="px-4 bg-yellow-500 text-white">
                {riskRating}
              </Badge>
            ) : (
              <Badge className="px-4 bg-red-500 text-white">{riskRating}</Badge>
            )}
          </div>
          <div className="text-zinc-500">
            {riskRating === "Low" ? (
              <div>"Weather looking good, good to go!"</div>
            ) : riskRating === "Mid" ? (
              <div>"Weather looking normal, your load might be at risk, you could get an insurance"</div>
            ) : (
              <div>"The weather condition is not looking good, you should consider get an insurance."</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelCostCalculator;
