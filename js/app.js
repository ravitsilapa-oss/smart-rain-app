// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW register failed: ', err));
    });
}

// --- 4 Dimensions Core Services ---
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
        { id: 1, name: "แยกบางซื่อ / ประชาชื่น", lat: 13.8050, lng: 100.5300, waterLevel: "0.15 ม.", status: "ปกติ (น้ำแห้ง)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: "https://traffic.longdo.com/?l=13.8050,100.5300,16" },
        { id: 2, name: "ห้าแยกลาดพร้าว", lat: 13.8130, lng: 100.5605, waterLevel: "0.35 ม.", status: "เฝ้าระวัง (ขังรอระบาย)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: "https://traffic.longdo.com/?l=13.8130,100.5605,16" },
        { id: 3, name: "แยกพญาไท", lat: 13.7650, lng: 100.5380, waterLevel: "0.05 ม.", status: "ปกติ (น้ำแห้ง)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: "https://traffic.longdo.com/?l=13.7650,100.5380,16" },
        { id: 4, name: "แยกพระราม 9", lat: 13.7578, lng: 100.5654, waterLevel: "0.40 ม.", status: "วิกฤต (น้ำท่วมขังผิวถนน)", pdpa: "เบลอใบหน้า/ทะเบียนรถเรียบร้อย", url: "https://traffic.longdo.com/?l=13.7578,100.5654,16" }
    ],
    waterCanals: [
        { name: "คลองแสนแสบ (สะพานผ่านฟ้า)", current: "+0.45 ม.", bank: "+1.20 ม.", status: "ปกติ" },
        { name: "คลองลาดพร้าว (อุโมงค์ระบายน้ำ)", current: "+0.85 ม.", bank: "+1.50 ม.", status: "ปกติ" },
        { name: "คลองเปรมประชากร (บางซื่อ)", current: "+1.10 ม.", bank: "+1.20 ม.", status: "เฝ้าระวังใกล้ล้น" },
        { name: "คลองประเวศบุรีรมย์", current: "+0.30 ม.", bank: "+1.00 ม.", status: "ปกติ" }
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,is_day,weather_code&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&hourly=precipitation_probability,precipitation&timezone=Asia%2FBangkok`;
            const res = await fetch(weatherUrl);
            return await res.json();
        } catch (e) { return null; }
    },
    async fetchAirQuality(lat, lng) {
        try {
            const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm2_5&timezone=Asia%2FBangkok`;
            const res = await fetch(aqUrl);
            const data = await res.json();
            return data?.current?.pm2_5 || 25.0;
        } catch (e) { return 25.0; }
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

        this.renderFloodHotspots();
        this.renderCCTVMarkers();
        this.updateLocationMarker(lat, lng, "ตำแหน่งบัญชาการ");
    },

    setOpacity(opacity) {
        this.currentOpacity = opacity;
        this.radarLayers.forEach(l => l.setOpacity(opacity));
    },

    renderFloodHotspots() {
        if (!this.map) return;
        LocationService.floodHotspots.forEach(spot => {
            L.circle([spot.lat, spot.lng], {
                color: '#ff6b00',
                fillColor: '#ff6b00',
                fillOpacity: 0.3,
                radius: 1200
            }).addTo(this.map).bindPopup(`<b>⚠️ ${spot.name}</b><br>จุดเสี่ยงน้ำท่วมสะสม`);
        });
    },

    renderCCTVMarkers() {
        if (!this.map) return;
        LocationService.cctvCameras.forEach(cam => {
            const camIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style='background-color:#dc3545;color:white;padding:3px 6px;border-radius:12px;font-size:11px;box-shadow:0 2px 4px rgba(0,0,0,0.3);font-weight:bold;'>📷 CCTV #${cam.id}</div>`,
                iconSize: [65, 25],
                iconAnchor: [32, 12]
            });

            L.marker([cam.lat, cam.lng], { icon: camIcon }).addTo(this.map)
                .bindPopup(`<b>📹 ${cam.name}</b><br>สถานะ: ${cam.status}<br>น้ำสูง: ${cam.waterLevel}<br><a href="${cam.url}" target="_blank" class="btn btn-sm btn-primary mt-1 text-white py-0 w-100">เปิดดูกล้องสด</a>`);
        });
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
            const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
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
    renderWaterLevelTable();
    renderCCTVSelector();

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

    function renderWaterLevelTable() {
        const tbody = document.getElementById('waterLevelTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        LocationService.waterCanals.forEach(c => {
            const badge = c.status === 'ปกติ' ? 'bg-success' : 'bg-warning text-dark';
            tbody.innerHTML += `
                <tr>
                    <td><b>${c.name}</b></td>
                    <td><span class="fw-bold text-primary">${c.current}</span></td>
                    <td class="text-muted">${c.bank}</td>
                    <td><span class="badge ${badge}">${c.status}</span></td>
                </tr>`;
        });
    }

    function renderCCTVSelector() {
        const container = document.getElementById('cctvSelectorChips');
        if (!container) return;
        container.innerHTML = '';
        LocationService.cctvCameras.forEach(cam => {
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
        else aiMsg += `✅ สภาพอากาศและระดับน้ำอยู่
