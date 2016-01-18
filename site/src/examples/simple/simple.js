// create some test data
var data = d3.range(50).map(function(d) {
    return {
        x: d / 4,
        y: Math.sin(d / 4),
        z: Math.cos(d / 4) * 0.7
    };
});

// create a chart
var chart = fc.chart.cartesian(
              d3.scale.linear(),
              d3.scale.linear())
          .yDomain(fc.util.extent().pad(0.2).fields(['y', 'z'])(data))
          .yLabel('Sine / Cosine')
          .yNice()
          .yOrient('left')
          .xDomain(fc.util.extent().fields('x')(data))
          .xLabel('value')
          .xBaseline(0)
          .margin({left: 50, bottom: 20});

// create a pair of series and some gridlines
var sinLine = fc.series.line()
  .xValue(function(d) { return d.x; })
  .yValue(function(d) { return d.y; });

var cosLine = fc.series.area()
  .xValue(function(d) { return d.x; })
  .yValue(function(d) { return d.z; });

var gridlines = fc.annotation.gridline();

// combine using a multi-series
var multi = fc.series.multi()
  .series([gridlines, sinLine, cosLine]);

chart.plotArea(multi);

// render
d3.select('#simple-chart')
    .datum(data)
    .call(chart);
