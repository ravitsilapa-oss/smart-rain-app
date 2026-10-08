const LineShareService = {
    shareReport(locationName, weatherData, riskObj, aiText) {
        if (!weatherData || !weatherData.current) return;

        const temp = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;
        const rain = weatherData.current.precipitation;
        const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        const message = 
`🌧️ รายงานสภาพอากาศอัจฉริยะ
พื้นที่: ${locationName}
อุณหภูมิ: ${temp} °C | ความชื้น: ${humidity}%
ปริมาณฝน: ${rain} มม./ชม.
ระดับความเสี่ยง: ${riskObj.score} (${riskObj.level})
แนวโน้ม: ${aiText}
อัปเดตเมื่อ: ${timeStr} น.`;

        const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(message)}`;
        window.open(lineUrl, '_blank');
    }
};
