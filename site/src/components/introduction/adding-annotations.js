// a random number generator
var generator = fc.data.random.walk()
    .steps(11);

// some formatters
var valueformatter = d3.format('$f');
var dateFormatter = d3.time.format('%b');

var yExtent = fc.util.extent()
    .include(0)
    .pad([0, 0.5])
    .fields(['sales']);

// START
var data = {
    // target values for the annotations
  targets: [{
    name: 'low',
    value: 4.5
  }, {
    name: 'high',
    value: 7.2
  }],
    // randomly generated sales data
  sales: generator(1).map(function(d, i) {
    return {
      month: dateFormatter(new Date(0, i + 1, 0)),
      sales: d + i / 2
    };
  })
};

var chart = fc.chart.cartesian(
        d3.scale.ordinal(),
        d3.scale.linear())
    .chartLabel('2015 Cumulative Sales')
    .margin({top: 30, right: 45, bottom: 40})
    .xDomain(data.sales.map(function(d) { return d.month; }))
    .yDomain(yExtent(data.sales))
    .yTicks(5)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();

var bar = fc.series.bar()
    .xValue(function(d) { return d.month; })
    .yValue(function(d) { return d.sales; });

var annotation = fc.annotation.line()
    .value(function(d) { return d.value; });

var multi = fc.series.multi()
    .series([bar, annotation])
    .mapping(function(series) {
      switch (series) {
      case bar:
        return data.sales;
      case annotation:
        return data.targets;
      }
    });

chart.plotArea(multi);
// END

d3.select('#adding-annotations')
    .datum(data.sales)
    .call(chart);
