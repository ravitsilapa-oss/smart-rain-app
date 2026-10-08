// --- All System Services Bundled ---
const LocationService = {
    provinces: [
        { name: "กรุงเทพมหานคร", region: "ภาคกลาง", lat: 13.7563, lng: 100.5018 },
        { name: "มีนบุรี", region: "กรุงเทพฯ", lat: 13.8138, lng: 100.7201 },
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
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability,precipitation&past_hours=2&forecast_hours=6&timezone=Asia%2FBangkok`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("API Error");
            return await res.json();
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
        this.map = L.map(id).setView([lat, lng], 8);
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
        if (!w || !w.current) return { score: 0, level: 'ต่ำ', badgeClass: 'badge-risk-low', rainPast: 0, rainFuture: 0 };
        const rainCurr = w.current.precipitation || 0;
        const hum = w.current.relative_humidity_2m || 0;
        const futureRain = (w.hourly?.precipitation || []).slice(2, 5).reduce((a, b) => a + b, 0);

        let score = Math.round(Math.min((rainCurr * 15) + (futureRain * 10) + (hum > 80 ? 20 : hum * 0.1), 100));
        let level = 'ต่ำ', badgeClass = 'badge-risk-low';
        if (score > 80) { level = 'สูง'; badgeClass = 'badge-risk-high'; }
        else if (score > 60) { level = 'ค่อนข้างสูง'; badgeClass = 'badge-risk-medhigh'; }
        else if (score > 40) { level = 'ปานกลาง'; badgeClass = 'badge-risk-med'; }

        return { score, level, badgeClass, rainPast: rainCurr, rainFuture: futureRain };
    }
};

// --- Main Application Loop ---
document.addEventListener('DOMContentLoaded', async () => {
    let currentLat = 13.7563, currentLng = 100.5018, currentPlaceName = "กรุงเทพมหานคร";
    let chartInstance = null, isPlaying = false, scannedDataStore = [];

    RadarService.initMap('map', currentLat, currentLng);
    initProvinceDropdown();

    // Bind Controls
    document.getElementById('btnFetchLocation').onclick = () => {
        currentLat = parseFloat(document.getElementById('latInput').value) || currentLat;
        currentLng = parseFloat(document.getElementById('lngInput').value) || currentLng;
        currentPlaceName = `พิกัด (${currentLat.toFixed(2)}, ${currentLng.toFixed(2)})`;
        refreshAllData();
    };

    document.getElementById('btnGPS').onclick = async () => {
        try {
            document.getElementById('refreshStatusText').innerText = "กำลังดึงพิกัด GPS...";
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
        const msg = `🌧️ รายงานสภาพอากาศ: ${currentPlaceName}\nอุณหภูมิ: ${document.getElementById('valTemp').innerText}\nปริมาณฝน: ${document.getElementById('valRain').innerText}\nอัปเดต: ${new Date().toLocaleTimeString('th-TH')}`;
        window.open(`https://line.me/R/share?text=${encodeURIComponent(msg)}`, '_blank');
    };

    document.getElementById('btnExportCSV').onclick = () => {
        if (scannedDataStore.length === 0) return alert("กรุณากดสแกนพื้นที่ก่อน");
        let csv = "data:text/csv;charset=utf-8,\uFEFFพื้นที่,คะแนนเสี่ยง,ระดับ,ฝนปัจจุบัน\n";
        scannedDataStore.forEach(i => csv += `"${i.name}",${i.score},"${i.level}",${i.rainPast}\n`);
        const a = document.createElement('a'); a.href = encodeURI(csv); a.download = 'weather_report.csv'; a.click();
    };

    async function refreshAllData() {
        document.getElementById('refreshStatusText').innerText = "กำลังดึงข้อมูลสภาพอากาศ...";
        const data = await WeatherService.fetchWeather(currentLat, currentLng);
        if (!data || !data.current) {
            document.getElementById('refreshStatusText').innerText = "ดึงข้อมูลไม่สำเร็จ";
            return;
        }

        document.getElementById('valTemp').innerText = `${data.current.temperature_2m} °C`;
        document.getElementById('valHumidity').innerText = `${data.current.relative_humidity_2m} %`;
        document.getElementById('valRain').innerText = `${data.current.precipitation} มม./ชม.`;
        document.getElementById('valWindSpeed').innerText = `${data.current.wind_speed_10m} กม./ชม.`;
        document.getElementById('valWindDir').innerText = `${data.current.wind_direction_10m}°`;
        document.getElementById('valPressure').innerText = `${data.current.surface_pressure} hPa`;
        document.getElementById('valPop').innerText = `${data.hourly?.precipitation_probability?.[2] || 0} %`;

        const risk = RiskEngine.calculateRisk(data);
        document.getElementById('aiAnalysisResult').innerText = risk.score > 50 ? 
            `พื้นที่ ${currentPlaceName} มีความเสี่ยงฝนตก (${risk.score} คะแนน) ควรพกร่ม` : 
            `สภาพอากาศในพื้นที่ ${currentPlaceName} ปกติ มีแนวโน้มฝนตกน้อย`;

        renderChart(data);
        document.getElementById('refreshStatusText').innerText = `อัปเดตแล้ว: ${new Date().toLocaleTimeString('th-TH')}`;
    }

    async function handleScan() {
        const list = document.getElementById('provinceRiskList');
        list.innerHTML = `<div class="text-center p-3 text-muted">กำลังสแกนพื้นที่...</div>`;
        scannedDataStore = [];
        
        for (const prov of LocationService.provinces) {
            const w = await WeatherService.fetchWeather(prov.lat, prov.lng);
            const r = RiskEngine.calculateRisk(w);
            scannedDataStore.push({ name: prov.name, region: prov.region, score: r.score, level: r.level, badgeClass: r.badgeClass, rainPast: r.rainPast });
        }
        scannedDataStore.sort((a,b) => b.score - a.score);
        
        list.innerHTML = '';
        scannedDataStore.forEach(item => {
            list.innerHTML += `<div class="list-group-item d-flex justify-content-between align-items-center py-2">
                <div><b>${item.name}</b> <small class="text-muted">(${item.region})</small></div>
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

    // Auto Initial Trigger
    refreshAllData();
    RadarService.loadRadarFrames().then(ts => {
        if(ts.length > 0) document.getElementById('radarTimeline').max = ts.length - 1;
    });
});
