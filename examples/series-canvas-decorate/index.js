const data = fc.randomGeometricBrownianMotion().steps(50)(1);

const container = document.querySelector('d3fc-canvas');
const margin = 10;

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain([0, data.length]);

const yScale = d3.scaleLinear().domain(extent(data));

const ctx = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('2d');

const color = d3.scaleOrdinal(d3.schemeCategory10);

const series = fc
    .seriesCanvasBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .context(ctx)
    .decorate((context, _, index) => {
        context.fillStyle = color(index);
    });

d3.select(container)
    .on('draw', () => {
        series(data);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([margin, width - margin * 2]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
