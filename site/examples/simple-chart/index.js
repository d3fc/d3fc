/// <reference path="../../packages/d3fc/index.d.ts" />

const data = fc.randomFinancial()(50);

const yExtent = fc.extentLinear().accessors([d => d.high, d => d.low]);

const xExtent = fc.extentDate().accessors([d => d.date]);

const gridlines = fc.annotationSvgGridline();
const candlestick = fc.seriesSvgCandlestick();
const multi = fc.seriesSvgMulti().series([gridlines, candlestick]);

const chart = fc
    .chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .svgPlotArea(multi);

chart.xDomain(xExtent(data));
chart.yDomain(yExtent(data));

d3.select('#chart')
    .datum(data)
    .call(chart);
