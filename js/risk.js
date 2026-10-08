const RiskEngine = {
    calculateRisk(weatherData) {
        if (!weatherData || !weatherData.current) return { score: 0, level: 'ต่ำ' };

        const rainCurrent = weatherData.current.precipitation || 0;
        const humidity = weatherData.current.relative_humidity_2m || 0;
        const hourlyRain = weatherData.hourly?.precipitation || [];
        
        const futureRain = hourlyRain.slice(2, 5).reduce((a, b) => a + b, 0);

        let score = 0;
        score += Math.min(rainCurrent * 15, 40);
        score += Math.min(futureRain * 10, 40);
        score += (humidity > 80) ? 20 : (humidity * 0.15);

        score = Math.min(Math.round(score), 100);

        let level = 'ต่ำ';
        let badgeClass = 'badge-risk-low';
        if (score > 80) { level = 'สูง'; badgeClass = 'badge-risk-high'; }
        else if (score > 60) { level = 'ค่อนข้างสูง'; badgeClass = 'badge-risk-medhigh'; }
        else if (score > 40) { level = 'ปานกลาง'; badgeClass = 'badge-risk-med'; }

        return { score, level, badgeClass, rainPast: rainCurrent, rainFuture: futureRain };
    }
};
