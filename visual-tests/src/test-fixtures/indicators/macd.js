(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator()
        .startDate(new Date(2014, 1, 1))
        .filter(function() { return true; })
        (100);

    var width = 600, height = 250;

    var container = d3.select('#macd')
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
        .range([height, 0])
        .nice();

    // Create the macd algorithm
    var macdAlgo = fc.indicators.algorithms.macd()
        .fastPeriod(4)
        .slowPeriod(10)
        .signalPeriod(5)
        .value(function(d) { return d.open; });
    macdAlgo(data);

    // compute the extents
    var extent = fc.utilities.extent(data, function(d) { return d.macd.macd; });
    var maxExtent = d3.max([-extent[0], extent[1]]);
    extent = [-maxExtent, maxExtent];
    priceScale.domain(extent);

    var macdRenderer = fc.indicators.renderers.macd()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(macdRenderer);

})(d3, fc);