// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW register failed: ', err));
    });
}

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
    floodHotspots: [
        { name: "จุดเสี่ยงน้ำท่วม: ถนนรัชดาภิเษก (หน้าศาลอาญา)", lat: 13.8167, lng: 100.5753 },
        { name: "จุดเสี่ยงน้ำท่วม: ถนนแจ้งวัฒนะ (วงเวียนบางเขน)", lat: 13.8742, lng: 100.5971 },
        { name: "จุดเสี่ยงน้ำท่วม: ถนนสุขุมวิท (อุดมสุข-แบริ่ง)", lat: 13.6685, lng: 100.6095 },
        { name: "จุดเสี่ยงน้ำท่วม: ถนนพหลโยธิน (แยกเกษตร)", lat: 13.8402, lng: 100.5724 }
    ],
    cctvCameras: [
        { name: "กล้อง CCTV: แยกบางซื่อ / ประชาชื่น", lat: 13.8050, lng: 100.5300 },
        { name: "กล้อง CCTV: ห้าแยกลาดพร้าว", lat: 13.8130, lng: 100.5605 },
        { name: "กล้อง CCTV: แยกพญาไท / อนุสาวรีย์", lat: 13.7650, lng: 100.5380 },
        { name: "กล้อง CCTV: แยกพระราม 9", lat: 13.7578, lng: 100.5654 },
        { name: "กล้อง CCTV: แยกคลองเตย / สุขุมวิท", lat: 13.7200, lng: 100.5590 }
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,is_day&daily=sunrise,sunset,uv_index_max&hourly=precipitation_probability,precipitation&past_hours=2&forecast_hours=6&timezone=Asia%2FBangkok`;
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
    locationMarker: null,
    locationCircle: null,

    initMap(id, lat, lng) {
        if (this.map) return;
        this.map = L.map(id, { minZoom: 5, maxZoom: 18 }).setView([lat, lng], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '© OpenStreetMap',
            maxZoom: 18
        }).addTo(this.map);

        this.renderFloodHotspots();
        this.renderCCTVMarkers();
        this.updateLocationMarker(lat, lng, "ตำแหน่งปัจจุบัน");
    },

    renderFloodHotspots() {
        LocationService.floodHotspots.forEach(spot => {
            L.circle([spot.lat, spot.lng], {
                color: '#ff6b00',
                fillColor: '#ff6b00',
                fillOpacity: 0.3,
                radius: 1200
            }).addTo(this.map).bindPopup(`<b>⚠️ ${spot.name}</b><br>เฝ้าระวังน้ำท่วมขังเมื่อฝนตกหนัก`);
        });
    },

    renderCCTVMarkers() {
        LocationService.cctvCameras.forEach(cam => {
            const camIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#e6007e;color:white;padding:3px 6px;border-radius:12px;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.3);font-weight:bold;'>📷 กล้อง</div>",
                iconSize: [55, 25],
                iconAnchor: [27, 12]
            });

            L.marker([cam.lat, cam.lng], { icon: camIcon }).addTo(this.map)
                .bindPopup(`<b>📹 ${cam.name}</b><br><a href="https://traffic.longdo.com/" target="_blank" class="btn btn-sm btn-primary mt-1 text-white py-0 w-100">เปิดดูกล้องสด</a>`);
        });
    },

    updateLocationMarker(lat, lng, name) {
        if (!this.map) return;
        if (this.locationMarker) this.map.removeLayer(this.locationMarker);
        if (this.locationCircle) this.map.removeLayer(this.locationCircle);

        this.locationMarker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup(`<b>📍 ${name}</b><br>ละติจูด: ${lat.toFixed(4)}<br>ลองจิจูด: ${lng.toFixed(4)}`)
            .openPopup();

        this.locationCircle = L.circle([lat, lng], {
            color: '#ff0033',
            fillColor: '#ff0033',
            fillOpacity: 0.15,
            radius: 3000
        }).addTo(this.map);

        this.map.setView([lat, lng], 11);
        setTimeout(() => { this.map.invalidateSize(); }, 300);
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
                const layer = L.tileLayer(tileUrl, { 
                    opacity: 0.6, 
                    zIndex: 100,
                    maxNativeZoom: 8,
                    maxZoom: 18,
                    tileSize: 256
                });
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

function playSirenSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) { console.log("Audio not supported"); }
}

// --- Main Application Loop ---
document.addEventListener('DOMContentLoaded', async () => {
    let currentLat = 13.7563, currentLng = 100.5018, currentPlaceName = "กรุงเทพมหานคร";
    let chartInstance = null, isPlaying = false, scannedDataStore = [];
    let deferredPrompt = null;

    // Dark Mode Toggle
    document.getElementById('btnToggleDark').onclick = () => {
        document.body.classList.toggle('bg-dark');
        document.body.classList.toggle('text-white');
    };

    // PWA Install Prompt Handler
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const banner = document.getElementById('pwaInstallBanner');
        const btn = document.getElementById('btnInstallPWA');
        if (banner) banner.style.display = 'block';
        
        if (btn) {
            btn.onclick = () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(() => {
                        deferredPrompt = null;
                        if (banner) banner.style.display = 'none';
                    });
                }
            };
        }
    });

    RadarService.initMap('map', currentLat, currentLng);
    initProvinceDropdown();

    document.getElementById('btnFetchLocation').onclick = () => {
        currentLat = parseFloat(document.getElementById('latInput').value) || currentLat;
        currentLng = parseFloat(document.getElementById('lngInput').value) || currentLng;
        currentPlaceName = `พิกัด (${currentLat.toFixed(2)}, ${currentLng.toFixed(2)})`;
        RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
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
            RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
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
            RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
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

        const tempCurr = data.current.temperature_2m;
        const tempApp = data.current.apparent_temperature;
        document.getElementById('valTemp').innerText = `${tempCurr} °C (${tempApp} °C)`;
        document.getElementById('valHumidity').innerText = `${data.current.relative_humidity_2m} %`;
        document.getElementById('valRain').innerText = `${data.current.precipitation} มม.`;
        document.getElementById('valWindSpeed').innerText = `${data.current.wind_speed_10m} กม./ชม.`;
        
        const visKm = data.current.visibility ? (data.current.visibility / 1000).toFixed(1) : "N/A";
        document.getElementById('valVisibility').innerText = `${visKm} กม.`;

        const pmVal = data.air_quality?.pm2_5 ? data.air_quality.pm2_5.toFixed(1) : "N/A";
        document.getElementById('valPM25').innerText = `${pmVal} µg/m³`;

        if (data.daily?.sunrise?.[0]) {
            const sr = data.daily.sunrise[0].split('T')[1];
            const ss = data.daily.sunset[0].split('T')[1];
            document.getElementById('valSun').innerText = `${sr} / ${ss}`;
        }

        const risk = RiskEngine.calculateRisk(data);
        const alertBox = document.getElementById('alertBox');
        
        if (risk.score > 60 || risk.floodRisk) {
            alertBox.classList.remove('d-none');
            document.getElementById('alertMessage').innerText = risk.floodRisk ? 
                `เสี่ยงน้ำท่วมขังในพื้นที่ ${currentPlaceName}! ปริมาณฝนสะสมสูง` : 
                `เฝ้าระวังฝนตกหนัก (${risk.score} คะแนน) ในพื้นที่ ${currentPlaceName}`;
            
            playSirenSound();
            if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 400]);
        } else {
            alertBox.classList.add('d-none');
        }

        // AI Travel Advice (Traffic + Rain Warning)
        let aiMsg = `พื้นที่ ${currentPlaceName}: สภาพอากาศทั่วไปปกติ `;
        if (risk.score > 60 || data.current.precipitation > 2) {
            aiMsg += `⚠️ กำลังมีฝนตกหนักในพื้นที่ เสี่ยงรถติดและน้ำท่วมขัง ควรหลีกเลี่ยงถนนสายหลักและใช้เส้นทางเลี่ยงเมือง `;
        }
        if (data.air_quality?.pm2_5 > 37.5) aiMsg += `😷 ค่า PM2.5 สูง ควรสวมหน้ากากอนามัย `;
        if (data.current.visibility < 3000) aiMsg += ` 🚗 ทัศนวิสัยต่ำเนื่องจากฝน/หมอก เปิดไฟหน้ารถด้วยความระมัดระวัง`;
        
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
            RadarService.updateLocationMarker(currentLat, currentLng, currentPlaceName);
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
        if(ts.length > 0) document.getElementById('radarTimeline'].max = ts.length - 1;
    });
});
