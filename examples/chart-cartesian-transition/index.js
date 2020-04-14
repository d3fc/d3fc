let data;
let phase = 0;

function updateData() {
    phase += 1;
    data = d3.range(50).map(d => ({
        x: (d + phase) / 4,
        y: Math.sin((d + phase) / 4),
        z: Math.cos((d + phase) / 4) * 0.7
    }));
}

function render() {
    updateData();

    // use d3fc-extent to compute the domain for each axis
    const xExtent = fc.extentLinear().accessors([d => d.x]);
    const yExtent = fc
        .extentLinear()
        .accessors([d => d.y, d => d.z])
        .pad([0.1, 0.1]);

    // gridlines (from d3fc-annotation)
    const gridlines = fc.annotationSvgGridline();
    // series (from d3fc-series)
    const bar = fc.seriesSvgBar().key(d => d.y);
    const area = fc.seriesSvgArea().mainValue(d => d.z);

    // combine into a single series
    const multi = fc.seriesSvgMulti().series([gridlines, area, bar]);

    // the cartesian component, which uses d3fc-element for layout
    // of the standard feaures of a chart (axes, labels, plot area)
    const chart = fc
        .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
        .xLabel('Value')
        .yLabel('Sine / Cosine')
        .yDomain(yExtent(data))
        .xDomain(xExtent(data))
        .svgPlotArea(multi);

    d3.select('#chart')
        .datum(data)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(chart);
}

render();
setInterval(render, 1100);
