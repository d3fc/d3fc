var width = 500, height = 250;
var container = d3.select('#errorbar')
    .append('svg')
    .attr({'width': width, 'height': height});

//START
var dataGenerator = fc.data.random.walk();
var data = dataGenerator(100).map(function(datum, index) {
    return {
        value: index,
        y: datum,
        low: datum - Math.random(),
        high: datum + Math.random()
    };
});

var xScale = d3.scale.linear()
    .domain(fc.util.extent().pad(0.1).fields('value')(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['low', 'high'])(data))
    .range([height, 0]);

var errorBar = fc.series.errorBar()
    .value(function(d) { return d.value; })
    .low(function(d) { return d.low; })
    .high(function(d) { return d.high; })
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(errorBar);
//END
