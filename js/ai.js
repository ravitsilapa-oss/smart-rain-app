const AIAnalysis = {
    generateInsight(weatherData, riskObj) {
        if (!weatherData || !weatherData.hourly) {
            return "ข้อมูลไม่เพียงพอสำหรับการวิเคราะห์";
        }

        const hourlyRain = weatherData.hourly.precipitation || [];
        const currentRain = weatherData.current?.precipitation || 0;
        const future3h = hourlyRain.slice(3, 6).reduce((a, b) => a + b, 0);

        let text = "";
        if (future3h > currentRain && future3h > 2.0) {
            text = `มีแนวโน้มเกิดฝนเพิ่มขึ้นในอีก 1-3 ชั่วโมงข้างหน้า คาดการณ์ฝนสะสม ${future3h.toFixed(1)} มม. ควรเฝ้าระวังกลุ่มฝนและเตรียมพกร่ม`;
        } else if (currentRain > 0 && future3h < currentRain) {
            text = "กลุ่มฝนปัจจุบันกำลังอ่อนกำลังลง และมีแนวโน้มจะหยุดตกในระยะถัดไป";
        } else if (currentRain === 0 && future3h === 0) {
            text = "กลุ่มเมฆฝนน้อย สภาพอากาศปกติ ยังไม่มีแนวโน้มฝนตกหนักในระยะ 3 ชั่วโมงนี้";
        } else {
            text = "สภาพอากาศมีความผันผวนปานกลาง ให้เฝ้าระวังกลุ่มฝนตามแนวเคลื่อนตัวของเรดาร์";
        }

        return text;
    }
};
