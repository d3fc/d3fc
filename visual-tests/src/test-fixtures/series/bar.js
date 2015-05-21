(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))
        .filter(d3.functor(true))
        (50);

    var width = 600, height = 250;

    var container = d3.select('#bar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, width]);

    // offset the close price to give some negative values
    var extent = fc.utilities.extent(data, ['close']);
    var offset = extent[0] + (extent[1] - extent[0]) / 2;
    data.forEach(function(datum) {
        datum.close = datum.close - offset;
    });

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['close']))
        .range([height, 0])
        .nice();

    var bar = fc.series.bar()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(bar);

})(d3, fc);
