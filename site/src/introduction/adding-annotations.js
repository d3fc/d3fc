// a random number generator
var generator = fc.randomGeometricBrownianMotion()
    .steps(11);

// some formatters
var dateFormatter = d3.timeFormat('%b');
var valueformatter = d3.format('$.0f');

var yExtent = fc.extentLinear()
    .include([0])
    .pad([0, 0.5])
    .accessors([function(d) { return d.sales; }]);

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

var chart = fc.chartSvgCartesian(
        d3.scalePoint(),
        d3.scaleLinear())
    .chartLabel('2015 Cumulative Sales')
    .xDomain(data.sales.map(function(d) { return d.month; }))
    .yDomain(yExtent(data.sales))
    .xPadding(0.5)
    .yTicks(5)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();

var bar = fc.seriesSvgBar()
    .crossValue(function(d) { return d.month; })
    .mainValue(function(d) { return d.sales; });

var annotation = fc.annotationSvgLine()
    .value(function(d) { return d.value; });

var multi = fc.seriesSvgMulti()
    .series([bar, annotation])
    .mapping(function(data, index, series) {
      switch (series[index]) {
      case bar:
        return data.sales;
      case annotation:
        return data.targets;
      }
    });

chart.plotArea(multi);
// END

d3.select('#adding-annotations')
    .datum(data)
    .call(chart);
