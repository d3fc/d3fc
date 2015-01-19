(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#rsi'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
        .domain([0, 100]) // Perctange scale
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

    // Create the relative strength indicator component
    var rsi = fc.indicators.relativeStrengthIndicator()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    chartLayout.getPlotArea().append('g')
        .attr('class', 'rsi')
        .datum(data)
        .call(rsi);

})(d3, fc);