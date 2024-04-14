let processedData; // 全局变量来存储处理后的数据

// 用于处理数据并生成条形图的函数
function groupAndVisualize(data, groupBy) {
    // 首先清除之前的可视化
    d3.select("#vis").selectAll("*").remove();

    // 处理数据，分组依据是年还是月
    const sumByGroup = data.reduce((acc, row) => {
        const date = new Date(row['startDate']);
        const group = groupBy === 'year' ? date.getFullYear() : `${date.getFullYear()}-${date.getMonth() + 1}`;
        const value = parseFloat(row['value']);
        acc[group] = (acc[group] || 0) + value;
        return acc;
    }, {});

    // 转换数据为数组格式
    const dataArray = Object.entries(sumByGroup).map(([key, value]) => ({
        group: key,
        value: value
    }));

    // 设置SVG尺寸和边距
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // 创建SVG容器
    const svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 设置x和y比例尺
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(dataArray.map(d => d.group));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(dataArray, d => d.value)]);

    // 添加x轴
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll(".axis-label")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // 添加y轴
    svg.append("g")
        .call(d3.axisLeft(y));

    // 绘制条形图
    svg.selectAll(".bar")
        .data(dataArray)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.group))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value));
}

// 为YEAR和MONTH按钮添加事件监听器
document.getElementById('groupYear').addEventListener('click', () => {
    groupAndVisualize(processedData, 'year');
});
document.getElementById('groupMonth').addEventListener('click', () => {
    groupAndVisualize(processedData, 'month');
});

// 处理文件上传
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        processedData = d3.csvParse(text); // 存储处理后的数据以供按钮使用
    };
    reader.readAsText(file);
});
