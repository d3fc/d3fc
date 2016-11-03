var data = d3.range(50).map((d) => ({
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
}));

// use d3fc-extent to compute the domain for each axis
var xExtent = fc.extentLinear()
  .accessors([d => d.x]);
var yExtent = fc.extentLinear()
  .accessors([d => d.y, d => d.z])
  .pad([0.1, 0.1]);

// gridlines (from d3fc-annotation)
var gridlines = fc.annotationSvgGridline();
// series (from d3fc-series)
var line = fc.seriesSvgLine();
var area = fc.seriesSvgArea()
  .mainValue(d => d.z);

// combine into a single series
var multi = fc.seriesSvgMulti()
  .series([gridlines, area, line]);

// the cartesian component, which uses d3fc-element for layout
// of the standard feaures of a chart (axes, labels, plot area)
var chart = fc.chartSvgCartesian(
    d3.scaleLinear(),
    d3.scaleLinear()
  )
  .xLabel('Value')
  .yLabel('Sine / Cosine')
  .chartLabel('Sine and Cosine')
  .yDomain(yExtent(data))
  .xDomain(xExtent(data))
  .plotArea(multi);

// render
d3.select('#sine')
  .datum(data)
  .call(chart);
