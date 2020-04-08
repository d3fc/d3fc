const randomNormal = d3.randomNormal(0, 1);

const data = Array.from({ length: 1e4 }, () => ({
    x: randomNormal(),
    y: randomNormal()
}));

const xScale = d3.scaleLinear().domain([-5, 5]);

const yScale = d3.scaleLinear().domain([-5, 5]);

const container = document.querySelector('d3fc-canvas');

const series = fc
    .seriesWebglPoint()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .defined(() => true)
    .equals((previousData, data) => previousData.length > 0);

let pixels = null;
let frame = 0;
let gl = null;

d3.select(container)
    .on('click', () => {
        const domain = xScale.domain();
        const max = domain[1] / 2;
        xScale.domain([-max, max]);
        container.requestRedraw();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);

        gl = container.querySelector('canvas').getContext('webgl');
        series.context(gl);
    })
    .on('draw', () => {
        if (pixels == null) {
            pixels = new Uint8Array(
                gl.drawingBufferWidth * gl.drawingBufferHeight * 4
            );
        }
        performance.mark(`draw-start-${frame}`);
        series(data);
        // Force GPU to complete rendering to allow accurate performance measurements to be taken
        gl.readPixels(
            0,
            0,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixels
        );
        performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
        frame++;
    });

container.requestRedraw();
