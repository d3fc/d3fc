(function(d3, fc) {
    'use strict';

    var generator = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1));
    var data = generator(20);
    var data2 = generator(20);
    var data3 = generator(20);

    var chartLayout = fc.utilities.chartLayout();
    var chartBuilder = fc.utilities.chartBuilder(chartLayout);

    d3.select('#decorate')
        .call(chartBuilder);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([90, 110])
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

    var color = d3.scale.category10();

    var bar = fc.series.bar()
        .decorate(function(sel) {
            sel.attr('fill', function(d, i) { return color(i); });
        })
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale);

    var candlestick = fc.series.candlestick()
        .decorate(function(sel) {
            sel.select('rect').attr('fill', function(d, i) { return color(i); });
        })
        .xScale(dateScale)
        .yScale(priceScale);

    var ohlc = fc.series.ohlc()
        .decorate(function(sel) {
            sel.attr('stroke', function(d, i) { return color(i); })
                .attr('class', '');
        })
        .xScale(dateScale)
        .yScale(priceScale);

    // letting chart builder manage the axes
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('left', priceAxis);
    chartBuilder.render();

    // manually managing series in order to join with different datasets
    chartLayout.getPlotArea()
        .append('g')
        .datum(data)
        .call(bar);

    chartLayout.getPlotArea()
        .append('g')
        .datum(data2)
        .call(ohlc);

    chartLayout.getPlotArea()
        .append('g')
        .datum(data3)
        .call(candlestick);

})(d3, fc);
