const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const horizontalLine = fc
    .annotationCanvasLine()
    .xScale(xScale)
    .yScale(yScale)
    .decorate(context => {
        context.fillStyle = 'rgba(204, 0, 0, 0.7)';
        context.strokeStyle = '#c60';
    });

const verticalLine = fc
    .annotationCanvasLine()
    .orient('vertical')
    .xScale(xScale)
    .yScale(yScale)
    .decorate(context => {
        context.fillStyle = 'rgba(204, 0, 0, 0.7)';
        context.strokeStyle = '#06c';
    });

d3.select(container)
    .on('draw', () => {
        horizontalLine([0.15, 0.85]);
        verticalLine([0.2, 0.4, 0.6, 0.8]);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);

        const ctx = container.querySelector('canvas').getContext('2d');
        horizontalLine.context(ctx);
        verticalLine.context(ctx);
    });

container.requestRedraw();
