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

    var macdAlgo = fc.indicators.algorithms.macd()
        .value(function(d) { return d.close; });

    var result = macdAlgo(data);

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(result, 'macd'))
        .range([height, 0])
        .nice();

    // Create the relative strength indicator component
    var macd = fc.indicators.computers.macd();
    macd(data);

    var extent = fc.utilities.extent(data, ['macd', 'divergence', 'signal']);
    var maxExtent = d3.max([-extent[0], extent[1]]);
    extent = [-maxExtent, maxExtent];
    priceScale.domain(extent);

    var macdRenderer = fc.indicators.macd()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(macdRenderer);

})(d3, fc);