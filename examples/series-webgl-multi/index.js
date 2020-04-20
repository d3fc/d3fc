const data = fc.randomGeometricBrownianMotion().steps(1e4)(1);

const xScale = d3.scaleLinear().domain([0, data.length]);

const yScale = d3.scaleLinear().domain(fc.extentLinear().pad([0.5, 0.5])(data));

const container = document.querySelector('d3fc-canvas');

const bar = fc
    .seriesWebglBar()
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .bandwidth(1)
    .defined(() => true)
    .equals(previousData => previousData.length > 0)
    .decorate(program => {
        fc.webglFillColor([0.6, 0.6, 0.6, 1])(program);
    });

const line = fc
    .seriesWebglLine()
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .defined(() => true)
    .equals(previousData => previousData.length > 0);

const series = fc
    .seriesWebglMulti()
    .xScale(xScale)
    .yScale(yScale)
    .series([bar, line]);

let pixels = null;
let frame = 0;
let gl = null;

d3.select(container)
    .on('click', () => {
        const domain = xScale.domain();
        const max = Math.round(domain[1] / 2);
        xScale.domain([0, max]);
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
