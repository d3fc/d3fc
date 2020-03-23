const data = [{ x: 450, y: 450 }];

const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const format = d3.format('.2f');

const canvas = d3
    .select(container)
    .select('canvas')
    .node();
const ctx = canvas.getContext('2d');

const crosshair = fc
    .annotationCanvasCrosshair()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .xLabel(d => format(xScale.invert(d.x)))
    .yLabel(d => format(yScale.invert(d.y)))
    .xDecorate(context => {
        context.strokeStyle = 'rgba(204, 0, 0, 0.25)';
    })
    .yDecorate(context => {
        context.strokeStyle = 'rgba(204, 0, 0, 0.25)';
    })
    .decorate(context => {
        context.strokeStyle = 'rgba(204, 0, 0, 0.25)';
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.scale(95, 95);
    });

d3.select(container)
    .on('draw', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        crosshair(data);
        canvas.onmousemove = ({ offsetX, offsetY }) => {
            data[0] = { x: offsetX, y: offsetY };
            container.requestRedraw();
        };
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);
    });

container.requestRedraw();
