(function(d3, fc) {
    'use strict';

    var generator = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1));
    var data = generator(20);

    var chartLayout = fc.utilities.chartLayout();
    var chartBuilder = fc.utilities.chartBuilder(chartLayout);

    d3.select('#update')
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

    var bar = fc.series.bar()
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale);

    var line = fc.series.line()
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale);

    var candle = fc.series.candlestick()
        .xScale(dateScale)
        .yScale(priceScale);

    // add the components to the chart
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('left', priceAxis);
    chartBuilder.addToPlotArea([ohlc, bar, line, candle]);

    // associate the data
    chartBuilder.setData(data);

    // draw stuff!
    chartBuilder.render();

    setInterval(function() {
        var datum;
        while (!datum) {
            datum = generator(1)[0];
        }
        data.push(datum);
        data.shift();
        data.forEach(function(d) {
            d.low = d.low - 0.1;
        });
        dateScale.domain(fc.utilities.extent(data, 'date'));
        priceScale.domain(fc.utilities.extent(data, ['high', 'low']));
        chartBuilder.setData(data);
        chartBuilder.render();
    }, 1000);

})(d3, fc);
