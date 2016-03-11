var width = 500, height = 250;
var container = d3.select('#line')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.walk();
var data = dataGenerator(100).map(function(datum, index) {
    return {
        x: index,
        y: datum
    };
});

var xScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['x'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['y'])(data))
    .range([height, 0]);

//START
var line = fc.series.line()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; })
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(line);
//END
