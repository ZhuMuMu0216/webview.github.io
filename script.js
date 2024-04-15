let processedData; // 用于在页面间传递数据的变量

// 数据处理函数
function processData(data, groupBy) {
    // 处理数据的逻辑...
    return processedData; // 返回处理后的数据
}

// 可视化函数，调用对应的处理函数
function visualizeData() {
    const dataString = sessionStorage.getItem('processedData');
    if (dataString) {
        const data = JSON.parse(dataString);
        sessionStorage.removeItem('processedData'); // 清理sessionStorage

        // 使用D3.js可视化数据
        // 你的D3.js可视化代码...
    }
}

// 处理文件上传并预处理数据
document.getElementById('csvFileInput')?.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        processedData = d3.csvParse(text); // 解析CSV文件
    };
    reader.readAsText(file);
});

// 添加按钮事件监听器
document.getElementById('groupYear')?.addEventListener('click', function() {
    const yearData = processData(processedData, 'year'); // 假设按年处理数据
    sessionStorage.setItem('processedData', JSON.stringify(yearData));
    window.open('visualization.html', '_blank');
});

document.getElementById('groupMonth')?.addEventListener('click', function() {
    const monthData = processData(processedData, 'month'); // 假设按月处理数据
    sessionStorage.setItem('processedData', JSON.stringify(monthData));
    window.open('visualization.html', '_blank');
});
