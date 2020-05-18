const data = fc.randomFinancial()(100);

const xScale = d3
    .scaleTime()
    .domain(fc.extentDate().accessors([d => d.date])(data));

const yScale = d3
    .scaleLinear()
    .domain(fc.extentLinear().accessors([d => d.high, d => d.low])(data));

const candlestick = fc.seriesCanvasCandlestick().bandwidth(8);

const gridline = fc.annotationCanvasGridline();

const multi = fc.seriesCanvasMulti()
    .series([candlestick, gridline]);

const lowLine = fc
    .seriesSvgLine()
    .crossValue(d => d.date)
    .mainValue(d => d.low);

const chart = fc
    .chartCartesian(xScale, yScale)
    .canvasPlotArea(multi)
    .scaleDevicePixelRatio(true)
    .svgPlotArea(lowLine);

d3.select('#chart')
    .datum(data)
    .call(chart);
