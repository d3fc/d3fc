(function(d3, fc) {
    'use strict';

    Array.prototype.call = function(fn) {
        fn(this);
        return this;
    };

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
    var ohlc = fc.series.ohlc();

    // ========================================================= Moving Average

    // an out-of-the-box moving average
    var ma = fc.indicators.algorithms.movingAverage();

    // a fully configured moving average
    var ma15 = fc.indicators.algorithms.movingAverage()
        .windowSize(15)
        .value(function(d) { return d.open; })
        .merge(function(data, ma) { data.ma15 = ma; });

    // the application of multiple indicators
    data.call(ma)
        .call(ma15);

    // the visual components
    var line = fc.series.line()
        .yValue(function(d) { return d.movingAverage; });

    var line15 = fc.series.line()
        .yValue(function(d) { return d.ma15; });

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([line, line15, ohlc]);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(multi);

})(d3, fc);