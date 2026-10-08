const WeatherService = {
    async fetchWeather(lat, lng) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,precipitation&past_hours=2&forecast_hours=6&timezone=Asia%2FBangkok`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อ Open-Meteo ได้");
            return await res.json();
        } catch (err) {
            console.error("Weather Fetch Error:", err);
            return null;
        }
    }
};
