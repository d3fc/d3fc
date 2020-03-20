// hide-range{1-13}
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

var chart = fc.chartCartesian(
        d3.scaleBand(),
        d3.scaleLinear())
    .chartLabel('2015 Cumulative Sales')
    .xDomain(data.sales.map(function(d) { return d.month; }))
    .yDomain(yExtent(data.sales))
    .yTicks(5)
    .xPadding(0.2)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();

var bar = fc.autoBandwidth(fc.seriesSvgBar())
    .align('left')
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

chart.svgPlotArea(multi);
// hide-range{1-4}

d3.select('#adding-annotations')
    .datum(data)
    .call(chart);
