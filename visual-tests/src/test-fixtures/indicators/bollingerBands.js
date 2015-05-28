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
        .domain(fc.utilities.extent(data, 'date'))
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
    var bollingerComputer = fc.indicators.algorithms.bollingerBands();
    bollingerComputer(data);

    priceScale.domain(fc.utilities.extent(data, ['high', 'low', 'upper', 'lower']));

    var bollingerRenderer = fc.indicators.renderers.bollingerBands();

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bollingerRenderer, ohlc]);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(multi);

})(d3, fc);