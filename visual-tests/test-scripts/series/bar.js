(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#bar'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .alignPixels(true)
        .domain([dateFrom, dateTo])
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
        .alignPixels(true)
        .domain([priceFrom, priceTo])
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

    // Create the bar series
    var bar = fc.series.bar()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(fc.utilities.valueAccessor('close'))
        .classForBar(function(d) {
            return 'bar-' + d.date.getDay();
        })
        .barWidth(9);

    // Add the primary bar series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(bar);

    // Create the Bollinger bands component
    var bollinger = fc.indicators.bollingerBands()
        .xScale(dateScale)
        .yScale(priceScale)
        .movingAverage(4)
        .standardDeviations(2);

    // Add it to the chart
    chartLayout.getPlotArea().append('g')
        .attr('class', 'bollinger-band')
        .datum(data)
        .call(bollinger);

    // Create a measure tool
    var measure = fc.tools.measure()
        .xScale(dateScale)
        .yScale(priceScale)
        .series(data)
        .target(chartLayout.getPlotArea());

    // Create an invisible overlay
    var overlay = d3.svg.area()
        .x(function(d) { return dateScale(d.date); })
        .y0(0)
        .y1(chartLayout.getPlotAreaHeight());

    // Add the measure on top of the overlay
    chartLayout.getPlotArea().append('path')
        .attr('class', 'overlay')
        .attr('d', overlay(data))
        .call(measure);

})(d3, fc);
