// a random number generator
var generator = fc.data.random.walk()
    .steps(11);

// some formatters
var dateFormatter = d3.time.format('%b');

// randomly generated sales data
var data = generator(1).map(function(d, i) {
  return {
    month: dateFormatter(new Date(0, i + 1, 0)),
    sales: d + i / 2
  };
});

// START
var yExtent = fc.util.extent()
    .include([0])
    .pad([0, 0.5])
    .fields(['sales']);

var chart = fc.chart.cartesian(
        d3.scale.ordinal(),
        d3.scale.linear())
    .xDomain(data.map(function(d) { return d.month; }))
    .yDomain(yExtent(data));
// END

var series = fc.series.bar()
    .xValue(function(d) { return d.month; })
    .yValue(function(d) { return d.sales; });

chart.plotArea(series);

d3.select('#cartesian-extent')
    .datum(data)
    .call(chart);
