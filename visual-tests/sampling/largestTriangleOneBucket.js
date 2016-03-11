(function(d3, fc) {
    var dataPoints = 100000;
    var subsampledDataPoints = 200;
    var width = 600, height = 250;

    var data = fc.data.random.walk().steps(dataPoints)(5000);
    data = data.map(function(d, i) {
        return {x: i, y: d};
    });

    var subsampledData = fc.data.sampler.largestTriangleOneBucket()
        .bucketSize(dataPoints / subsampledDataPoints)
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        (data);

    var xScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['x'])(subsampledData))
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['y'])(subsampledData))
        .range([height, 0]);

    var line = fc.series.line()
        .xScale(xScale)
        .yScale(yScale)
        .xValue(function(d) { return d.x; })
        .yValue(function(d) { return d.y; });

    d3.select('#chart')
        .append('svg')
        .style({
            height: height,
            width: width
        })
        .datum(subsampledData)
        .call(line);
})(d3, fc);
