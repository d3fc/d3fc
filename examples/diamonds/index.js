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
        .size(4)
        .defined(() => true)
        .equals(d => d.length)
        .decorate(program => {
            fc.webglFillColor([0.0, 0.0, 0.5, 0.3])(program);

            const gl = program.context();
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        });

    const chart = fc
        .chartCartesian(xScale, yScale)
        .svgPlotArea(gridlines)
        .webglPlotArea(pointSeries)
        .xLabel('Mass (carats)')
        .yLabel('Price (US$)')
        .yTickFormat(d3.format('.3s'))
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
