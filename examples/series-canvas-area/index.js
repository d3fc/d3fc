const data = fc.randomGeometricBrownianMotion().steps(1e4)(1);

const container = document.querySelector('d3fc-canvas');

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(extent(data));

const ctx = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('2d');

const series = fc
    .seriesCanvasArea()
    .xScale(xScale)
    .yScale(yScale)
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
