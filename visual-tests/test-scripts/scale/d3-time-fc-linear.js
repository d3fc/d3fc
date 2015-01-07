(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#d3-time-fc-linear'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var dateScale = d3.time.scale()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
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

    // Create the gridlines
    var gridlines = fc.scale.gridlines()
        .xScale(dateScale)
        .yScale(priceScale)
        .xTicks(10);

    // Add the gridlines
    chartLayout.getPlotArea().append('g')
        .attr('class', 'gridlines')
        .call(gridlines);

})(d3, fc);