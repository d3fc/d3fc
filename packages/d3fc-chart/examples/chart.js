var data = d3.range(50).map(function(d) {
    return {
        x: d / 4,
        y: Math.sin(d / 4),
        z: Math.cos(d / 4) * 0.7
    };
});

var xExtent = fc.extentLinear()
  .accessors([d => d.x]);
var yExtent = fc.extentLinear()
  .accessors([d => d.y, d => d.z])
  .pad([0.1, 0.1])

var gridlines = fc.annotationSvgGridline();
var line = fc.seriesSvgLine();
var area = fc.seriesSvgArea()
  .mainValue(d => d.z);

var multi = fc.seriesSvgMulti()
  .series([gridlines, area, line]);

var chart = fc.chartSvgCartesian()
  .xLabel('Value')
  .yLabel('Sine / Cosine')
  .chartLabel('Sine and Cosine')
  .yDomain(yExtent(data))
  .xDomain(xExtent(data))
  .plotArea(multi);

d3.select('#sine')
  .datum(data)
  .call(chart);
