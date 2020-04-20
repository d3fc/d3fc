const dataGenerator = fc.randomGeometricBrownianMotion().steps(25);
const data = dataGenerator(1).map((datum, index) => {
    const result = {
        value: index
    };
    result.high = datum + Math.random();
    result.low = datum - Math.random();
    return result;
});

const container = document.querySelector('d3fc-canvas');

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain(extent.accessors([d => d.value])(data));

const yScale = d3
    .scaleLinear()
    .domain(extent.accessors([d => d.high, d => d.low])(data));

const series = fc
    .seriesCanvasErrorBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d.value)
    .highValue(d => d.high)
    .lowValue(d => d.low);

d3.select(container)
    .on('draw', () => {
        series(data);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);

        const ctx = container.querySelector('canvas').getContext('2d');
        series.context(ctx);
    });

container.requestRedraw();
