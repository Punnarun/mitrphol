'use client';  // Keep this

import dynamic from 'next/dynamic';
import Yoyo from "@/component/test";  // Adjust the path to Yoyo if needed

// Dynamically import MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import('@/component/MapComponent2'), {
  ssr: false,  // This ensures it only renders on the client
});

export default function TestPage() {
  const latitude = 13.750598;  // Bangkok's latitude
  const longitude = 100.531536; // Bangkok's longitude

  return (
    <div>
      <MapComponent latitude={latitude} longitude={longitude} />
      <Yoyo latitude={latitude} longitude={longitude} />
    </div>
  );
}
