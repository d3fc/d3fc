(function(d3, fc) {
    'use strict';

var chartLayout = fc.utilities.chartLayout();

// Setup the chart
var chart = d3.select('#stacked-bar')
    .call(chartLayout);

d3.csv("stackedBarData.csv", function(error, data) {

  var series = Object.getOwnPropertyNames(data[0]).slice(1);
  var categories = data.slice(1).map(function(d) { return d.State; });
  var yMax = d3.max(data, function(d) {
    var total = 0
    for (var prop in d) {
      if (prop!="State") {
        total += +d[prop]
      }
    }
    return total
  });

  // create scales
  var x = d3.scale.ordinal()
      .domain(categories)
      .rangeBands([0, chartLayout.getPlotAreaWidth()]);

  var color = d3.scale.ordinal()
    .domain(series)
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var y = d3.scale.linear()
    .domain([0, yMax])
    .range([chartLayout.getPlotAreaHeight(), 0]);

  // add axes
  var bottomAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
  chartLayout.getAxisContainer('bottom').call(bottomAxis);

  var rightAxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .ticks(5);
  chartLayout.getAxisContainer('right').call(rightAxis);


  var volume = fc.series.stackedBar()
    .xScale(x)
    .yValueKeys(series)
    .xValueKey("State")
    .yScale(y)
    .visitor(function(s, d) {
      s.attr("fill", color(d.name));
    });

  chartLayout.getPlotArea(chart)
    .datum(data.slice(1))
    .call(volume)
});

})(d3, fc);
