d3.text('repeat-data.csv').then(text => {
    const data = d3.csvParseRows(text, d => d.map(s => Number(s)));

    const container = document.querySelector('d3fc-canvas');

    const xScale = d3.scaleLinear().domain([0, data.length - 1]);

    const yScale = d3.scaleLinear().domain([0, 60]);

    const line = fc
        .seriesWebglLine()
        .crossValue((_, i) => i)
        .mainValue(d => d);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const series = fc
        .seriesWebglRepeat()
        .xScale(xScale)
        .yScale(yScale)
        .series(line)
        .decorate((program, _, index) => {
            fc
                .webglStrokeColor()
                .value(() => {
                    const { r, g, b, opacity } = d3.color(color(index));
                    return [r / 255, g / 255, b / 255, opacity];
                })
                .data(data)(program);
        });

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
            performance.measure(
                `draw-duration-${frame}`,
                `draw-start-${frame}`
            );
            frame++;
        });

    container.requestRedraw();
});
