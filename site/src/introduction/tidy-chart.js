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

var yExtent = fc.extentLinear()
    .include([0])
    .pad([0, 0.5])
    .accessors([function(d) { return d.sales; }]);

var valueformatter = d3.format('$.0f');

// START
var chart = fc.chartSvgCartesian(
        d3.scalePoint(),
        d3.scaleLinear())
    .chartLabel('2015 Cumulative Sales')
    .xDomain(data.map(function(d) { return d.month; }))
    .yDomain(yExtent(data))
    .yTicks(5)
    .xPadding(0.5)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();
// END

var series = fc.seriesSvgBar()
    .crossValue(function(d) { return d.month; })
    .mainValue(function(d) { return d.sales; });

chart.plotArea(series);

d3.select('#tidied-chart')
    .datum(data)
    .call(chart);
