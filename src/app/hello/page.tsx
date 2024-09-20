import MapComponent from "@/component/MapComponent";
import yoyo from "@/component/yoyo";

export default function Home() {
  const latitude = 13.7563;  // Bangkok's latitude
  const longitude = 100.5018; // Bangkok's longitude

  return (
    <div>
      <h1>My Zoomable Map with a Red Circle</h1>
      <MapComponent latitude={latitude} longitude={longitude} />
      <yoyo latitude={latitude} longitude={longitude} />
    </div>
    )
}
