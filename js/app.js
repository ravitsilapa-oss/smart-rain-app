// --- All System Services & APIs Integrated ---
const LocationService = {
    provinces: [
        { name: "กรุงเทพมหานคร", region: "ภาคกลาง", lat: 13.7563, lng: 100.5018 },
        { name: "มีนบุรี", region: "กรุงเทพฯ", lat: 13.8138, lng: 100.7201 },
        { name: "บางนา", region: "กรุงเทพฯ", lat: 13.6682, lng: 100.6140 },
        { name: "พัทลุง", region: "ภาคใต้", lat: 7.6167, lng: 100.0833 },
        { name: "สมุทรสาคร", region: "ภาคกลาง", lat: 13.5475, lng: 100.2744 },
        { name: "อุตรดิตถ์", region: "ภาคเหนือ", lat: 17.6201, lng: 100.0956 },
        { name: "เชียงใหม่", region: "ภาคเหนือ", lat: 18.7883, lng: 98.9853 },
        { name: "ขอนแก่น", region: "ภาคอีสาน", lat: 16.4322, lng: 102.8236 },
        { name: "ชลบุรี", region: "ภาคตะวันออก", lat: 13.3611, lng: 100.9847 },
        { name: "สงขลา", region: "ภาคใต้", lat: 7.1988, lng: 100.5951 },
        { name: "ภูเก็ต", region: "ภาคใต้", lat: 7.8804, lng: 98.3923 }
    ],
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
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Thailand')}`);
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,is_day&daily=sunrise,sunset,uv_index_max&hourly=precipitation_probability,precipitation&past_hours=2&forecast_hours=6&timezone=Asia%2FBangkok`;
            const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm2_5,european_aqi&timezone=Asia%2FBangkok`;
            
            const [wRes, aqRes] = await Promise.all([fetch(weatherUrl), fetch(aqUrl)]);
            const wData = await wRes.json();
            const aqData = await aqRes.json();

            return { ...wData, air_quality: aqData?.current || { pm2_5: 0, european_aqi: 0 } };
        } catch (e) { return null; }
    }
};

const RadarService = {
    map: null,
    radarLayers: [],
    timestamps: [],
    currentIndex: 0,
    intervalId: null,
    initMap(id, lat, lng) {
        if (this.map) return;
        this.map = L.map(id).setView([lat, lng], 9);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(this.map);
    },
    async loadRadarFrames() {
        try {
            const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
            const data = await res.json();
            const pastFrames = data.radar?.past || [];
            this.timestamps = pastFrames.map(f => f.time);
            this.radarLayers.forEach(l => this.map.removeLayer(l));
            this.radarLayers = [];
            pastFrames.forEach(frame => {
                const tileUrl = `${data.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
                const layer = L.tileLayer(tileUrl, { opacity: 0.6, zIndex: 100 });
                this.radarLayers.push(layer);
            });
            if (this.radarLayers.length > 0) this.showFrame(this.radarLayers.length - 1);
            return this.timestamps;
        } catch (e) {
            document.getElementById('radarNotice').innerText = "เรดาร์ปิดปรับปรุงชั่วคราว";
            return [];
        }
    },
    showFrame(index) {
        if (index < 0 || index >= this.radarLayers.length) return;
        this.radarLayers.forEach((layer, i) => {
            if (i === index) { if (!this.map.hasLayer(layer)) this.map.addLayer(layer); }
            else { if (this.map.hasLayer(layer)) this.map.removeLayer(layer); }
        });
        this.currentIndex = index;
        const d = new Date(this.timestamps[index] * 1000);
        document.getElementById('radarTimeLabel').innerText = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
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
        const hum = w.current.relative_humidity_2m || 0;
        const futureRain = (w.hourly?.precipitation || []).slice(2, 5).reduce((a, b) => a + b, 0);

        let score = Math.round(Math.min((rainCurr * 15) + (futureRain * 10) + (hum > 85 ? 25 : hum * 0.1), 100));
        let level = 'ต่ำ', badgeClass = 'bg-success';
        if (score > 75) { level = 'สูง'; badgeClass = 'bg-danger'; }
        else if (score > 55) { level = 'ค่อนข้างสูง'; badgeClass = 'bg-warning text-dark'; }
        else if (score > 35) { level = 'ปานกลาง'; badgeClass = 'bg-info text-dark'; }

        const floodRisk = (rainCurr > 10 || futureRain > 25);
        return { score, level, badgeClass, rainPast: rainCurr, rainFuture: futureRain, floodRisk };
    }
};

// --- Main Application Loop ---
document.addEventListener('DOMContentLoaded', async () => {
    let currentLat = 13.7563, currentLng = 100.5018, currentPlaceName = "กรุงเทพมหานคร";
    let chartInstance = null, isPlaying = false, scannedDataStore = [];

    RadarService.initMap('map', currentLat, currentLng);
    initProvinceDropdown();

    // Controls Handling
    document.getElementById('btnFetchLocation').onclick = () => {
        currentLat = parseFloat(document.getElementById('latInput').value) || currentLat;
        currentLng = parseFloat(document.getElementById('lngInput').value) || currentLng;
        currentPlaceName = `พิกัด (${currentLat.toFixed(2)}, ${currentLng.toFixed(2)})`;
        refreshAllData();
    };

    document.getElementById('btnGPS').onclick = async () => {
        try {
            document.getElementById('refreshStatusText').innerText = "กำลังดึง GPS...";
            const pos = await LocationService.getCurrentGPS();
            currentLat = pos.lat; currentLng = pos.lng;
            currentPlaceName = "ตำแหน่งปัจจุบัน";
            document.getElementById('latInput').value = currentLat;
            document.getElementById('lngInput').value = currentLng;
            RadarService.map.setView([currentLat, currentLng], 10);
            refreshAllData();
        } catch (e) { alert("GPS ไม่พร้อมใช้งาน: " + e.message); }
    };

    document.getElementById('btnSearch').onclick = async () => {
        const q = document.getElementById('searchInput').value.trim();
        if (!q) return;
        document.getElementById('refreshStatusText').innerText = "กำลังค้นหา...";
        const res = await LocationService.searchLocation(q);
        if (res) {
            currentLat = res.lat; currentLng = res.lng; currentPlaceName = res.name;
            document.getElementById('latInput').value = currentLat;
            document.getElementById('lngInput').value = currentLng;
            RadarService.map.setView([currentLat, currentLng], 10);
            refreshAllData();
        } else { alert("ไม่พบสถานที่"); }
    };

    document.getElementById('btnScan').onclick = handleScan;

    document.getElementById('btnPlayRadar').onclick = () => {
        const btn = document.getElementById('btnPlayRadar');
        if (isPlaying) {
            RadarService.stopAnimation();
            btn.innerText = "▶ เล่น";
        } else {
            RadarService.playAnimation(idx => document.getElementById('radarTimeline').value = idx);
            btn.innerText = "⏸ หยุด";
        }
        isPlaying = !isPlaying;
    };

    document.getElementById('btnShareLine').onclick = () => {
        const temp = document.getElementById('valTemp').innerText;
        const rain = document.getElementById('valRain').innerText;
        const pm25 = document.getElementById('valPM25').innerText;
        const msg = `🌧️ รายงานสภาพอากาศ & PM2.5: ${currentPlaceName}\n🌡️ อุณหภูมิ: ${temp}\n🌧️ ฝนตก: ${rain}\n😷 PM2.5: ${pm25}\n⏰ เวลา: ${new Date().toLocaleTimeString('th-TH')} น.`;
        window.open(`https://line.me/R/share?text=${encodeURIComponent(msg)}`, '_blank');
    };

    document.getElementById('btnExportCSV').onclick = () => {
        if (scannedDataStore.length === 0) return alert("กรุณากดสแกนพื้นที่ก่อน");
        let csv = "data:text/csv;charset=utf-8,\uFEFFพื้นที่,คะแนนเสี่ยง,ระดับ,ฝนปัจจุบัน,PM2.5\n";
        scannedDataStore.forEach(i => csv += `"${i.name}",${i.score},"${i.level}",${i.rainPast},${i.pm25}\n`);
        const a = document.createElement('a'); a.href = encodeURI(csv); a.download = 'weather_risk_report.csv'; a.click();
    };

    async function refreshAllData() {
        document.getElementById('refreshStatusText').innerText = "กำลังดึงข้อมูล...";
        const data = await WeatherService.fetchWeather(currentLat, currentLng);
        if (!data || !data.current) {
            document.getElementById('refreshStatusText').innerText = "ดึงข้อมูลไม่สำเร็จ";
            return;
        }

        // Weather Cards
        document.getElementById('valTemp').innerText = `${data.current.temperature_2m} °C`;
        document.getElementById('valHumidity').innerText = `${data.current.relative_humidity_2m} %`;
        document.getElementById('valRain').innerText = `${data.current.precipitation} มม.`;
        document.getElementById('valWindSpeed').innerText = `${data.current.wind_speed_10m} กม./ชม.`;
        
        // Air Quality & UV
        const pmVal = data.air_quality?.pm2_5 ? data.air_quality.pm2_5.toFixed(1) : "N/A";
        document.getElementById('valPM25').innerText = `${pmVal} µg/m³`;
        document.getElementById('valUV').innerText = data.daily?.uv_index_max?.[0] || "N/A";

        // Sunrise/Sunset
        if (data.daily?.sunrise?.[0]) {
            const sr = data.daily.sunrise[0].split('T')[1];
            const ss = data.daily.sunset[0].split('T')[1];
            document.getElementById('valSun').innerText = `${sr} / ${ss}`;
        }

        const risk = RiskEngine.calculateRisk(data);
        const alertBox = document.getElementById('alertBox');
        
        // Alert & Vibration Trigger
        if (risk.score > 60 || risk.floodRisk) {
            alertBox.classList.remove('d-none');
            document.getElementById('alertMessage').innerText = risk.floodRisk ? 
                `เสี่ยงน้ำท่วมขังในพื้นที่ ${currentPlaceName}! ปริมาณฝนสะสมสูง` : 
                `เฝ้าระวังฝนตกหนัก (${risk.score} คะแนน) ในพื้นที่ ${currentPlaceName}`;
            
            // Mobile Vibration Alert
            if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 400]);
        } else {
            alertBox.classList.add('d-none');
        }

        // AI Advice
        let aiMsg = `พื้นที่ ${currentPlaceName}: สภาพอากาศทั่วไปดี `;
        if (risk.score > 60) aiMsg += `⚠️ แนะนำพกร่ม/ชุดกันฝน เฝ้าระวังการจราจรติดขัด `;
        if (data.air_quality?.pm2_5 > 37.5) aiMsg += `😷 ค่า PM2.5 สูงเกินเกณฑ์ ควรสวมหน้ากากอนามัยเมื่อออกนอกบ้าน`;
        document.getElementById('aiAnalysisResult').innerText = aiMsg;

        renderChart(data);
        document.getElementById('refreshStatusText').innerText = `อัปเดตแล้ว: ${new Date().toLocaleTimeString('th-TH')}`;
    }

    async function handleScan() {
        const list = document.getElementById('provinceRiskList');
        list.innerHTML = `<div class="text-center p-3 text-muted">กำลังสแกนสภาพอากาศทั่วประเทศ...</div>`;
        scannedDataStore = [];
        
        for (const prov of LocationService.provinces) {
            const w = await WeatherService.fetchWeather(prov.lat, prov.lng);
            const r = RiskEngine.calculateRisk(w);
            const pm = w?.air_quality?.pm2_5 ? w.air_quality.pm2_5.toFixed(1) : 0;
            scannedDataStore.push({ name: prov.name, region: prov.region, score: r.score, level: r.level, badgeClass: r.badgeClass, rainPast: r.rainPast, pm25: pm });
        }
        scannedDataStore.sort((a,b) => b.score - a.score);
        
        list.innerHTML = '';
        scannedDataStore.forEach(item => {
            list.innerHTML += `<div class="list-group-item d-flex justify-content-between align-items-center py-2">
                <div><b>${item.name}</b> <small class="text-muted">(${item.region})</small>
                <div class="small text-secondary">ฝน: ${item.rainPast} มม. | PM2.5: ${item.pm25}</div></div>
                <span class="badge ${item.badgeClass} p-2">${item.score} ${item.level}</span>
            </div>`;
        });
    }

    function initProvinceDropdown() {
        const sel = document.getElementById('provinceSelect');
        LocationService.provinces.forEach(p => sel.innerHTML += `<option value="${p.lat},${p.lng}">${p.name} (${p.region})</option>`);
        sel.onchange = e => {
            if (!e.target.value) return;
            const [lat, lng] = e.target.value.split(',').map(Number);
            currentLat = lat; currentLng = lng;
            currentPlaceName = e.target.options[e.target.selectedIndex].text.split(' ')[0];
            document.getElementById('latInput').value = currentLat;
            document.getElementById('lngInput').value = currentLng;
            RadarService.map.setView([currentLat, currentLng], 9);
            refreshAllData();
        };
    }

    function renderChart(wData) {
        const ctx = document.getElementById('forecastChart').getContext('2d');
        const labels = (wData.hourly?.time || []).slice(0, 6).map(t => t.split('T')[1]);
        const rain = (wData.hourly?.precipitation || []).slice(0, 6);
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: [{ label: 'ปริมาณฝน (มม.)', data: rain, borderColor: '#0d6efd', fill: true }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    refreshAllData();
    RadarService.loadRadarFrames().then(ts => {
        if(ts.length > 0) document.getElementById('radarTimeline').max = ts.length - 1;
    });
});
        
