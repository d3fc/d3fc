// create some test data
var data = d3.range(50).map(function(d) {
  return {
    x: d / 3,
    y: Math.sin(d / 3)
  };
});

// create a chart with two linear axes
var chart = fc.chart.cartesian(
            d3.scale.linear(),
            d3.scale.linear())
        .xDomain(fc.util.extent().fields(['x'])(data))
        .yDomain(fc.util.extent().fields(['y'])(data));

// create a series and associate it with the plot area
var line = fc.series.line()
  .xValue(function(d) { return d.x; })
  .yValue(function(d) { return d.y; });

chart.plotArea(line);

// render the chart
d3.select('#chart')
  .datum(data)
  .call(chart);
