(function(d3, fc) {
    'use strict';

    var generator = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1));
    var data = generator(50);

    // Create the main chart
    var chart = d3.select('#indicators-combined'),
        chartLayout = fc.utilities.chartLayout(),
        chartBuilder = fc.utilities.chartBuilder(chartLayout);

    chart.call(chartBuilder);

    // Create scale for x axis
    var dateScale = d3.time.scale()
        .domain(fc.utilities.extent(data, 'date'))
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom');

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right');

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Create the Bollinger bands
    var bollinger = fc.indicators.bollingerBands()
        .xScale(dateScale)
        .yScale(priceScale)
        .windowSize(4)
        .multiplier(2);

    // Create the moving average component
    var movingAverage = fc.indicators.movingAverage()
        .xScale(dateScale)
        .yScale(priceScale)
        .windowSize(10);

    // Add the axes to the chart
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('right', priceAxis);

    // Add components to plot area
    chartBuilder.addToPlotArea([ohlc, bollinger, movingAverage]);

    // Set data and render
    chartBuilder.setData(data);
    chartBuilder.render();

    // Create the RSI chart
    var rsiChart = d3.select('#indicators-combined-rsi'),
        rsiLayout = fc.utilities.chartLayout().height(150),
        rsiBuilder = fc.utilities.chartBuilder(rsiLayout);

    rsiChart.call(rsiBuilder);

    // Create RSI scale for y axis
    var percentageScale = d3.scale.linear()
        .domain([0, 100]) // Perctange scale
        .nice();

    var percentageAxis = d3.svg.axis()
        .scale(percentageScale)
        .orient('right')
        .ticks(5);

    rsiBuilder.setAxis('bottom', dateAxis);
    rsiBuilder.setAxis('right', percentageAxis);

    // Create the RSI component
    var rsi = fc.indicators.relativeStrengthIndicator()
        .xScale(dateScale)
        .yScale(percentageScale)
        .windowSize(20);

    // Add the RSI component to the RSI chart
    rsiBuilder.addToPlotArea([rsi]);

    // Set the data and render the RSI chart
    rsiBuilder.setData(data);
    rsiBuilder.render();

    // Update the data and chart (1 second interval)
    setInterval(function() {
        data.push(generator(1)[0]);
        data.shift();

        // Update main chart
        dateScale.domain(fc.utilities.extent(data, 'date'));
        priceScale.domain(fc.utilities.extent(data, ['high', 'low']));
        chartBuilder.setData(data);
        chartBuilder.render();

        // Update RSI
        rsiBuilder.setData(data);
        rsiBuilder.render();
    }, 1000);

})(d3, fc);