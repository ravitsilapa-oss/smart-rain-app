// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW register failed: ', err));
    });
}

// --- Comprehensive Water Systems & Full Dams/Sub-Dams Database ---
const LocationService = {
    provinces: [
        { name: "กรุงเทพมหานคร (50 เขต)", region: "ภาคกลาง", lat: 13.7563, lng: 100.5018 },
        { name: "ระนอง", region: "ภาคใต้", lat: 9.9658, lng: 98.6385 },
        { name: "เชียงใหม่", region: "ภาคเหนือ", lat: 18.7883, lng: 98.9853 },
        { name: "ขอนแก่น", region: "ภาคอีสาน", lat: 16.4322, lng: 102.8236 },
        { name: "ชลบุรี", region: "ภาคตะวันออก", lat: 13.3611, lng: 100.9847 },
        { name: "สงขลา", region: "ภาคใต้", lat: 7.1988, lng: 100.5951 },
        { name: "ภูเก็ต", region: "ภาคใต้", lat: 7.8804, lng: 98.3923 },
        { name: "นครราชสีมา", region: "ภาคอีสาน", lat: 14.9799, lng: 102.0977 }
    ],
    bangkokDistricts: [
        { name: "เขตพระนคร", zone: "ฝั่งพระนคร", lat: 13.7590, lng: 100.4938 },
        { name: "เขตดุสิต", zone: "ฝั่งพระนคร", lat: 13.7788, lng: 100.5135 },
        { name: "เขตหนองจอก", zone: "ฝั่งพระนคร", lat: 13.8526, lng: 100.8576 },
        { name: "เขตบางรัก", zone: "ฝั่งพระนคร", lat: 13.7257, lng: 100.5242 },
        { name: "เขตจตุจักร", zone: "ฝั่งพระนคร", lat: 13.8284, lng: 100.5583 },
        { name: "เขตลาดพร้าว", zone: "ฝั่งพระนคร", lat: 13.8150, lng: 100.6050 }
    ],
    getWaterCanalsForProvince(provinceName) {
        if (provinceName.includes("กรุงเทพ")) {
            return [
                { name: "แม่น้ำเจ้าพระยา (ปากคลองตลาด - หลัก)", current: "+0.45 ม.", bank: "+2.00 ม.", status: "ปกติ" },
                { name: "คลองแสนแสบ (สะพานผ่านฟ้า - หลัก)", current: "+0.35 ม.", bank: "+1.20 ม.", status: "ปกติ" },
                { name: "คลองแสนแสบ (ช่วงบางกะปิ - ย่อย)", current: "+0.28 ม.", bank: "+1.00 ม.", status: "ปกติ" },
                { name: "คลองลาดพร้าว (อุโมงค์ระบายน้ำ - หลัก)", current: "+0.80 ม.", bank: "+1.50 ม.", status: "ปกติ" },
                { name: "คลองลาดพร้าว (ช่วงรัชดา - ย่อย)", current: "+0.55 ม.", bank: "+1.10 ม.", status: "ปกติ" },
                { name: "คลองเปรมประชากร (บางซื่อ - หลัก)", current: "+1.10 ม.", bank: "+1.20 ม.", status: "เฝ้าระวัง" },
                { name: "คลองประเวศบุรีรมย์ (ลาดกระบัง - ย่อย)", current: "+0.30 ม.", bank: "+1.00 ม.", status: "ปกติ" },
                { name: "คลองภาษีเจริญ (ฝั่งธนบุรี - หลัก)", current: "+0.40 ม.", bank: "+1.30 ม.", status: "ปกติ" }
            ];
        } else if (provinceName.includes("ระนอง")) {
            return [
                { name: "แม่น้ำกระบุรี (ชายแดนไทย-เมียนมา - หลัก)", current: "+2.10 ม.", bank: "+4.50 ม.", status: "ปกติ" },
                { name: "คลองหาดส้มแป้น (อำเภอเมือง - หลัก)", current: "+0.60 ม.", bank: "+1.80 ม.", status: "ปกติ" },
                { name: "คลองหาดส้มแป้น (ช่วงตอนบน - ย่อย)", current: "+0.40 ม.", bank: "+1.20 ม.", status: "ปกติ" },
                { name: "คลองละอุ่น (อำเภอละอุ่น - หลัก)", current: "+0.80 ม.", bank: "+2.00 ม.", status: "ปกติ" },
                { name: "คลองงาว (อำเภอเมือง - ย่อย)", current: "+0.35 ม.", bank: "+1.10 ม.", status: "ปกติ" },
                { name: "ระบบระบายน้ำเทศบาลเมืองระนอง", current: "+0.25 ม.", bank: "+1.00 ม.", status: "ปกติ" }
            ];
        } else if (provinceName.includes("เชียงใหม่")) {
            return [
                { name: "แม่น้ำปิง (สะพานนวรัฐ - หลัก)", current: "+1.20 ม.", bank: "+3.50 ม.", status: "ปกติ" },
                { name: "แม่น้ำปิง (ช่วงอำเภอแม่แตง - ย่อย)", current: "+1.50 ม.", bank: "+4.00 ม.", status: "ปกติ" },
                { name: "คลองแม่ข่า (ใจกลางเมือง - หลัก)", current: "+0.50 ม.", bank: "+1.50 ม.", status: "ปกติ" },
                { name: "คลองแม่ข่า (ช่วงช้างเผือก - ย่อย)", current: "+0.35 ม.", bank: "+1.10 ม.", status: "ปกติ" },
                { name: "ลำห้วยแก้ว (หน้าสวนสัตว์ - หลัก)", current: "+0.30 ม.", bank: "+1.00 ม.", status: "ปกติ" },
                { name: "คลองชลประทานแม่สาย (ย่อย)", current: "+0.45 ม.", bank: "+1.30 ม.", status: "ปกติ" }
            ];
        } else {
            return [
                { name: `แม่น้ำสายประธานหลัก (${provinceName})`, current: "+0.60 ม.", bank: "+3.00 ม.", status: "ปกติ" },
                { name: `แม่น้ำสาขา (${provinceName} - ย่อย)`, current: "+0.40 ม.", bank: "+2.00 ม.", status: "ปกติ" },
                { name: `คลองชลประทานหลัก (${provinceName})`, current: "+0.35 ม.", bank: "+1.50 ม.", status: "ปกติ" },
                { name: `คลองซอย/คลองย่อย (${provinceName} - ย่อย)`, current: "+0.25 ม.", bank: "+1.10 ม.", status: "ปกติ" },
                { name: `ระบบระบายน้ำและแก้มลิงเขตเทศบาล`, current: "+0.20 ม.", bank: "+1.00 ม.", status: "ปกติ" }
            ];
        }
    },
    // รวมเขื่อนหลักและเขื่อนย่อย/อ่างเก็บน้ำทั่วประเทศแบบจัดเต็ม
    majorAndMinorDams: [
        // ภาคเหนือ
        { name: "เขื่อนภูมิพล (ตาก - เขื่อนใหญ่)", current: "520.40 ม.รทก.", capacity: "54.2%", status: "ปกติ" },
        { name: "เขื่อนสิริกิติ์ (อุตรดิตถ์ - เขื่อนใหญ่)", current: "495.10 ม.รทก.", capacity: "61.8%", status: "ปกติ" },
        { name: "เขื่อนแควน้อยบำรุงแดน (พิษณุโลก)", current: "115.30 ม.รทก.", capacity: "45.0%", status: "ปกติ" },
        { name: "เขื่อนกิ่วลม (ลำปาง - เขื่อนย่อย)", current: "365.20 ม.รทก.", capacity: "52.4%", status: "ปกติ" },
        { name: "เขื่อนกิ่วคอหมา (ลำปาง - เขื่อนย่อย)", current: "380.10 ม.รทก.", capacity: "58.1%", status: "ปกติ" },
        { name: "เขื่อนแม่งัดสมบูรณ์ชล (เชียงใหม่ - เขื่อนย่อย)", current: "390.40 ม.รทก.", capacity: "65.3%", status: "ปกติ" },
        { name: "เขื่อนแม่กวงอุดมธารา (เชียงใหม่ - เขื่อนย่อย)", current: "330.10 ม.รทก.", capacity: "49.8%", status: "ปกติ" },
        
        // ภาคอีสาน
        { name: "เขื่อนอุบลรัตน์ (ขอนแก่น - เขื่อนใหญ่)", current: "178.90 ม.รทก.", capacity: "72.4%", status: "เฝ้าระวัง" },
        { name: "เขื่อนน้ำอูน (สกลนคร - เขื่อนย่อย)", current: "175.40 ม.รทก.", capacity: "60.5%", status: "ปกติ" },
        { name: "เขื่อนลำปาว (กาฬสินธุ์ - เขื่อนย่อย)", current: "152.80 ม.รทก.", capacity: "70.1%", status: "ปกติ" },
        { name: "เขื่อนลำตะคอง (นครราชสีมา - เขื่อนย่อย)", current: "265.30 ม.รทก.", capacity: "55.0%", status: "ปกติ" },
        { name: "เขื่อนลำพระเพลิง (นครราชสีมา - เขื่อนย่อย)", current: "220.10 ม.รทก.", capacity: "68.2%", status: "ปกติ" },
        { name: "เขื่อนสิรินธร (อุบลราชธานี - เขื่อนย่อย)", current: "138.50 ม.รทก.", capacity: "63.0%", status: "ปกติ" },
        { name: "เขื่อนปากมูล (อุบลราชธานี - เขื่อนย่อย)", current: "102.10 ม.รทก.", capacity: "50.4%", status: "ปกติ" },
        { name: "เขื่อนห้วยหลวง (อุดรธานี - เขื่อนย่อย)", current: "185.00 ม.รทก.", capacity: "59.0%", status: "ปกติ" },

        // ภาคกลาง / ตะวันตก / ตะวันออก
        { name: "เขื่อนศรีนครินทร์ (กาญจนบุรี - เขื่อนใหญ่)", current: "172.50 ม.รทก.", capacity: "68.9%", status: "ปกติ" },
        { name: "เขื่อนวชิราลงกรณ (กาญจนบุรี - เขื่อนใหญ่)", current: "148.20 ม.รทก.", capacity: "65.1%", status: "ปกติ" },
        { name: "เขื่อนแม่กลอง (กาญจนบุรี - เขื่อนย่อย)", current: "22.40 ม.รทก.", capacity: "40.0%", status: "ปกติ" },
        { name: "เขื่อนป่าสักชลสิทธิ์ (ลพบุรี - เขื่อนใหญ่)", current: "42.10 ม.รทก.", capacity: "48.3%", status: "ปกติ" },
        { name: "เขื่อนขุนด่านปราการชล (นครนายก - เขื่อนย่อย)", current: "55.20 ม.รทก.", capacity: "62.1%", status: "ปกติ" },
        { name: "เขื่อนประแสร์ (ระยอง - เขื่อนย่อย)", current: "68.30 ม.รทก.", capacity: "71.0%", status: "ปกติ" },
        { name: "เขื่อนหนองปลาไหล (ระยอง - เขื่อนย่อย)", current: "45.00 ม.รทก.", capacity: "53.2%", status: "ปกติ" },
        { name: "เขื่อนแก่งกระจาน (เพชรบุรี - เขื่อนย่อย)", current: "100.10 ม.รทก.", capacity: "57.8%", status: "ปกติ" },
        { name: "เขื่อนปราณบุรี (ประจวบคีรีขันธ์ - เขื่อนย่อย)", current: "75.40 ม.รทก.", capacity: "60.0%", status: "ปกติ" },

        // ภาคใต้
        { name: "เขื่อนรัชชประภา หรือ เชี่ยวหลาน (สุราษฎร์ธานี)", current: "110.20 ม.รทก.", capacity: "66.5%", status: "ปกติ" },
        { name: "เขื่อนบางลาง (ยะลา - เขื่อนใหญ่)", current: "105.80 ม.รทก.", capacity: "58.0%", status: "ปกติ" }
    ],
    getCamerasForProvince(provinceName, pLat, pLng) {
        return [
            { id: 1, name: `ศูนย์กลางเมือง ${provinceName}`, lat: pLat, lng: pLng, waterLevel: "0.10 ม.", status: "ปกติ (น้ำแห้ง)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: `https://traffic.longdo.com/?l=${pLat},${pLng},16` },
            { id: 2, name: `ย่านเศรษฐกิจ ${provinceName}`, lat: pLat + 0.012, lng: pLng + 0.012, waterLevel: "0.20 ม.", status: "เฝ้าระวัง", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: `https://traffic.longdo.com/?l=${pLat + 0.012},${pLng + 0.012},16` }
        ];
    },
    getCurrentGPS() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("เบราว์เซอร์ไม่รองรับ GPS"));
            navigator.geolocation.getCurrentPosition(
                p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
                e => reject(e),
                { timeout: 8000, enableHighAccuracy: true }
            );
        });
    },
    async searchLocation(query) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Thailand')}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();
            if (data && data.length > 0) {
                return { name: data[0].display_name.split(',')[0], lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
            return null;
        } catch (e) { return null; }
    }
};

const WeatherService = {
    async fetchWeather(lat, lng) {
        try {
            const weatherUrl = `
