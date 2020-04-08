const data = d3.range(50).map(d => ({
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
}));

const xExtent = fc.extentLinear().accessors([d => d.x]);
const yExtent = fc
    .extentLinear()
    .accessors([d => d.y, d => d.z])
    .pad([0.1, 0.1]);

const gridlines = fc.annotationSvgGridline();
const line = fc.seriesCanvasLine();
const area = fc.seriesCanvasArea().mainValue(d => d.z);

const multi = fc.seriesCanvasMulti().series([area, line]);

const yScale = d3.scaleLinear();

const chart = fc
    .chartCartesian(d3.scaleLinear(), yScale)
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .yOrient('left')
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(gridlines)
    .canvasPlotArea(multi);

chart.decorate(selection => {
    // select the x-axis
    selection
        .select('.x-axis')
        // move it into the plot-area
        .style('grid-row', 3)
        // listen for the draw event (using a namespace to avoid removing any existing handlers)
        .on('draw.move-axis', (d, i, nodes) => {
            // select the x-axis
            d3.select(nodes[i])
                // apply a top margin to the axis to align it to 0 on the y-axis
                .style('margin-top', `${yScale(0)}px`);
        });

    // optionally: add some padding to fill the gap left by the x-axis
    selection.select('.x-label').style('padding-top', '1em');
});

// optionally: re-position the x-axis tick labels so they're readable
chart.xDecorate(selection => {
    selection.select('text').attr('transform', 'translate(-7, 7)');
});

d3.select('#chart')
    .datum(data)
    .call(chart);
