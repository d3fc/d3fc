const data = fc.randomGeometricBrownianMotion().steps(100)(1);

const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear()(data));

const ctx = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('2d');

const series = fc
    .seriesCanvasLine()
    .xScale(xScale)
    .yScale(yScale)
    .defined((_, i) => i % 20 !== 0)
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .context(ctx);

d3.select(container)
    .on('draw', () => {
        series(data);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
