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
        .domain([dateFrom, dateTo])
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
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
        .yValue(function(d) { return d.close; })
        .decorate(function(sel) {
            sel.attr('class', function(d) { return 'bar-' + d.date.getDay(); });
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
        .windowSize(4)
        .multiplier(2);

    // Add it to the chart
    chartLayout.getPlotArea().append('g')
        .attr('class', 'bollinger-band')
        .datum(data)
        .call(bollinger);

})(d3, fc);
