var width = 500, height = 250;
var container = d3.select('#band')
    .append('svg')
    .attr({'width': width, 'height': height});

//START
var dataGenerator = fc.data.random.walk();
var data = dataGenerator(100).map(function(datum, index) {
    return {
        x: index,
        y0: datum,
        y1: datum + Math.random() * 10
    };
});

var xScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['x'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['y0', 'y1'])(data))
    .range([height, 0]);

var area = fc.series.area()
    .xValue(function(d) { return d.x; })
    .y0Value(function(d) { return d.y0; })
    .y1Value(function(d) { return d.y1; })
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(area);
//END
