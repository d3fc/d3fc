(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));
    var data = dataGenerator(50);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    var chart = fc.chart.linearTimeSeries()
        .xDomain([dateFrom, dateTo])
        .xNice()
        .xTicks(5)
        .yDomain([priceFrom, priceTo])
        .yNice()
        .yTicks(5);

    // Create the gridlines
    var gridlines = fc.annotation.gridline();

    // Create the line and area series
    var line = fc.series.line()
        .yValue(function(d) { return d.open; });
    var area = fc.series.area()
        .yValue(function(d) { return d.open; });

    var multi = fc.series.multi()
        .series([gridlines, area, line])
        .seriesIndex(function() { return 1; });
    chart.plotArea(multi);

    d3.select('#linear-time-series')
        .append('svg')
        .style({
            height: '240px',
            width: '320px'
        })
        .datum(data)
        .call(chart);

})(d3, fc);
