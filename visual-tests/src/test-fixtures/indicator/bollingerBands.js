(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#bollinger-bands')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent(data, 'date'))
        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
        .range([0, width]);

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .range([height, 0]);

    // Create the OHLC series
    var ohlc = fc.series.ohlc();

    // Add the primary OHLC series
    container.append('g')
        .datum(data)
        .call(ohlc);

    // Create the Bollinger bands component
    var bollingerComputer = fc.indicator.algorithm.bollingerBands()
        .windowSize(5)
        .multiplier(3)
        .merge(function(datum, boll) { datum.boll = boll; });
    bollingerComputer(data);

    priceScale.domain(fc.util.extent(data, [
        function(d) { return d.boll.upper; },
        function(d) { return d.boll.lower; }
    ]));

    var bollingerRenderer = fc.indicator.renderer.bollingerBands()
        .root(function(d) { return d.boll; });

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bollingerRenderer, ohlc]);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(multi);

})(d3, fc);
