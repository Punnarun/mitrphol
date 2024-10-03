import axios from "axios";

interface WeatherData {
    coord: { lon: number; lat: number };
    weather: [{ description: string }];
    main: { temp: number };
    wind: { speed: number };
    name: string;
}

const apiKey = "299f4e845b1344fdc8f7c14b43822d9c";

export async function getWeather(city: string) {
    try {
        const response = await axios.get<WeatherData>(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        return response.data;
    } catch (err) {
        console.error("Failed to fetch weather data");
        return null;
    }
}