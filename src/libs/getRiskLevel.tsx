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
    const overpassUrl = `http://26.113.169.4:8888/predict_risk`;

    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "start_lat": start_lat,
                "start_lng": start_lng,
                "end_lat": end_lat,
                "end_lng": end_lng,
                "productType": productType,
                "truckType": truckType,
                "rains": rains,
                "precipitation": precipitation,
                "visibility": visibility,
                "distance": distance,
                "duration": duration,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        const data = await response.json();

        return data.risk_level;

    } catch (error) {
        console.error("Error:", (error as Error).message);
        return [];
    }
}