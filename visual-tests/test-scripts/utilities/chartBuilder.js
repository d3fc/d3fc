(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var chartLayout = fc.utilities.chartLayout();
    var chartBuilder = fc.utilities.chartBuilder(chartLayout);

    d3.select('#chartBuilder')
        .call(chartBuilder);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('left')
        .ticks(5);

    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // add the components to the chart
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('left', priceAxis);
    chartBuilder.addToPlotArea([ohlc]);

    // associate the data
    chartBuilder.setData(data);

    // draw stuff!
    chartBuilder.render();

    var phase = 0.0;
    setInterval(function() {
        d3.select('#chartBuilder').style('width', 500 + Math.sin(phase) * 200 + 'px');
        phase += 0.1;

        chartBuilder.render();
    }, 500);

})(d3, fc);
