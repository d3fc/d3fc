const data = d3.range(50).map(d => ({
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
}));

// use d3fc-extent to compute the domain for each axis
const xExtent = fc.extentLinear().accessors([d => d.x]);
const yExtent = fc
    .extentLinear()
    .accessors([d => d.y, d => d.z])
    .pad([0.1, 0.1]);

// gridlines (from d3fc-annotation)
const gridlines = fc.annotationCanvasGridline();
// series (from d3fc-series)
const line = fc.seriesSvgLine();
const area = fc.seriesSvgArea().mainValue(d => d.z);

// combine into a single series
const multi = fc.seriesSvgMulti().series([area, line]);

// the cartesian component, which uses d3fc-element for layout
// of the standard feaures of a chart (axes, labels, plot area)
const chart = fc
    .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .chartLabel('Sine and Cosine')
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi)
    .canvasPlotArea(gridlines);

d3.select('#sine-chart')
    .datum(data)
    .call(chart);

const gridlinesSvg = fc.annotationSvgGridline();
const lineSvg = fc.seriesSvgLine();
const areaSvg = fc.seriesSvgArea().mainValue(d => d.z);

const multiSvg = fc.seriesSvgMulti().series([gridlinesSvg, areaSvg, lineSvg]);

const chartSvg = fc
    .chartSvgCartesian(d3.scaleLinear(), d3.scaleLinear())
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .chartLabel('Sine and Cosine')
    .xTickArguments([6, 's'])
    .xTickSizeInner(10)
    .xTickSizeOuter(10)
    .yTickValues([-1, -0.6, -0.2, 0.2, 0.6, 1])
    .yTickSize(15)
    .yTickPadding(10)
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .plotArea(multiSvg);

// render
d3.select('#sine-svg')
    .datum(data)
    .call(chartSvg);

// and now in canvas ...

const gridlinesCanvas = fc.annotationCanvasGridline();
const areaCanvas = fc.seriesCanvasArea().mainValue(d => d.z);
const lineCanvas = fc.seriesCanvasLine();

const multiCanvas = fc
    .seriesCanvasMulti()
    .series([gridlinesCanvas, areaCanvas, lineCanvas]);

const chartCanvas = fc
    .chartCanvasCartesian(d3.scaleLinear(), d3.scaleLinear())
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .chartLabel('Sine and Cosine')
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .plotArea(multiCanvas);

d3.select('#sine-canvas')
    .datum(data)
    .call(chartCanvas);
