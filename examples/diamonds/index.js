d3.tsv('diamond-data.tsv', d => ({
    carat: Number(d.carat),
    price: Number(d.price)
})).then(data => {
    const xExtent = fc.extentLinear().accessors([d => d.carat]);
    const yExtent = fc.extentLinear().accessors([d => d.price]);

    const xScale = d3.scaleLog().domain(xExtent(data));
    const xScaleCopy = xScale.copy();
    const yScale = d3.scaleLog().domain(yExtent(data));
    const yScaleCopy = yScale.copy();

    const zoom = d3.zoom().on('zoom', () => {
        xScale.domain(d3.event.transform.rescaleX(xScaleCopy).domain());
        yScale.domain(d3.event.transform.rescaleY(yScaleCopy).domain());
        render();
    });

    const gridlines = fc.annotationSvgGridline();

    const pointSeries = fc
        .seriesWebglPoint()
        .crossValue(d => d.carat)
        .mainValue(d => d.price)
        .size(d =>
            Math.pow(
                Math.max(2, xScaleCopy(d.carat + 0.01) - xScaleCopy(d.carat)),
                2
            )
        )
        .type(d3.symbolSquare)
        .defined(() => true)
        .equals(d => d.length)
        .decorate(program => {
            fc.webglFillColor([60 / 255, 180 / 255, 240 / 255, 1.0])(program);

            program.fragmentShader().appendBody(`
                if (gl_PointCoord.y > 0.6 || gl_PointCoord.y < 0.4) {
                    discard;
                }
            `);

            const gl = program.context();
            gl.clearColor(1.0, 1.0, 1.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendColor(0.0, 0.0, 0.0, 1.0);
            gl.blendFuncSeparate(
                gl.DST_COLOR,
                gl.ZERO,
                gl.CONSTANT_ALPHA,
                gl.ZERO
            );
        });

    const chart = fc
        .chartCartesian(xScale, yScale)
        .svgPlotArea(gridlines)
        .webglPlotArea(pointSeries)
        .yOrient('left')
        .xLabel('Carats →')
        .yLabel('↑ Price $')
        .xTickFormat(d3.format('.1f'))
        .yTickFormat(d3.format('.1s'))
        .decorate(selection => {
            selection
                .enter()
                .select('.webgl-plot-area')
                .raise()
                .on('measure.range', () => {
                    xScaleCopy.range([0, d3.event.detail.width]);
                    yScaleCopy.range([d3.event.detail.height, 0]);
                })
                .call(zoom);
        });

    function render() {
        d3.select('#chart')
            .datum(data)
            .call(chart);
    }

    render();
});
