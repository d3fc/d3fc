const stream = fc.randomFinancial().stream();
const data = stream.take(110);

const yExtent = fc.extentLinear().accessors([d => d.high, d => d.low]);

const xExtent = fc.extentDate().accessors([d => d.date]);

const gridlines = fc.annotationSvgGridline();
const candlestick = fc.seriesSvgCandlestick();
const multi = fc.seriesSvgMulti().series([gridlines, candlestick]);

const xScale = d3.scaleTime();
const yScale = d3.scaleLinear();

const decorator = fc.interactiveDecorator(xScale, yScale);

const chart = fc
    .chartCartesian(xScale, yScale)
    .xDomain(xExtent(data))
    .yDomain(yExtent(data))
    .svgPlotArea(multi)
    .decorate(sel => {
        decorator(sel);

        sel.enter()
            .append('button')
            .text('reset zoom')
            .on('click', () => {
                decorator.yDomain([80, 120]).xDomain(xExtent(data));
                renderChart();
            });
    });

const renderChart = () => {
    d3.select('#chart')
        .datum(data)
        .call(chart);
};

renderChart();
