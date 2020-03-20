d3.text('../__data-files__/repeat-data.csv').then(text => {
    const data = d3.csvParseRows(text, d => d.map(s => Number(s)));

    const container = document.querySelector('d3fc-canvas');

    const xScale = d3.scaleLinear().domain([0, data.length]);

    const yScale = d3.scaleLinear().domain([0, 60]);

    const line = fc
        .seriesWebglLine()
        .crossValue((_, i) => i)
        .mainValue(d => d);

    const gl = d3
        .select(container)
        .select('canvas')
        .node()
        .getContext('webgl');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const series = fc
        .seriesWebglRepeat()
        .xScale(xScale)
        .yScale(yScale)
        .context(gl)
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
