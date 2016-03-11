var width = 500, height = 250;
var container = d3.select('#largest')
    .append('svg')
    .attr({'width': width, 'height': height});

// create a large amount of data
var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(1000);

// configure the sampler
var sampler = fc.data.sampler.largestTriangleThreeBucket()
    .bucketSize(20)
    .x(function(d) { return d.date; })
    .y(function(d) { return d.low; });

// sample the data
var sampledData = sampler(data);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields(['date'])(sampledData))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['low'])(sampledData))
    .range([height, 0]);


// render the sampled data
var sampledLine = fc.series.line()
    .xScale(xScale)
    .yScale(yScale)
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.low; });

container.append('g')
    .datum(sampledData)
    .call(sampledLine);

// render the original data
var originalLine = fc.series.line()
    .xScale(xScale)
    .yScale(yScale)
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.low; })
    .decorate(function(selection) {
        selection.enter().style('stroke-opacity', '0.5');
    });

container.append('g')
    .datum(data)
    .call(originalLine);
