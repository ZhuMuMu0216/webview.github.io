document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = d3.csvParse(text);

        // 使用正确的列名
        const sumByYear = data.reduce((acc, row) => {
            const date = new Date(row['startDate']);  // 使用列名'startDate'提取日期
            const year = date.getFullYear();  // 从日期中提取年份
            const value = parseFloat(row['value']);  // 使用列名'value'提取数值
            if (!acc[year]) {
                acc[year] = 0;
            }
            acc[year] += value;  // 将值累加到对应年份
            return acc;
        }, {});

        console.log(sumByYear);
    };
    reader.readAsText(file);
});
