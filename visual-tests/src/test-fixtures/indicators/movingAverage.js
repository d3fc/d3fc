(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#moving-average')
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

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    container.append('g')
        .datum(data)
        .call(ohlc);

    // Create the moving average component
    var movingAverage = fc.indicators.movingAverage()
        .xScale(dateScale)
        .yScale(priceScale)
        .outputValueKey('sma10')
        .windowSize(10);

    var exponentialMovingAverage = fc.indicators.movingAverage()
        .xScale(dateScale)
        .yScale(priceScale)
        .outputValueKey('sma5')
        .windowSize(5);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(movingAverage);

    container.append('g')
        .datum(data)
        .call(exponentialMovingAverage);

})(d3, fc);