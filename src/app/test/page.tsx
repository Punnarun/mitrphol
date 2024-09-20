import MapComponent from "@/component/MapComponent2";
import Yoyo from "@/component/test";

export default function Home() {
  const latitude = 13.750598;  // Bangkok's latitude
  const longitude = 100.531536; // Bangkok's longitude

  return (
    <div>
      <MapComponent latitude={latitude} longitude={longitude} />
      <Yoyo latitude={latitude} longitude={longitude} />
    </div>
    )
}
