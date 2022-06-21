const stream = fc.randomFinancial().stream();
const data = stream.take(110);

const yExtent = fc.extentLinear().accessors([d => d.high, d => d.low]);

const xExtent = fc.extentDate().accessors([d => d.date]);

const gridlines = fc.annotationSvgGridline();
const candlestick = fc.seriesSvgCandlestick();
const multi = fc.seriesSvgMulti().series([gridlines, candlestick]);

const chart = fc
    .chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi);

function renderChart() {
    data.push(stream.next());
    data.shift();

    chart.yDomain(yExtent(data)).xDomain(xExtent(data));

    d3.select('#chart')
        .datum(data)
        .call(chart);
}

renderChart();
setInterval(renderChart, 200);
