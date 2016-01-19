var width = 500, height = 250;
var container = d3.select('#ma')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0]);

// Create the point series
var point = fc.series.point()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(point);

// Create and apply the Moving Average
var movingAverage = fc.indicator.algorithm.movingAverage();
movingAverage(data);

// Create a line that renders the result
var ma = fc.series.line()
    .yValue(function(d) { return d.movingAverage; })
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(ma);
