(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var chart = d3.select('#bollinger-bands'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
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

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(ohlc);

    // Create the Bollinger bands component
    var bollinger = fc.indicators.bollingerBands()
        .xScale(dateScale)
        .yScale(priceScale)
        .windowSize(4)
        .multiplier(2);

    // Add it to the chart
    chartLayout.getPlotArea().append('g')
        .attr('class', 'bollinger-bands')
        .datum(data)
        .call(bollinger);

})(d3, fc);