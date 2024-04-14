document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = d3.csvParse(text);

        const sumByYear = data.reduce((acc, row) => {
            const date = new Date(row['startDate']);  
            const year = date.getFullYear();  
            const value = parseFloat(row['value']);  
            if (!acc[year]) {
                acc[year] = 0;
            }
            acc[year] += value; 
            return acc;
        }, {});

        console.log(sumByYear);

        // 转换数据为D3可以处理的数组格式
        const dataArray = Object.keys(sumByYear).map(year => ({
            year: year,
            value: sumByYear[year]
        }));

        // 定义SVG尺寸和边距
        const margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // 选择容器元素并添加SVG元素
        const svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // 设置x和y比例尺
        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(dataArray.map(function(d) { return d.year; }));

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(dataArray, function(d) { return d.value; })]);

        // 添加x轴
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // 添加y轴
        svg.append("g")
            .call(d3.axisLeft(y));

        // 绘制条形图
        svg.selectAll(".bar")
            .data(dataArray)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });
    };
    reader.readAsText(file);
});
