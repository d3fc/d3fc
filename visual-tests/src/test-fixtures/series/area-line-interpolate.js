(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 425, height = 400;

    var container = d3.select('#area-line-interpolate')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .range([height, 0])
        .nice();

    // Create the line series
    var line = fc.series.line()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(function(d) { return d.open; })
        .interpolate('linear');

    // Create the area series
    var area = fc.series.area()
        .xScale(dateScale)
        .yScale(priceScale)
        .y0Value(function(d) { return d.low; })
        .y1Value(function(d) { return d.high; })
        .interpolate('linear');

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(line)
        .call(area);

    var select =  d3.select('#interpolate-select');
    select.on('change', function() {
            line.interpolate(select.property('value'));
            area.interpolate(select.property('value'));
            container.select('g')
                .call(line)
                .call(area);
        });

})(d3, fc);
