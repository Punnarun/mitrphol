interface RiskLevelParams {
    start_lat: number;
    start_lng: number;
    end_lat: number;
    end_lng: number;
    productType: number;
    truckType: number;
    rains: number;
    precipitation: number;
    visibility: number;
    distance: number;
    duration: number;
}

export async function getRiskLevel(params: RiskLevelParams) {
    // Destructure the parameters
    const { start_lat, start_lng, end_lat, end_lng, productType, truckType, rains, precipitation, visibility, distance, duration } = params;

    // Overpass API URL to find petrol stations within 100 meters
    const overpassUrl = `http://172.18.20.253:8888/predict_risk`;

    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ start_lat, start_lng, end_lat, end_lng, productType, truckType, rains, precipitation, visibility, distance, duration }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        const data = await response.json();
        const stations = data.elements;

        return stations.map((station: { tags: { name: any; }; lat: any; lon: any; }) => ({
            name: station.tags.name || "Unnamed station",
            lat: station.lat,
            lon: station.lon,
        }));
    } catch (error) {
        // console.error("Error:", error.message);
        return [];
    }
}