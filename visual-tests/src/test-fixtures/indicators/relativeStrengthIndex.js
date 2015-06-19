(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#rsi')
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
        .domain([0, 100]) // Perctange scale
        .range([height, 0])
        .nice();

    // Create the relative strength indicator component
    var rsiAlgo = fc.indicators.algorithms.relativeStrengthIndex()
        .windowSize(5)
        .merge(function(datum, rsi) { datum.rsiValue = rsi; });
    rsiAlgo(data);

    var rsi = fc.indicators.renderers.relativeStrengthIndex()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(function(d) { return d.rsiValue; });

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(rsi);

})(d3, fc);
