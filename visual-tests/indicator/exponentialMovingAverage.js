(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#exponential-moving-average')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields(['date'])(data))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data))
        .range([height, 0])
        .nice();

    // Create the moving average bands component
    var movingAverage = fc.indicator.algorithm.exponentialMovingAverage()
        .value(function(d) { return d.high; })
        .period(3);

    movingAverage(data);

    // create the series
    var ohlc = fc.series.ohlc();
    var line = fc.series.line()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.exponentialMovingAverage; });

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([line, ohlc]);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(multi);

})(d3, fc);
