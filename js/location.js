const LocationService = {
    provinces: [
        { name: "กรุงเทพมหานคร", region: "ภาคกลาง", lat: 13.7563, lng: 100.5018 },
        { name: "พัทลุง", region: "ภาคใต้", lat: 7.6167, lng: 100.0833 },
        { name: "สมุทรสาคร", region: "ภาคกลาง", lat: 13.5475, lng: 100.2744 },
        { name: "อุตรดิตถ์", region: "ภาคเหนือ", lat: 17.6201, lng: 100.0956 },
        { name: "เชียงใหม่", region: "ภาคเหนือ", lat: 18.7883, lng: 98.9853 },
        { name: "ขอนแก่น", region: "ภาคตะวันออกเฉียงเหนือ", lat: 16.4322, lng: 102.8236 },
        { name: "ชลบุรี", region: "ภาคตะวันออก", lat: 13.3611, lng: 100.9847 },
        { name: "สงขลา", region: "ภาคใต้", lat: 7.1988, lng: 100.5951 },
        { name: "ภูเก็ต", region: "ภาคใต้", lat: 7.8804, lng: 98.3923 }
    ],

    getCurrentGPS() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("เบราว์เซอร์ไม่รองรับ GPS"));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                err => reject(err),
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    },

    async searchLocation(query) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Thailand')}`);
            const data = await res.json();
            if (data && data.length > 0) {
                return {
                    name: data[0].display_name.split(',')[0],
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
            return null;
        } catch (e) {
            console.error("Location search failed", e);
            return null;
        }
    }
};
