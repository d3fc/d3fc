// a random number generator
var generator = fc.randomGeometricBrownianMotion()
    .steps(11);

// some formatters
var dateFormatter = d3.timeFormat('%b');

// randomly generated sales data starting at one
var data = generator(1).map(function(d, i) {
  return {
    month: dateFormatter(new Date(0, i + 1, 0)),
    sales: d + i / 2
  };
});

// START
var chart = fc.chartSvgCartesian(
        d3.scalePoint(),
        d3.scaleLinear())
    .xDomain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .xPadding(0.5)
    .yDomain([0, 10]);

var series = fc.seriesSvgBar()
    .crossValue(function(d) { return d.month; })
    .mainValue(function(d) { return d.sales; });

chart.plotArea(series);

d3.select('#cartesian')
    .datum(data)
    .call(chart);
// END
