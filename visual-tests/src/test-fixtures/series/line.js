(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.utilities.dataGenerator()
        .startDate(new Date(2014, 1, 1));
    var data = dataGenerator(50);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    var chart = fc.charts.linearTimeSeries()
        .xDomain([dateFrom, dateTo])
        .xNice()
        .yDomain([priceFrom, priceTo])
        .yNice()
        .xTicks(5)
        .yTicks(5);

    // Create the line series
    var line = fc.series.line()
        .yValue(function(d) { return d.open; });
    chart.series(line);

    // // Create the area series
    // var area = fc.series.area()
    //     .xScale(dateScale)
    //     .yScale(priceScale)
    //     .y0Value(function(d) { return d.low; })
    //     .y1Value(function(d) { return d.high; });

    // // Create the point series
    // var point = fc.series.point()
    //     .xScale(dateScale)
    //     .yScale(priceScale)
    //     .yValue(function(d) { return d.close; });

    d3.select('#line')
        .append('svg')
        .datum(data)
        .call(chart);

})(d3, fc);
