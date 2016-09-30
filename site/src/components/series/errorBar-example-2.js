var width = 500, height = 250;
var container = d3.select('#errorbar2')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.walk();
var data = dataGenerator(100).map(function(datum, index) {
  return {
    x: index,
    y: datum,
    low: datum - Math.random() * 2,
    high: datum + Math.random() * 2
  };
});

var xScale = d3.scale.linear()
    .domain(fc.util.extent().pad(0.1).fields(['x'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['low', 'high'])(data))
    .range([height, 0]);

// START
var errorBar = fc.series.errorBar()
    .value(function(d) { return d.x; })
    .low(function(d) { return d.low; })
    .high(function(d) { return d.high; })
    .xScale(xScale)
    .yScale(yScale);

var barSeries = fc.series.bar()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

var multiSeries = fc.series.multi()
      .series([barSeries, errorBar])
      .xScale(xScale)
      .yScale(yScale);

container.append('g')
    .datum(data)
    .call(multiSeries);
// END
