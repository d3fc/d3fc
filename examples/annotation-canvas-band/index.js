const data = [
    [0.1, 0.15],
    [0.2, 0.3],
    [0.4, 0.6],
    [0.8, 0.9]
];

const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const horizontalBand = fc
    .annotationCanvasBand()
    .xScale(xScale)
    .yScale(yScale)
    .fromValue(d => d[0])
    .toValue(d => d[1])
    .decorate(context => {
        context.fillStyle = 'rgba(102, 0, 204, 0.1)';
    });

const verticalBand = fc
    .annotationCanvasBand()
    .orient('vertical')
    .xScale(xScale)
    .yScale(yScale)
    .fromValue(d => d[0])
    .toValue(d => d[1])
    .decorate(context => {
        context.fillStyle = 'rgba(0, 204, 0, 0.1)';
    });

d3.select(container)
    .on('draw', () => {
        horizontalBand(data);
        verticalBand(data);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);

        const ctx = container.querySelector('canvas').getContext('2d');
        horizontalBand.context(ctx);
        verticalBand.context(ctx);
    });

container.requestRedraw();
