const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const gridline = fc
    .annotationCanvasGridline()
    .xScale(xScale)
    .yScale(yScale);

d3.select(container)
    .on('draw', () => {
        gridline();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);

        const ctx = container.querySelector('canvas').getContext('2d');
        gridline.context(ctx);
    });

container.requestRedraw();
