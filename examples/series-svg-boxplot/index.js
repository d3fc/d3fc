const dataGenerator = fc.randomGeometricBrownianMotion().steps(50);
const data = dataGenerator().map((_, i) => {
    const result = {
        value: i
    };
    result.median = 10 + Math.random();
    result.upperQuartile = result.median + Math.random();
    result.lowerQuartile = result.median - Math.random();
    result.high = result.upperQuartile + Math.random();
    result.low = result.lowerQuartile - Math.random();
    return result;
});

const container = document.querySelector('d3fc-svg');

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain(extent.accessors([d => d.value])(data));

const yScale = d3
    .scaleLinear()
    .domain(extent.accessors([d => d.high, d => d.low])(data));

const series = fc
    .autoBandwidth(fc.seriesSvgBoxPlot())
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d.value)
    .medianValue(d => d.median)
    .upperQuartileValue(d => d.upperQuartile)
    .lowerQuartileValue(d => d.lowerQuartile)
    .highValue(d => d.high)
    .lowValue(d => d.low);

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(data)
            .call(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
