(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#candlestick')
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

    var candlestick = fc.series.candlestick()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(candlestick);

})(d3, fc);
