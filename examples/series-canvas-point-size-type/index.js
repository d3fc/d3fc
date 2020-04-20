const data = fc.randomGeometricBrownianMotion().steps(50)(1);

const container = document.querySelector('d3fc-canvas');
const symbols = [
    d3.symbolCircle,
    d3.symbolCross,
    d3.symbolDiamond,
    d3.symbolSquare,
    d3.symbolStar,
    d3.symbolTriangle,
    d3.symbolWye
];

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear()(data));

const series = fc
    .seriesCanvasPoint()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .size((_, i) => 30 + 10 * (i % 10))
    .type((_, i) => symbols[i % symbols.length]);

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
