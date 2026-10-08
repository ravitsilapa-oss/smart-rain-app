document.addEventListener('DOMContentLoaded', async () => {
    let currentLat = 13.7563;
    let currentLng = 100.5018;
    let currentPlaceName = "กรุงเทพมหานคร";
    let chartInstance = null;
    let isPlaying = false;
    let scannedDataStore = [];
    let autoRefreshTimer = null;

    // 1. Safe Init Map
    try {
        if (typeof RadarService !== 'undefined' && RadarService.initMap) {
            RadarService.initMap('map', currentLat, currentLng);
        }
    } catch(e) {
        console.error("Map Init Failed", e);
    }

    initProvinceDropdown();

    // 2. Initial Data Fetch for main location
    await refreshAllData();
    
    // 3. Setup Radar async
    setupRadarTimeline().catch(e => console.error("Radar Setup Error", e));

    // Event Listeners
    document.getElementById('btnGPS').addEventListener('click', handleGPS);
    document.getElementById('btnSearch').addEventListener('click', handleSearch);
    document.getElementById('btnFetchLocation').addEventListener('click', handleManualFetch);
    document.getElementById('btnScan').addEventListener('click', handleScanScope);
    document.getElementById('btnPlayRadar').addEventListener('click', toggleRadarAnimation);
    
    document.getElementById('radarTimeline').addEventListener('input', (e) => {
        if (typeof RadarService !== 'undefined') {
            RadarService.stopAnimation();
            isPlaying = false;
            document.getElementById('btnPlayRadar').innerText = "▶ เล่น";
            RadarService.showFrame(parseInt(e.target.value));
        }
    });

    document.getElementById('btnShareLine').addEventListener('click', () => {
        const lastData = scannedDataStore[0]?.weatherData;
        const lastRisk = scannedDataStore[0]?.risk || { score: 0, level: 'ปกติ' };
        const aiText = document.getElementById('aiAnalysisResult').innerText;
        LineShareService.shareReport(currentPlaceName, lastData, lastRisk, aiText);
    });

    document.getElementById('btnExportCSV').addEventListener('click', () => {
        if (scannedDataStore.length === 0) {
            alert("กรุณากด 'สแกนพื้นที่' ก่อนดาวน์โหลด CSV");
            return;
        }
        CSVExportService.exportProvincesCSV(scannedDataStore);
    });

    document.getElementById('autoRefreshCheck').addEventListener('change', setupAutoRefresh);
    document.getElementById('refreshInterval').addEventListener('change', setupAutoRefresh);
    setupAutoRefresh();

    function initProvinceDropdown() {
        const select = document.getElementById('provinceSelect');
        if (!select || typeof LocationService === 'undefined') return;
        LocationService.provinces.forEach(p => {
            const opt = document.createElement('option');
            opt.value = `${p.lat},${p.lng}`;
            opt.innerText = `${p.name} (${p.region})`;
            select.appendChild(opt);
        });
        select.addEventListener('change', (e) => {
            if (!e.target.value) return;
            const [lat, lng] = e.target.value.split(',').map(Number);
            const prov = LocationService.provinces.find(p => p.lat === lat && p.lng === lng);
            currentLat = lat; currentLng = lng;
            currentPlaceName = prov ? prov.name : "พื้นที่เลือก";
            updateLocationInputs();
            refreshAllData();
        });
    }

    function updateLocationInputs() {
        document.getElementById('latInput').value = currentLat;
        document.getElementById('lngInput').value = currentLng;
        if (typeof RadarService !== 'undefined' && RadarService.map) {
            RadarService.map.setView([currentLat, currentLng], 9);
        }
    }

    async function handleGPS() {
        try {
            const pos = await LocationService.getCurrentGPS();
            currentLat = pos.lat;
            currentLng = pos.lng;
            currentPlaceName = "ตำแหน่งปัจจุบัน";
            updateLocationInputs();
            refreshAllData();
        } catch (e) {
            alert("ไม่สามารถดึงพิกัด GPS ได้: " + e.message);
        }
    }

    async function handleSearch() {
        const q = document.getElementById('searchInput').value.trim();
        if (!q) return;
        const res = await LocationService.searchLocation(q);
        if (res) {
            currentLat = res.lat;
            currentLng = res.lng;
            currentPlaceName = res.name;
            updateLocationInputs();
            refreshAllData();
        } else {
            alert("ไม่พบสถานที่ดังกล่าว");
        }
    }

    function handleManualFetch() {
        currentLat = parseFloat(document.getElementById('latInput').value) || currentLat;
        currentLng = parseFloat(document.getElementById('lngInput').value) || currentLng;
        currentPlaceName = `พิกัด (${currentLat.toFixed(2)}, ${currentLng.toFixed(2)})`;
        refreshAllData();
    }

    async function refreshAllData() {
        if (typeof WeatherService === 'undefined') return;
        
        const data = await WeatherService.fetchWeather(currentLat, currentLng);
        if (!data || !data.current) {
            document.getElementById('refreshStatusText').innerText = "ไม่สามารถโหลดข้อมูลสภาพอากาศได้";
            return;
        }

        document.getElementById('valTemp').innerText = `${data.current.temperature_2m} °C`;
        document.getElementById('valHumidity').innerText = `${data.current.relative_humidity_2m} %`;
        document.getElementById('valRain').innerText = `${data.current.precipitation} มม./ชม.`;
        document.getElementById('valWindSpeed').innerText = `${data.current.wind_speed_10m} กม./ชม.`;
        document.getElementById('valWindDir').innerText = `${data.current.wind_direction_10m}°`;
        document.getElementById('valPressure').innerText = `${data.current.surface_pressure} hPa`;

        const pop = data.hourly?.precipitation_probability?.[2] || 0;
        document.getElementById('valPop').innerText = `${pop} %`;

        const risk = RiskEngine.calculateRisk(data);
        const aiInsight = AIAnalysis.generateInsight(data, risk);
        document.getElementById('aiAnalysisResult').innerText = aiInsight;

        const alertBox = document.getElementById('alertBox');
        if (risk.score > 60) {
            alertBox.classList.remove('d-none');
            document.getElementById('alertMessage').innerText = `พบความเสี่ยงฝนตกหนัก (${risk.score} คะแนน) ในพื้นที่ ${currentPlaceName}`;
        } else {
            alertBox.classList.add('d-none');
        }

        renderChart(data);
        
        const now = new Date();
        const interval = parseInt(document.getElementById('refreshInterval').value);
        const next = new Date(now.getTime() + interval * 60000);
        document.getElementById('refreshStatusText').innerText = 
            `อัปเดตล่าสุด: ${now.toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})} น. | รอบถัดไป: ${next.toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})} น.`;
    }

    async function handleScanScope() {
        const scope = document.getElementById('scanScope').value;
        const listContainer = document.getElementById('provinceRiskList');
        listContainer.innerHTML = `<div class="text-center p-3 text-muted">กำลังสแกนสภาพอากาศ...</div>`;

        if (scope === 'point') {
            const wData = await WeatherService.fetchWeather(currentLat, currentLng);
            const risk = RiskEngine.calculateRisk(wData);
            scannedDataStore = [{
                name: currentPlaceName, region: "พื้นที่ปัจจุบัน", lat: currentLat, lng: currentLng,
                score: risk.score, level: risk.level, badgeClass: risk.badgeClass,
                rainPast: risk.rainPast, rainFuture: risk.rainFuture, weatherData: wData, risk: risk
            }];
        } else {
            scannedDataStore = [];
            for (const prov of LocationService.provinces) {
                const wData = await WeatherService.fetchWeather(prov.lat, prov.lng);
                const risk = RiskEngine.calculateRisk(wData);
                scannedDataStore.push({
                    name: prov.name, region: prov.region, lat: prov.lat, lng: prov.lng,
                    score: risk.score, level: risk.level, badgeClass: risk.badgeClass,
                    rainPast: risk.rainPast, rainFuture: risk.rainFuture, weatherData: wData, risk: risk
                });
            }
            scannedDataStore.sort((a, b) => b.score - a.score);
        }

        renderRiskList(scannedDataStore);
    }

    function renderRiskList(items) {
        const listContainer = document.getElementById('provinceRiskList');
        listContainer.innerHTML = '';
        let counts = { high: 0, medHigh: 0, med: 0, low: 0 };

        items.forEach(item => {
            if (item.score > 80) counts.high++;
            else if (item.score > 60) counts.medHigh++;
            else if (item.score > 40) counts.med++;
            else counts.low++;

            const elem = document.createElement('div');
            elem.className = "list-group-item d-flex justify-content-between align-items-center py-2";
            elem.innerHTML = `
                <div>
                    <div class="fw-bold">พื้นที่: ${item.name} <span class="text-muted small">(${item.region})</span></div>
                    <div class="small text-muted">ฝนปัจจุบัน ${item.rainPast} มม. | พยากรณ์ ${item.rainFuture.toFixed(1)} มม.</div>
                </div>
                <span class="badge ${item.badgeClass} p-2">${item.score} ${item.level}</span>
            `;
            listContainer.appendChild(elem);
        });

        document.getElementById('countHigh').innerText = counts.high;
        document.getElementById('countMedHigh').innerText = counts.medHigh;
        document.getElementById('countMed').innerText = counts.med;
        document.getElementById('countLow').innerText = counts.low;
    }

    async function setupRadarTimeline() {
        if (typeof RadarService === 'undefined') return;
        const timestamps = await RadarService.loadRadarFrames();
        const slider = document.getElementById('radarTimeline');
        if (timestamps && timestamps.length > 0) {
            slider.max = timestamps.length - 1;
            slider.value = timestamps.length - 1;
        }
    }

    function toggleRadarAnimation() {
        if (typeof RadarService === 'undefined') return;
        const btn = document.getElementById('btnPlayRadar');
        if (isPlaying) {
            RadarService.stopAnimation();
            btn.innerText = "▶ เล่น";
        } else {
            RadarService.playAnimation((idx) => {
                document.getElementById('radarTimeline').value = idx;
            });
            btn.innerText = "⏸ หยุด";
        }
        isPlaying = !isPlaying;
    }

    function renderChart(weatherData) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('forecastChart').getContext('2d');
        const hourly = weatherData.hourly || {};
        const labels = (hourly.time || []).slice(0, 8).map(t => t.split('T')[1]);
        const rainVals = (hourly.precipitation || []).slice(0, 8);

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'ปริมาณฝน (มม.)',
                    data: rainVals,
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    function setupAutoRefresh() {
        if (autoRefreshTimer) clearInterval(autoRefreshTimer);
        const isAuto = document.getElementById('autoRefreshCheck').checked;
        if (isAuto) {
            const minutes = parseInt(document.getElementById('refreshInterval').value);
            autoRefreshTimer = setInterval(() => {
                refreshAllData();
            }, minutes * 60000);
        }
    }
});
