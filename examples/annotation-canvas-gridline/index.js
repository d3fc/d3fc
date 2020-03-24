const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const ctx = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('2d');

const gridline = fc
    .annotationCanvasGridline()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx);

d3.select(container)
    .on('draw', () => {
        gridline();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);
    });

container.requestRedraw();
