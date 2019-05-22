// create some test data
var data = d3.range(50).map(function(d) {
  return {
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
  };
});

var yExtent = fc.extentLinear()
  .accessors([
    function(d) { return d.y; },
    function(d) { return d.z; }
  ])
  .pad([0.4, 0.4])
  .padUnit('domain');

var xExtent = fc.extentLinear()
  .accessors([function(d) { return d.x; }]);

// create a chart
var chart = fc.chartCartesian(
    d3.scaleLinear(),
    d3.scaleLinear())
  .yDomain(yExtent(data))
  .yLabel('Sine / Cosine')
  .yOrient('left')
  .xDomain(xExtent(data))
  .xLabel('Value')
  .chartLabel('Sine/Cosine Line/Area Chart');

// create a pair of series and some gridlines
var sinLine = fc.seriesSvgLine()
  .crossValue(function(d) { return d.x; })
  .mainValue(function(d) { return d.y; })
  .decorate(function(selection) {
    selection.enter()
      .style('stroke', 'purple');
  });

var cosLine = fc.seriesSvgArea()
  .crossValue(function(d) { return d.x; })
  .mainValue(function(d) { return d.z; })
  .decorate(function(selection) {
    selection.enter()
      .style('fill', 'lightgreen')
      .style('fill-opacity', 0.5);
  });

var gridlines = fc.annotationSvgGridline();

// combine using a multi-series
var multi = fc.seriesSvgMulti()
  .series([gridlines, sinLine, cosLine]);

chart.svgPlotArea(multi);

// render
d3.select('#simple-chart')
  .datum(data)
  .call(chart);
