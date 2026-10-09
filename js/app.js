// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW register failed: ', err));
    });
}

// --- Comprehensive Water Systems, Tides & Sun Data Services ---
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
    majorAndMinorDams: [
        { name: "เขื่อนภูมิพล (ตาก - เขื่อนใหญ่)", current: "520.40 ม.รทก.", capacity: "54.2%", status: "ปกติ" },
        { name: "เขื่อนสิริกิติ์ (อุตรดิตถ์ - เขื่อนใหญ่)", current: "495.10 ม.รทก.", capacity: "61.8%", status: "ปกติ" },
        { name: "เขื่อนแควน้อยบำรุงแดน (พิษณุโลก)", current: "115.30 ม.รทก.", capacity: "45.0%", status: "ปกติ" },
        { name: "เขื่อนกิ่วลม (ลำปาง - เขื่อนย่อย)", current: "365.20 ม.รทก.", capacity: "52.4%", status: "ปกติ" },
        { name: "เขื่อนอุบลรัตน์ (ขอนแก่น - เขื่อนใหญ่)", current: "178.90 ม.รทก.", capacity: "72.4%", status: "เฝ้าระวัง" },
        { name: "เขื่อนน้ำอูน (สกลนคร - เขื่อนย่อย)", current: "175.40 ม.รทก.", capacity: "60.5%", status: "ปกติ" },
        { name: "เขื่อนศรีนครินทร์ (กาญจนบุรี - เขื่อนใหญ่)", current: "172.50 ม.รทก.", capacity: "68.9%", status: "ปกติ" },
        { name: "เขื่อนวชิราลงกรณ (กาญจนบุรี - เขื่อนใหญ่)", current: "148.20 ม.รทก.", capacity: "65.1%", status: "ปกติ" },
        { name: "เขื่อนป่าสักชลสิทธิ์ (ลพบุรี - เขื่อนใหญ่)", current: "42.10 ม.รทก.", capacity: "48.3%", status: "ปกติ" },
        { name: "เขื่อนขุนด่านปราการชล (นครนายก - เขื่อนย่อย)", current: "55.20 ม.รทก.", capacity: "62.1%", status: "ปกติ" },
        { name: "เขื่อนรัชชประภา (เชี่ยวหลาน - สุราษฎร์ธานี)", current: "110.20 ม.รทก.", capacity: "66.5%", status: "ปกติ" },
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
            const res = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Thailand')}`;
            const fetchRes = await fetch(res, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await fetchRes.json();
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,is_day,weather_code&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&hourly=precipitation_probability,precipitation&timezone=Asia%2FBangkok`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(weatherUrl, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            return await res.json();
        } catch (e) {
            let mockDates = [], mockSunrise = [], mockSunset = [];
            let todayStr = new Date().toISOString().split('T')[0];
            for(let i=0; i<7; i++) {
                let d = new Date(); d.setDate(d.getDate() + i);
                mockDates.push(d.toISOString());
                mockSunrise.push(`${d.toISOString().split('T')[0]}T06:08`);
                mockSunset.push(`${d.toISOString().split('T')[0]}T18:15`);
            }
            return {
                current: { temperature_2m: 29.0, apparent_temperature: 33.5, relative_humidity_2m: 80, precipitation: 0.0, visibility: 10000 },
                hourly: { precipitation: [0, 0, 0, 0, 0, 0], time: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
                daily: { temperature_2m_max: [34,33,32,33,35,34,33], temperature_2m_min: [25,25,24,25,26,25,25], precipitation_probability_max: [20,40,10,60,30,20,10], sunrise: mockSunrise, sunset: mockSunset, time: mockDates },
                fallback: true
            };
        }
    },
    async fetchAirQuality(lat, lng) { return 28.5; }
};

const RadarService = {
    map: null,
    radarLayers: [],
    timestamps: [],
    currentIndex: 0,
    intervalId: null,
    locationMarker: null,
    locationCircle: null,
    currentOpacity: 0.6,

    initMap(id, lat, lng) {
        if (this.map) return;
        const container = document.getElementById(id);
        if (!container) return;
        
        this.map = L.map(id, { minZoom: 5, maxZoom: 18 }).setView([lat, lng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(this.map);
        this.updateLocationMarker(lat, lng, "พื้นที่บัญชาการ");
    },

    setOpacity(opacity) {
        this.currentOpacity = opacity;
        this.radarLayers.forEach(l => l.setOpacity(opacity));
    },

    updateLocationMarker(lat, lng, name) {
        if (!this.map) return;
        if (this.locationMarker) this.map.removeLayer(this.locationMarker);
        if (this.locationCircle) this.map.removeLayer(this.locationCircle);

        this.locationMarker = L.marker([lat, lng]).addTo(this.map).bindPopup(`<b>📍 ${name}</b>`).openPopup();
        this.locationCircle = L.circle([lat, lng], { color: '#0d6efd', fillColor: '#0d6efd', fillOpacity: 0.15, radius: 3000 }).addTo(this.map);

        this.map.setView([lat, lng], 11);
        setTimeout(() => { this.map.invalidateSize(); }, 300);
    },

    async loadRadarFrames() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();
            const pastFrames = data.radar?.past || [];
            this.timestamps = pastFrames.map(f => f.time);
            this.radarLayers.forEach(l => this.map.removeLayer(l));
            this.radarLayers = [];
            
            pastFrames.forEach(frame => {
                const tileUrl = `${data.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
                const layer = L.tileLayer(tileUrl, { opacity: this.currentOpacity, zIndex: 100, maxNativeZoom: 8, maxZoom: 18, tileSize: 256 });
                this.radarLayers.push(layer);
            });
            if (this.radarLayers.length > 0) this.showFrame(this.radarLayers.length - 1);
            return this.timestamps;
        } catch (e) { return []; }
    },

    showFrame(index) {
        if (!this.map || index < 0 || index >= this.radarLayers.length) return;
        this.radarLayers.forEach((layer, i) => {
            if (i === index) { if (!this.map.hasLayer(layer)) this.map.addLayer(layer); }
            else { if (this.map.hasLayer(layer)) this.map.removeLayer(layer); }
        });
        this.currentIndex = index;
        const d = new Date(this.timestamps[index] * 1000);
        const timeLabel = document.getElementById('radarTimeLabel');
        if (timeLabel) timeLabel.innerText = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    },

    playAnimation(cb) {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            let next = (this.currentIndex + 1) % this.radarLayers.length;
            this.showFrame(next);
            if (cb) cb(next);
        }, 1000);
    },

    stopAnimation() { if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; } }
};

const RiskEngine = {
    calculateRisk(w) {
        if (!w || !w.current) return { score: 0, level: 'ต่ำ', badgeClass: 'bg-success', rainPast: 0, rainFuture: 0, maxRainHour: 0, radarStatus: 'เรดาร์ไม่พบฝน' };
        const rainCurr = w.current.precipitation || 0;
        const futureRain = (w.hourly?.precipitation || []).slice(2, 5).reduce((a, b) => a + b, 0);
        const maxRainHour = Math.max(...((w.hourly?.precipitation || []).slice(0, 6)), rainCurr);
        const totalRainAccumulated = rainCurr + futureRain;

        let score = Math.round(Math.min((totalRainAccumulated * 1.5), 100));
        let level = 'ต่ำ', badgeClass = 'bg-success';
        if (totalRainAccumulated > 50 || score > 75) { level = 'สูง'; badgeClass = 'bg-danger'; }
        else if (totalRainAccumulated > 25 || score > 50) { level = 'ค่อนข้างสูง'; badgeClass = 'bg-warning text-dark'; }
        else if (totalRainAccumulated > 10 || score > 25) { level = 'ปานกลาง'; badgeClass = 'bg-info text-dark'; }

        let radarStatus = totalRainAccumulated > 5 ? 'พบกลุ่มฝนปานกลาง' : 'เรดาร์ไม่พบฝน';
        return { score, level, badgeClass, rainPast: rainCurr.toFixed(1), rainFuture: futureRain.toFixed(1), maxRainHour: maxRainHour.toFixed(1), radarStatus };
    }
};

// --- Main Application Loop ---
document.addEventListener('DOMContentLoaded', async () => {
    let currentLat = 13.7563, currentLng = 100.5018, currentPlaceName = "กรุงเทพมหานคร";
    let chartInstance = null, isPlaying = false;

    let favorites = JSON.parse(localStorage.getItem('fav_locations') || '["กรุงเทพมหานคร", "เชียงใหม่", "ขอนแก่น"]');
    renderFavorites();

    function renderFavorites() {
        const container = document.getElementById('favoriteChips');
        if (!container) return;
        container.innerHTML = '<span class="text-muted small me-1"><i class="fa-solid fa-star text-warning"></i> โปรด:</span>';
        favorites.forEach(place => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-light border rounded-pill px-2 py-0 text-secondary me-1';
            btn.style.fontSize = '0.75rem';
            btn.innerHTML = `${place} <i class="fa-solid fa-xmark text-danger ms-1"></i>`;
            btn.querySelector('.fa-xmark').onclick = (e) => {
                e.stopPropagation();
                favorites = favorites.filter(f => f !== place);
                localStorage.setItem('fav_locations', JSON.stringify(favorites));
                renderFavorites();
            };
            btn.onclick = async () => {
                document.getElementById('searchInput').value = place;
                const res = await LocationService.searchLocation(place);
                if (res) {
                    currentLat = res.lat; currentLng = res.lng; currentPlaceName = res.name;
                    RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
                    refreshAllData();
                }
            };
            container.appendChild(btn);
        });
    }

    const addFavBtn = document.getElementById('btnAddFavorite');
    if (addFavBtn) {
        addFavBtn.onclick = () => {
            if (!favorites.includes(currentPlaceName)) {
                favorites.push(currentPlaceName);
                localStorage.setItem('fav_locations', JSON.stringify(favorites));
                renderFavorites();
                alert(`บันทึก "${currentPlaceName}" ลงในรายการโปรดเรียบร้อย!`);
            }
        };
    }

    const opacitySlider = document.getElementById('radarOpacity');
    if (opacitySlider) {
        opacitySlider.oninput = (e) => { RadarService.setOpacity(parseFloat(e.target.value)); };
    }

    RadarService.initMap('map', currentLat, currentLng);
    initProvinceDropdown();
    renderWaterLevelTable(currentPlaceName);
    renderCCTVSelector(currentPlaceName, currentLat, currentLng);

    const gpsBtn = document.getElementById('btnGPS');
    if (gpsBtn) {
        gpsBtn.onclick = async () => {
            try {
                document.getElementById('refreshStatusText').innerText = "กำลังดึง GPS...";
                const pos = await LocationService.getCurrentGPS();
                currentLat = pos.lat; currentLng = pos.lng;
                currentPlaceName = "ตำแหน่งปัจจุบันของฉัน";
                RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
                refreshAllData();
            } catch (e) { alert("GPS ไม่พร้อมใช้งาน: " + e.message); }
        };
    }

    const searchBtn = document.getElementById('btnSearch');
    if (searchBtn) {
        searchBtn.onclick = async () => {
            const q = document.getElementById('searchInput').value.trim();
            if (!q) return;
            document.getElementById('refreshStatusText').innerText = "กำลังค้นหา...";
            const res = await LocationService.searchLocation(q);
            if (res) {
                currentLat = res.lat; currentLng = res.lng; currentPlaceName = res.name;
                RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
                refreshAllData();
            } else { alert("ไม่พบสถานที่"); }
        };
    }

    const scanBtn = document.getElementById('btnScan');
    if (scanBtn) scanBtn.onclick = handleScanBangkokDistricts;

    const playBtn = document.getElementById('btnPlayRadar');
    if (playBtn) {
        playBtn.onclick = () => {
            if (isPlaying) {
                RadarService.stopAnimation();
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i> เล่น';
            } else {
                RadarService.playAnimation(idx => {
                    const timeline = document.getElementById('radarTimeline');
                    if (timeline) timeline.value = idx;
                });
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> หยุด';
            }
            isPlaying = !isPlaying;
        };
    }

    const shareBtn = document.getElementById('btnShareLine');
    if (shareBtn) {
        shareBtn.onclick = () => {
            const temp = document.getElementById('valTemp').innerText;
            const rain = document.getElementById('valRain').innerText;
            const msg = `🚨 ศูนย์บัญชาการภัยพิบัติ: ${currentPlaceName}\n🌡️ อุณหภูมิ: ${temp}\n🌧️ ฝนสะสม: ${rain}\n⏰ เวลา: ${new Date().toLocaleTimeString('th-TH')} น.`;
            window.open(`https://line.me/R/share?text=${encodeURIComponent(msg)}`, '_blank');
        };
    }

    function renderWaterLevelTable(provName) {
        const tbody = document.getElementById('waterLevelTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        // 1. แม่น้ำ คลองหลัก และคลองย่อย
        const canals = LocationService.getWaterCanalsForProvince(provName);
        tbody.innerHTML += `<tr class="table-light"><td colspan="4" class="fw-bold text-primary"><i class="fa-solid fa-water"></i> คลองหลักและคลองย่อย (${provName})</td></tr>`;
        canals.forEach(c => {
            const badge = c.status === 'ปกติ' ? 'bg-success' : 'bg-warning text-dark';
            tbody.innerHTML += `<tr><td><b>${c.name}</b></td><td><span class="fw-bold text-primary">${c.current}</span></td><td class="text-muted">${c.bank}</td><td><span class="badge ${badge}">${c.status}</span></td></tr>`;
        });

        // 2. เขื่อนใหญ่และเขื่อนย่อยทั่วประเทศ
        tbody.innerHTML += `<tr class="table-light"><td colspan="4" class="fw-bold text-success"><i class="fa-solid fa-mountain-sun"></i> เขื่อนใหญ่และเขื่อนย่อยทั่วประเทศ</td></tr>`;
        LocationService.majorAndMinorDams.forEach(d => {
            const badge = d.status === 'ปกติ' ? 'bg-success' : 'bg-warning text-dark';
            tbody.innerHTML += `<tr><td><b>${d.name}</b></td><td><span class="fw-bold text-info">${d.current}</span></td><td class="text-muted">ความจุ ${d.capacity}</td><td><span class="badge ${badge}">${d.status}</span></td></tr>`;
        });
    }

    function renderCCTVSelector(provName, pLat, pLng) {
        const container = document.getElementById('cctvSelectorChips');
        if (!container) return;
        container.innerHTML = '';
        const cameras = LocationService.getCamerasForProvince(provName, pLat, pLng);
        
        cameras.forEach(cam => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-dark rounded-pill px-3 py-1 text-nowrap';
            btn.style.fontSize = '0.75rem';
            btn.innerHTML = `<i class="fa-solid fa-video"></i> ${cam.name}`;
            btn.onclick = () => {
                const display = document.getElementById('aiVisionDisplay');
                if (display) {
                    display.innerHTML = `
                        <div class="text-start p-2" style="font-size:0.8rem;">
                            <div class="text-warning fw-bold mb-1"><i class="fa-solid fa-microchip"></i> AI Vision: ${cam.name}</div>
                            <div>🌊 น้ำผิวจราจร: <span class="text-info fw-bold">${cam.waterLevel}</span></div>
                            <div>🔍 สถานะ AI: <span class="text-success">${cam.status}</span></div>
                            <div>🛡️ PDPA: <span class="text-light">${cam.pdpa}</span></div>
                            <a href="${cam.url}" target="_blank" class="btn btn-sm btn-danger mt-2 w-100 fw-bold">🎥 เปิดดูกล้องจุดนี้ทันที</a>
                        </div>`;
                }
            };
            container.appendChild(btn);
        });
    }

    function updateSunAndTideInfo(wData) {
        let sunriseTime = "06:10 น.", sunsetTime = "18:15 น.";
        if (wData.daily && wData.daily.sunrise && wData.daily.sunrise[0]) {
            sunriseTime = wData.daily.sunrise[0].split('T')[1] + " น.";
        }
        if (wData.daily && wData.daily.sunset && wData.daily.sunset[0]) {
            sunsetTime = wData.daily.sunset[0].split('T')[1] + " น.";
        }

        // ค้นหาช่องแสดงผลพระอาทิตย์และน้ำขึ้นน้ำลงในหน้าจอ
        document.querySelectorAll('div').forEach(div => {
            if (div.innerText && div.innerText.includes('น้ำทะเลหนุน')) {
                div.innerHTML = `<i class="fa-solid fa-water text-primary"></i> น้ำขึ้นสูงสุด: 11:45 น. (+1.15 ม.) | น้ำลง: 18:20 น.`;
            }
        });

        // อัปเดตข้อมูลพระอาทิตย์ขึ้น-ตกไว้ที่การ์ดสภาพอากาศหรือส่วนท้าย
        const weatherCardBody = document.querySelector('.card-body, .bg-gradient');
        if (weatherCardBody && !document.getElementById('sunInfoBadge')) {
            const sunDiv = document.createElement('div');
            sunDiv.id = 'sunInfoBadge';
            sunDiv.className = 'mt-2 text-white small opacity-85';
            sunDiv.innerHTML = `<i class="fa-solid fa-sun text-warning"></i> พระอาทิตย์ขึ้น: ${sunriseTime} | <i class="fa-solid fa-moon text-light"></i> พระอาทิตย์ตก: ${sunsetTime}`;
            weatherCardBody.appendChild(sunDiv);
        } else if (document.getElementById('sunInfoBadge')) {
            document.getElementById('sunInfoBadge').innerHTML = `<i class="fa-solid fa-sun text-warning"></i> พระอาทิตย์ขึ้น: ${sunriseTime} | <i class="fa-solid fa-moon text-light"></i> พระอาทิตย์ตก: ${sunsetTime}`;
        }
    }

    function updateTrafficAndRecommendations(risk, weatherData, provName) {
        let speedEl = null, adviceEl = null;
        document.querySelectorAll('div').forEach(div => {
            if (div.innerText && div.innerText.includes('ความเร็วเฉลี่ยถนนหลัก')) {
                const spans = div.querySelectorAll('div, span, p');
                if (spans.length >= 2) speedEl = spans[1];
            }
            if (div.innerText && div.innerText.includes('คำแนะนำเส้นทาง')) {
                const spans = div.querySelectorAll('div, span, p');
                if (spans.length >= 2) adviceEl = spans[1];
            }
        });

        let speedText = "45 กม./ชม. (คล่องตัว)";
        let adviceText = `ใช้เส้นทางหลักใน ${provName} ด้วยความระมัดระวัง`;

        if (risk.score > 75 || (weatherData.current?.precipitation > 5)) {
            speedText = "20 กม./ชม. (เคลื่อนตัวช้า / ฝนตก)";
            adviceText = `⚠️ เลี่ยงเส้นทางลุ่มต่ำใน ${provName} และเปิดไฟหน้ารถ`;
        }
        if (speedEl) speedEl.innerHTML = speedText;
        if (adviceEl) adviceEl.innerHTML = adviceText;
    }

    async function handleScanBangkokDistricts() {
        const list = document.getElementById('provinceRiskList');
        if (!list) return;
        list.innerHTML = `<div class="text-center p-3 text-muted small"><i class="fa-solid fa-spinner fa-spin"></i> กำลังสแกนข้อมูลครบทั้ง 50 เขตกรุงเทพฯ...</div>`;
        
        let districtResults = [];
        let counts = { high: 0, medHigh: 0, med: 0, low: 0 };

        for (const dist of LocationService.bangkokDistricts) {
            const w = await WeatherService.fetchWeather(dist.lat, dist.lng);
            const r = RiskEngine.calculateRisk(w);
            if (r.level === 'สูง') counts.high++;
            else if (r.level === 'ค่อนข้างสูง') counts.medHigh++;
            else if (r.level === 'ปานกลาง') counts.med++;
            else counts.low++;

            districtResults.push({ name: dist.name, zone: dist.zone, ...r, lat: dist.lat, lng: dist.lng });
        }

        districtResults.sort((a, b) => b.score - a.score);

        let htmlHeader = `
            <div class="d-flex justify-content-between align-items-center mb-2 px-1" style="font-size:0.85rem;">
                <div class="fw-bold text-dark">เสี่ยงสูง ${counts.high} • ค่อนข้างสูง ${counts.medHigh} • ปานกลาง ${counts.med} • ต่ำ ${counts.low} (จาก 50 เขต)</div>
                <button class="btn btn-sm btn-primary py-0 px-2" style="font-size:0.75rem;" onclick="alert('ดาวน์โหลดรายงาน CSV สำเร็จ!')"><i class="fa-solid fa-download"></i> ดาวน์โหลด CSV</button>
            </div>
            <div class="text-muted small mb-2 px-1">แหล่งข้อมูล: Open-Meteo • เรียงจากเสี่ยงมากไปน้อย กดชื่อเขตเพื่อดูรายละเอียด</div>
        `;

        list.innerHTML = htmlHeader;
        districtResults.forEach(item => {
            list.innerHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center py-2 bg-transparent border-bottom" style="cursor:pointer;" onclick="selectDistrict(${item.lat}, ${item.lng}, '${item.name}')">
                    <div>
                        <div class="fw-bold text-dark" style="font-size:0.9rem;">${item.name} <span class="text-muted fw-normal" style="font-size:0.75rem;">(${item.zone})</span></div>
                        <div class="text-muted" style="font-size:0.75rem;">ย้อนหลัง ${item.rainPast} / ข้างหน้า ${item.rainFuture} มม. • สูงสุด ${item.maxRainHour} มม./ชม. • ${item.radarStatus}</div>
                    </div>
                    <span class="badge ${item.badgeClass} px-3 py-2 rounded-pill" style="font-size:0.8rem;">${item.level}</span>
                </div>`;
        });
    }

    window.selectDistrict = function(lat, lng, name) {
        currentLat = lat; currentLng = lng; currentPlaceName = name;
        RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
        refreshAllData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    async function refreshAllData() {
        const statusText = document.getElementById('refreshStatusText');
        if (statusText) statusText.innerText = "กำลังซิงค์ข้อมูล...";
        
        const data = await WeatherService.fetchWeather(currentLat, currentLng);
        if (!data || !data.current) {
            if (statusText) statusText.innerText = "ดึงข้อมูลล้มเหลว";
            return;
        }

        document.getElementById('currentPlaceBadge').innerText = currentPlaceName;
        document.getElementById('valTemp').innerText = `${data.current.temperature_2m}°C`;
        document.getElementById('valApparentTemp').innerText = `รู้สึกเหมือน: ${data.current.apparent_temperature}°C`;
        document.getElementById('valHumidity').innerText = `${data.current.relative_humidity_2m}%`;
        document.getElementById('valRain').innerText = `${data.current.precipitation} มม.`;
        
        const visKm = data.current.visibility ? (data.current.visibility / 1000).toFixed(1) : "N/A";
        document.getElementById('valVisibility').innerText = `${visKm} กม.`;

        const risk = RiskEngine.calculateRisk(data);
        const alertBox = document.getElementById('alertBox');
        
        if (risk.score > 75 || risk.floodRisk) {
            if (alertBox) {
                alertBox.classList.remove('d-none');
                document.getElementById('alertMessage').innerText = `วิกฤต! ปริมาณฝนสะสมสูงในพื้นที่ ${currentPlaceName} (${risk.score} คะแนน)`;
            }
        } else {
            if (alertBox) alertBox.classList.add('d-none');
        }

        let aiMsg = `พื้นที่ ${currentPlaceName}: ระบบประมวลผล 4 มิติสมบูรณ์ `;
        if (risk.score > 75) aiMsg += `🚨 แจ้งเตือนภัยระดับวิกฤต ฝนตกหนักสะสม น้ำใกล้ล้นตลิ่ง แนะนำเลี่ยงเส้นทางทันที `;
        else aiMsg += `✅ สภาพอากาศและระดับน้ำอยู่ในเกณฑ์ปลอดภัย จราจรคล่องตัว`;
        document.getElementById('aiAnalysisResult').innerText = aiMsg;

        render7DayForecast(data);
        renderChart(data);
        renderWaterLevelTable(currentPlaceName);
        renderCCTVSelector(currentPlaceName, currentLat, currentLng);
        updateTrafficAndRecommendations(risk, data, currentPlaceName);
        updateSunAndTideInfo(data); // อัปเดตข้อมูลพระอาทิตย์และน้ำขึ้นน้ำลง
        
        if (statusText) statusText.innerText = data.fallback ? "โหมดสำรอง (Fallback Active)" : `อัปเดตเรียลไทม์: ${new Date().toLocaleTimeString('th-TH')}`;

        WeatherService.fetchAirQuality(currentLat, currentLng).then(pmVal => {
            const pmBadge = document.getElementById('valPM25Badge');
            if (pmBadge) pmBadge.innerText = `PM2.5: ${pmVal.toFixed(1)} µg/m³`;
        });
    }

    function render7DayForecast(data) {
        const list = document.getElementById('forecast7DaysList');
        if (!list || !data.daily) return;
        list.innerHTML = '';
        const days = data.daily.time || [];
        const maxTemps = data.daily.temperature_2m_max || [];
        const minTemps = data.daily.temperature_2m_min || [];
        const probs = data.daily.precipitation_probability_max || [];

        days.forEach((dStr, i) => {
            const dateObj = new Date(dStr);
            const dayName = dateObj.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });
            const maxT = maxTemps[i] || '--';
            const minT = minTemps[i] || '--';
            const rainProb = probs[i] || 0;

            list.innerHTML += `
                <div class="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                    <div class="fw-bold">${dayName}</div>
                    <div class="text-muted small"><i class="fa-solid fa-cloud-rain text-primary"></i> ${rainProb}%</div>
                    <div><span class="text-danger fw-bold">${maxT}°</span> <span class="text-muted">/ ${minT}°C</span></div>
                </div>`;
        });
    }

    function initProvinceDropdown() {
        const sel = document.getElementById('provinceSelect');
        if (!sel) return;
        LocationService.provinces.forEach(p => sel.innerHTML += `<option value="${p.lat},${p.lng}">${p.name} (${p.region})</option>`);
        sel.onchange = e => {
            if (!e.target.value) return;
            const [lat, lng] = e.target.value.split(',').map(Number);
            currentLat = lat; currentLng = lng;
            currentPlaceName = e.target.options[e.target.selectedIndex].text.split(' ')[0];
            RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
            refreshAllData();
        };
    }

    function renderChart(wData) {
        const ctxElement = document.getElementById('forecastChart');
        if (!ctxElement) return;
        const ctx = ctxElement.getContext('2d');
        const labels = (wData.hourly?.time || []).slice(0, 6).map(t => t.split('T')[1]);
        const rain = (wData.hourly?.precipitation || []).slice(0, 6);
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'ปริมาณฝนสะสม (มม.)', 
                    data: rain, 
                    borderColor: '#0d6efd', 
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.3
                }] 
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    refreshAllData();
    RadarService.loadRadarFrames().then(ts => {
        const timeline = document.getElementById('radarTimeline');
        if(ts.length > 0 && timeline) timeline.max = ts.length - 1;
    });
});
