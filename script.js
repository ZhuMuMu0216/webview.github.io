// 此函数需根据实际数据结构实现
function processData(data, groupBy) {
    const formatTime = d3.timeParse("%Y-%m-%d");
  
    // 将原始数据转换为日期对象并分组
    let groupData = d3.groups(data, d => {
      let date = formatTime(d.startDate);
      return groupBy === 'year' ? date.getFullYear() : `${date.getFullYear()}-${date.getMonth() + 1}`;
    });
  
    // 将分组数据转换为可用于可视化的对象数组
    let processedData = groupData.map(group => {
      let total = group[1].reduce((sum, record) => sum + parseFloat(record.value), 0);
      return { group: group[0], total: total };
    });
  
    return processedData;
  }
  

  function visualizeData(processedData) {
    // 设定画布大小
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    // 清除现有的可视化内容
    d3.select("#vis").selectAll("*").remove();
  
    // 创建SVG画布
    const svg = d3.select("#vis")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // 设置X轴和Y轴的比例尺
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(processedData.map(d => d.group));
  
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(processedData, d => d.total)]);
  
    // 绘制X轴和Y轴
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // 绘制条形图
    svg.selectAll(".bar")
      .data(processedData)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.group))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.total))
        .attr("height", d => height - y(d.total));
  
    // 添加标题
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("Value vs Date Group");
  }
  

document.getElementById('csvFileInput')?.addEventListener('change', function(event) {
    processedData = event.target.files[0]; // 仅保存文件引用
});

document.getElementById('submitFile')?.addEventListener('click', function() {
    if (processedData) {
        // 将文件传递给 visualization.html
        sessionStorage.setItem('uploadedFile', processedData);
        window.location.href = 'visualization.html'; // 导航到可视化页面
    } else {
        alert('请先选择一个文件！');
    }
});

window.onload = function() {
    if (window.location.pathname.includes('visualization.html')) {
        const uploadedFile = sessionStorage.getItem('uploadedFile');
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const data = d3.csvParse(text);
                sessionStorage.setItem('processedData', JSON.stringify(data));
            };
            reader.readAsText(uploadedFile);
        }

        document.getElementById('groupYear')?.addEventListener('click', function() {
            const dataString = sessionStorage.getItem('processedData');
            if (dataString) {
                const data = JSON.parse(dataString);
                visualizeData(processData(data, 'year'));
            }
        });

        document.getElementById('groupMonth')?.addEventListener('click', function() {
            const dataString = sessionStorage.getItem('processedData');
            if (dataString) {
                const data = JSON.parse(dataString);
                visualizeData(processData(data, 'month'));
            }
        });
    }
};
