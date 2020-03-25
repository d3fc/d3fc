const dataGenerator = fc.randomGeometricBrownianMotion().steps(1e4);
const data = dataGenerator().map((_, i) => {
    const result = {
        value: i
    };
    result.median = 10 + Math.random();
    result.upperQuartile = result.median + Math.random();
    result.lowerQuartile = result.median - Math.random();
    result.high = result.upperQuartile + Math.random();
    result.low = result.lowerQuartile - Math.random();
    return result;
});

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain(extent.accessors([d => d.value])(data));

const yScale = d3
    .scaleLinear()
    .domain(extent.accessors([d => d.high, d => d.low])(data));

const container = document.querySelector('d3fc-canvas');

const series = fc
    .seriesWebglBoxPlot()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d.value)
    .medianValue(d => d.median)
    .upperQuartileValue(d => d.upperQuartile)
    .lowerQuartileValue(d => d.lowerQuartile)
    .highValue(d => d.high)
    .lowValue(d => d.low)
    .defined(() => true)
    .equals(d => d.length);

let pixels = null;
let frame = 0;
let gl = null;

d3.select(container)
    .on('click', () => {
        const domain = xScale.domain();
        const max = Math.round(domain[1] / 2);
        xScale.domain([0, max]);
        series.bandwidth(series.bandwidth()() * 2);
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
