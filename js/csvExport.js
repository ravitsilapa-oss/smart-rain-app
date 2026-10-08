const CSVExportService = {
    exportProvincesCSV(provinceDataList) {
        if (!provinceDataList || provinceDataList.length === 0) return;

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "จังหวัด,ภาค,ละติจูด,ลองจิจูด,คะแนนความเสี่ยง,ระดับ,ฝนปัจจุบัน(มม),ฝนคาดการณ์(มม)\n";

        provinceDataList.forEach(item => {
            csvContent += `"${item.name}","${item.region}",${item.lat},${item.lng},${item.score},"${item.level}",${item.rainPast},${item.rainFuture}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rain_report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
