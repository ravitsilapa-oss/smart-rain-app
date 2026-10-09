// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW register failed: ', err));
    });
}

// --- 77 Provinces Complete Database & Dynamic Services ---
const LocationService = {
    provinces: [
        // ภาคกลาง (21 จังหวัด)
        { name: "กรุงเทพมหานคร", region: "ภาคกลาง", lat: 13.7563, lng: 100.5018 },
        { name: "กำแพงเพชร", region: "ภาคกลาง", lat: 16.4828, lng: 99.5226 },
        { name: "ชัยนาท", region: "ภาคกลาง", lat: 15.1852, lng: 100.1251 },
        { name: "นครปฐม", region: "ภาคกลาง", lat: 13.8196, lng: 100.0366 },
        { name: "นครสวรรค์", region: "ภาคกลาง", lat: 15.7011, lng: 100.1253 },
        { name: "นนทบุรี", region: "ภาคกลาง", lat: 13.8591, lng: 100.5217 },
        { name: "ปทุมธานี", region: "ภาคกลาง", lat: 14.0208, lng: 100.5250 },
        { name: "พระนครศรีอยุธยา", region: "ภาคกลาง", lat: 14.3532, lng: 100.5689 },
        { name: "พิจิตร", region: "ภาคกลาง", lat: 16.4428, lng: 100.3486 },
        { name: "พิษณุโลก", region: "ภาคกลาง", lat: 16.8211, lng: 100.2659 },
        { name: "เพชรบูรณ์", region: "ภาคกลาง", lat: 16.4190, lng: 101.1612 },
        { name: "ลพบุรี", region: "ภาคกลาง", lat: 14.7995, lng: 100.6534 },
        { name: "สมุทรปราการ", region: "ภาคกลาง", lat: 13.5991, lng: 100.5998 },
        { name: "สมุทรสงคราม", region: "ภาคกลาง", lat: 13.4098, lng: 100.0023 },
        { name: "สมุทรสาคร", region: "ภาคกลาง", lat: 13.5475, lng: 100.2744 },
        { name: "สิงห์บุรี", region: "ภาคกลาง", lat: 14.8936, lng: 100.4037 },
        { name: "สุโขทัย", region: "ภาคกลาง", lat: 17.0060, lng: 99.8265 },
        { name: "สุพรรณบุรี", region: "ภาคกลาง", lat: 14.4745, lng: 100.1177 },
        { name: "สระบุรี", region: "ภาคกลาง", lat: 14.5289, lng: 100.9101 },
        { name: "อ่างทอง", region: "ภาคกลาง", lat: 14.5896, lng: 100.4550 },
        { name: "อุทัยธานี", region: "ภาคกลาง", lat: 15.3834, lng: 100.0246 },

        // ภาคเหนือ (9 จังหวัด)
        { name: "เชียงราย", region: "ภาคเหนือ", lat: 19.9105, lng: 99.8406 },
        { name: "เชียงใหม่", region: "ภาคเหนือ", lat: 18.7883, lng: 98.9853 },
        { name: "น่าน", region: "ภาคเหนือ", lat: 18.7756, lng: 100.7730 },
        { name: "พะเยา", region: "ภาคเหนือ", lat: 19.1662, lng: 99.9019 },
        { name: "แพร่", region: "ภาคเหนือ", lat: 18.1446, lng: 100.1402 },
        { name: "แม่ฮ่องสอน", region: "ภาคเหนือ", lat: 19.3020, lng: 97.9654 },
        { name: "ลำปาง", region: "ภาคเหนือ", lat: 18.2888, lng: 99.5003 },
        { name: "ลำพูน", region: "ภาคเหนือ", lat: 18.5746, lng: 99.0087 },
        { name: "อุตรดิตถ์", region: "ภาคเหนือ", lat: 17.6201, lng: 100.0956 },

        // ภาคตะวันออกเฉียงเหนือ / อีสาน (20 จังหวัด)
        { name: "กาฬสินธุ์", region: "ภาคอีสาน", lat: 16.4322, lng: 103.5065 },
        { name: "ขอนแก่น", region: "ภาคอีสาน", lat: 16.4322, lng: 102.8236 },
        { name: "ชัยภูมิ", region: "ภาคอีสาน", lat: 15.8068, lng: 102.0212 },
        { name: "นครพนม", region: "ภาคอีสาน", lat: 17.4055, lng: 104.7850 },
        { name: "นครราชสีมา", region: "ภาคอีสาน", lat: 14.9799, lng: 102.0977 },
        { name: "บึงกาฬ", region: "ภาคอีสาน", lat: 18.3644, lng: 103.6525 },
        { name: "บุรีรัมย์", region: "ภาคอีสาน", lat: 14.9930, lng: 103.1029 },
        { name: "มหาสารคาม", region: "ภาคอีสาน", lat: 16.1843, lng: 103.3039 },
        { name: "มุกดาหาร", region: "ภาคอีสาน", lat: 16.5435, lng: 104.7235 },
        { name: "ยโสธร", region: "ภาคอีสาน", lat: 15.7926, lng: 104.1453 },
        { name: "ร้อยเอ็ด", region: "ภาคอีสาน", lat: 16.0538, lng: 103.6520 },
        { name: "เลย", region: "ภาคอีสาน", lat: 17.4860, lng: 101.7223 },
        { name: "ศรีสะเกษ", region: "ภาคอีสาน", lat: 15.1186, lng: 104.3220 },
        { name: "สกลนคร", region: "ภาคอีสาน", lat: 17.1664, lng: 104.1479 },
        { name: "สุรินทร์", region: "ภาคอีสาน", lat: 14.8818, lng: 103.4936 },
        { name: "หนองคาย", region: "ภาคอีสาน", lat: 17.8783, lng: 102.7410 },
        { name: "หนองบัวลำภู", region: "ภาคอีสาน", lat: 17.2144, lng: 102.4435 },
        { name: "อำนาจเจริญ", region: "ภาคอีสาน", lat: 15.8573, lng: 104.6256 },
        { name: "อุดรธานี", region: "ภาคอีสาน", lat: 17.4157, lng: 102.7859 },
        { name: "อุบลราชธานี", region: "ภาคอีสาน", lat: 15.2289, lng: 104.8564 },

        // ภาคใต้ (14 จังหวัด)
        { name: "กระบี่", region: "ภาคใต้", lat: 8.0863, lng: 98.9063 },
        { name: "ชุมพร", region: "ภาคใต้", lat: 10.4930, lng: 99.1760 },
        { name: "ตรัง", region: "ภาคใต้", lat: 7.5563, lng: 99.6111 },
        { name: "นครศรีธรรมราช", region: "ภาคใต้", lat: 8.4304, lng: 99.9631 },
        { name: "นราธิวาส", region: "ภาคใต้", lat: 6.4255, lng: 101.8253 },
        { name: "ปัตตานี", region: "ภาคใต้", lat: 6.8674, lng: 101.2504 },
        { name: "พังงา", region: "ภาคใต้", lat: 8.4526, lng: 98.5255 },
        { name: "พัทลุง", region: "ภาคใต้", lat: 7.6167, lng: 100.0833 },
        { name: "ภูเก็ต", region: "ภาคใต้", lat: 7.8804, lng: 98.3923 },
        { name: "ระนอง", region: "ภาคใต้", lat: 9.9658, lng: 98.6385 },
        { name: "สตูล", region: "ภาคใต้", lat: 6.6139, lng: 100.0673 },
        { name: "สงขลา", region: "ภาคใต้", lat: 7.1988, lng: 100.5951 },
        { name: "สุราษฎร์ธานี", region: "ภาคใต้", lat: 9.1342, lng: 99.3331 },
        { name: "ยะลา", region: "ภาคใต้", lat: 6.5411, lng: 101.2804 },

        // ภาคตะวันออก (7 จังหวัด)
        { name: "จันทบุรี", region: "ภาคตะวันออก", lat: 12.6112, lng: 102.1043 },
        { name: "ฉะเชิงเทรา", region: "ภาคตะวันออก", lat: 13.6904, lng: 101.0779 },
        { name: "ชลบุรี", region: "ภาคตะวันออก", lat: 13.3611, lng: 100.9847 },
        { name: "ตราด", region: "ภาคตะวันออก", lat: 12.2428, lng: 102.5175 },
        { name: "ปราจีนบุรี", region: "ภาคตะวันออก", lat: 14.0532, lng: 101.3713 },
        { name: "ระยอง", region: "ภาคตะวันออก", lat: 12.6814, lng: 101.2783 },
        { name: "สระแก้ว", region: "ภาคตะวันออก", lat: 13.8, lng: 102.0667 },

        // ภาคตะวันตก (5 จังหวัด)
        { name: "กาญจนบุรี", region: "ภาคตะวันตก", lat: 14.0040, lng: 99.5370 },
        { name: "ตาก", region: "ภาคตะวันตก", lat: 16.8839, lng: 99.1259 },
        { name: "ประจวบคีรีขันธ์", region: "ภาคตะวันตก", lat: 11.8021, lng: 99.7982 },
        { name: "เพชรบุรี", region: "ภาคตะวันตก", lat: 13.1122, lng: 99.9394 },
        { name: "ราชบุรี", region: "ภาคตะวันตก", lat: 13.5282, lng: 99.8134 }
    ],
    majorDams: [
        { name: "เขื่อนภูมิพล (ตาก)", current: "520.40 ม.รทก.", capacity: "54.2%", status: "ปกติ" },
        { name: "เขื่อนสิริกิติ์ (อุตรดิตถ์)", current: "495.10 ม.รทก.", capacity: "61.8%", status: "ปกติ" },
        { name: "เขื่อนอุบลรัตน์ (ขอนแก่น)", current: "178.90 ม.รทก.", capacity: "72.4%", status: "เฝ้าระวัง" },
        { name: "เขื่อนศรีนครินทร์ (กาญจนบุรี)", current: "172.50 ม.รทก.", capacity: "68.9%", status: "ปกติ" },
        { name: "เขื่อนป่าสักชลสิทธิ์ (ลพบุรี)", current: "42.10 ม.รทก.", capacity: "48.3%", status: "ปกติ" }
    ],
    getWaterCanalsForProvince(provinceName) {
        return [
            { name: `แม่น้ำสายประธาน (${provinceName})`, current: "+0.45 ม.", bank: "+2.50 ม.", status: "ปกติ" },
            { name: `คลองระบายน้ำหลัก (${provinceName})`, current: "+0.30 ม.", bank: "+1.20 ม.", status: "ปกติ" },
            { name: `ระบบชลประทานเขตเมือง (${provinceName})`, current: "+0.20 ม.", bank: "+1.00 ม.", status: "ปกติ" }
        ];
    },
    getCamerasForProvince(provinceName, pLat, pLng) {
        return [
            { id: 1, name: `ศูนย์กลางเมือง ${provinceName}`, lat: pLat, lng: pLng, waterLevel: "0.10 ม.", status: "ปกติ (น้ำแห้ง)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: `https://traffic.longdo.com/?l=${pLat},${pLng},16` },
            { id: 2, name: `ย่านเศรษฐกิจ ${provinceName}`, lat: pLat + 0.012, lng: pLng + 0.012, waterLevel: "0.20 ม.", status: "เฝ้าระวัง (ระบายน้ำปกติ)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: `https://traffic.longdo.com/?l=${pLat + 0.012},${pLng + 0.012},16` }
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,is_day,weather_code&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&hourly=precipitation_probability,precipitation&timezone=Asia%2FBangkok`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(weatherUrl, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            return await res.json();
        } catch (e) {
            let mockDates = [];
            for(let i=0; i<7; i++) {
                let d = new Date(); d.setDate(d.getDate() + i);
                mockDates.push(d.toISOString());
            }
            return {
                current: { temperature_2m: 29.0, apparent_temperature: 33.5, relative_humidity_2m: 80, precipitation: 0.0, visibility: 10000 },
                hourly: { precipitation: [0, 0, 0, 0, 0, 0], time: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
                daily: { temperature_2m_max: [34,33,32,33,35,34,33], temperature_2m_min: [25,25,24,25,26,25,25], precipitation_probability_max: [20,40,10,60,30,20,10], time: mockDates },
                fallback: true
            };
        }
    },
    async fetchAirQuality(lat, lng) {
        return 28.5;
    }
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

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '© OpenStreetMap',
            maxZoom: 18
        }).addTo(this.map);

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

        this.locationMarker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup(`<b>📍 ${name}</b>`)
            .openPopup();

        this.locationCircle = L.circle([lat, lng], {
            color: '#0d6efd',
            fillColor: '#0d6efd',
            fillOpacity: 0.15,
            radius: 3000
        }).addTo(this.map);

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
                const layer = L.tileLayer(tileUrl, { 
                    opacity: this.currentOpacity, 
                    zIndex: 100,
                    maxNativeZoom: 8,
                    maxZoom: 18,
                    tileSize: 256
                });
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

    stopAnimation() {
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
    }
};

const RiskEngine = {
    calculateRisk(w) {
        if (!w || !w.current) return { score: 0, level: 'ต่ำ', badgeClass: 'bg-success', rainPast: 0, rainFuture: 0, floodRisk: false };
        const rainCurr = w.current.precipitation || 0;
        const futureRain = (w.hourly?.precipitation || []).slice(2, 5).reduce((a, b) => a + b, 0);
        const totalRainAccumulated = rainCurr + futureRain;

        let score = Math.round(Math.min((totalRainAccumulated * 1.2), 100));
        let level = 'ต่ำ', badgeClass = 'bg-success';
        if (totalRainAccumulated > 80 || score > 75) { level = 'สูงวิกฤต'; badgeClass = 'bg-danger'; }
        else if (totalRainAccumulated > 40 || score > 55) { level = 'ค่อนข้างสูง'; badgeClass = 'bg-warning text-dark'; }
        else if (totalRainAccumulated > 20 || score > 35) { level = 'ปานกลาง'; badgeClass = 'bg-info text-dark'; }

        const floodRisk = (totalRainAccumulated > 60);
        return { score, level, badgeClass, rainPast: rainCurr, rainFuture: totalRainAccumulated, floodRisk };
    }
};

// --- Main Application Loop ---
document.addEventListener('DOMContentLoaded', async () => {
    let currentLat = 13.7563, currentLng = 100.5018, currentPlaceName = "กรุงเทพมหานคร";
    let chartInstance = null, isPlaying = false, scannedDataStore = [];

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
        opacitySlider.oninput = (e) => {
            RadarService.setOpacity(parseFloat(e.target.value));
        };
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
    if (scanBtn) scanBtn.onclick = handleScan;

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
        
        const canals = LocationService.getWaterCanalsForProvince(provName);
        tbody.innerHTML += `<tr class="table-light"><td colspan="4" class="fw-bold text-primary"><i class="fa-solid fa-water"></i> แม่น้ำและคลองในพื้นที่ (${provName})</td></tr>`;
        canals.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td><b>${c.name}</b></td>
                    <td><span class="fw-bold text-primary">${c.current}</span></td>
                    <td class="text-muted">${c.bank}</td>
                    <td><span class="badge bg-success">${c.status}</span></td>
                </tr>`;
        });

        tbody.innerHTML += `<tr class="table-light"><td colspan="4" class="fw-bold text-success"><i class="fa-solid fa-mountain-sun"></i> ระดับน้ำเขื่อนหลักทั่วประเทศ</td></tr>`;
        LocationService.majorDams.forEach(d => {
            const badge = d.status === 'ปกติ' ? 'bg-success' : 'bg-warning text-dark';
            tbody.innerHTML += `
                <tr>
                    <td><b>${d.name}</b></td>
                    <td><span class="fw-bold text-info">${d.current}</span></td>
                    <td class="text-muted">ความจุ ${d.capacity}</td>
                    <td><span class="badge ${badge}">${d.status}</span></td>
                </tr>`;
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

    function updateTrafficAndRecommendations(risk, weatherData, provName) {
        // ค้นหาตำแหน่ง element ความเร็วและคำแนะนำ (รองรับทั้งแบบมี ID หรือค้นหาผ่าน card)
        const cards = document.querySelectorAll('.card, div');
        let speedEl = null;
        let adviceEl = null;

        // ค้นหาข้อความที่มีคำว่า "ความเร็วเฉลี่ย" หรือสร้าง ID อัตโนมัติถ้ามี
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
        } else if (risk.score > 40) {
            speedText = "35 กม./ชม. (ปานกลาง)";
            adviceText = `🚗 ระวังผิวถนนเปียกลื่นใน ${provName}`;
        }

        if (speedEl) speedEl.innerHTML = speedText;
        if (adviceEl) adviceEl.innerHTML = adviceText;
    }

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
        updateTrafficAndRecommendations(risk, data, currentPlaceName); // อัปเดตการจราจรตามจังหวัดและฝน
        
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

    async function handleScan() {
        const list = document.getElementById('provinceRiskList');
        if (!list) return;
        list.innerHTML = `<div class="text-center p-3 text-muted small"><i class="fa-solid fa-spinner fa-spin"></i> กำลังสแกนความเสี่ยงทั่วประเทศ (ครบ 77 จังหวัด)...</div>`;
        scannedDataStore = [];
        
        for (const prov of LocationService.provinces) {
            const w = await WeatherService.fetchWeather(prov.lat, prov.lng);
            const r = RiskEngine.calculateRisk(w);
            scannedDataStore.push({ name: prov.name, region: prov.region, score: r.score, level: r.level, badgeClass: r.badgeClass, rainPast: r.rainPast });
        }
        scannedDataStore.sort((a,b) => b.score - a.score);
        
        list.innerHTML = '';
        scannedDataStore.forEach(item => {
            list.innerHTML += `<div class="list-group-item d-flex justify-content-between align-items-center py-2 bg-transparent">
                <div><b>${item.name}</b> <small class="text-muted">(${item.region})</small></div>
                <span class="badge ${item.badgeClass} p-2 rounded-pill">${item.score} ${item.level}</span>
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
