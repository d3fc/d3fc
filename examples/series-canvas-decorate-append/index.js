const data = fc.randomGeometricBrownianMotion().steps(25)(1);

const container = document.querySelector('d3fc-canvas');
const margin = 25;

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(extent.pad([0.1, 0.1])(data));

const ctx = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('2d');

const series = fc
    .seriesCanvasPoint()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .context(ctx)
    .decorate((context, datum) => {
        context.textAlign = 'center';
        context.fillStyle = '#000';
        context.font = '15px Arial';
        context.fillText(d3.format('.3f')(datum), 0, -10);
        // reset the fill style for the point rendering
        context.fillStyle = '#999';
    });

d3.select(container)
    .on('draw', () => {
        series(data);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([margin, width - margin]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
