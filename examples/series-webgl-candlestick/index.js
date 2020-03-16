const data = fc.randomFinancial()(1e4);

const xScale = d3
    .scaleTime()
    .domain(fc.extentDate().accessors([d => d.date])(data));

const yScale = d3
    .scaleLinear()
    .domain(fc.extentLinear().accessors([d => d.high])(data));

const container = document.querySelector('d3fc-canvas');

const gl = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('webgl');

const series = fc
    .seriesWebglCandlestick()
    .xScale(xScale)
    .yScale(yScale)
    .context(gl)
    .defined(() => true)
    .equals(d => d.length);

let pixels = null;
let frame = 0;

d3.select(container)
    .on('click', () => {
        const domain = xScale.domain();
        const mid = (domain[1].valueOf() - domain[0].valueOf()) / 2;
        xScale.domain([domain[0], new Date(domain[1].valueOf() - mid)]);
        series.bandwidth(series.bandwidth()() * 2);
        container.requestRedraw();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
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
