(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#area-line-point')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent()(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent()(data, ['high', 'low']))
        .range([height, 0])
        .nice();

    // Create the line series
    var line = fc.series.line()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(function(d) { return d.open; });

    // Create the area series
    var area = fc.series.area()
        .xScale(dateScale)
        .yScale(priceScale)
        .y0Value(function(d) { return d.low; })
        .y1Value(function(d) { return d.high; });

    // Create the point series
    var point = fc.series.point()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(function(d) { return d.close; });

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(line)
        .call(area)
        .call(point);

})(d3, fc);
