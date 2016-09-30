var width = 500, height = 250;
var container = d3.select('#bar-horizontal')
    .append('svg')
    .attr({'width': width, 'height': height});

// START
var dataGenerator = fc.data.random.walk();
var data = dataGenerator(20).map(function(datum, index) {
  return {
        // notice that x & y have been transposed!
    x: datum,
    y: index
  };
});

var xScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['x'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['y'])(data))
    .range([height, 0]);

var bar = fc.series.bar()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; })
    .xScale(xScale)
    .yScale(yScale)
    .orient('horizontal');

container.append('g')
    .datum(data)
    .call(bar);
// END
