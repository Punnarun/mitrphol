export async function findNearbyPetrolStations(lon: number, lat: number) {
    // Check if latitude and longitude are provided
    if (!lat || !lon) {
        throw new Error("Latitude and longitude must be provided.");
    }

    // Overpass API URL to find petrol stations within 100 meters
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](around:1000,${lat},${lon});out;`;

    try {

        const response = await fetch(overpassUrl);
        
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