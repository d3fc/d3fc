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
    .xPadding(0.2)
    .yTicks(5)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();

// START
var bar = fc.autoBandwidth(fc.seriesSvgBar())
  .crossValue(function(d) { return d.month; })
  .mainValue(function(d) { return d.sales; })
  .align('left')
  .decorate(function(selection) {
    // The selection passed to decorate is the one which the component creates
    // within its internal data join, here we use the update selection to
    // apply a style to 'path' elements created by the bar series
    selection.select('.bar > path')
      .style('fill', function(d) {
        return d.sales < data.targets[0].value ? 'inherit' : '#0c0';
      });
  });
// END

var annotation = fc.annotationSvgLine()
    .value(function(d) { return d.value; })
    .decorate(function(selection) {
      selection.enter()
        .select('g.left-handle')
        .append('text')
        .attr('x', 5)
        .attr('y', -5);
      selection.select('g.left-handle text')
        .text(function(d) {
          return d.name + ' - ' + valueformatter(d.value) + 'M';
        });
    });

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

d3.selectAll('.complete-chart')
    .datum(data)
    .call(chart);
