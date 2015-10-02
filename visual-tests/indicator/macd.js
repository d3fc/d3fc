(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial()
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
        .domain(fc.util.extent(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .range([height, 0])
        .nice();

    // Create the macd algorithm
    var macdAlgo = fc.indicator.algorithm.macd()
        .fastPeriod(4)
        .slowPeriod(10)
        .signalPeriod(5)
        .value(function(d) { return d.open; })
        .merge(function(datum, md) { datum.md = md; });
    macdAlgo(data);

    // compute the extents
    var maxExtent = d3.max(data, function(d) { return Math.abs(d.md.macd); });
    priceScale.domain([-maxExtent, maxExtent]);

    var macdRenderer = fc.indicator.renderer.macd()
        .xScale(dateScale)
        .yScale(priceScale)
        .root(function(d) { return d.md; });

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(macdRenderer);

})(d3, fc);
