(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1)).startPrice(95)(20);
    var data2 = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1)).startPrice(100)(20);
    var data3 = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1)).startPrice(105)(20);

    var width = 600, height = 250;

    var container = d3.select('#decorate')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([90, 110])
        .range([height, 0])
        .nice();

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
            sel.attr('fill', function(d, i) { return color(i); })
                .attr('stroke', function(d, i) { return color(i); })
                .attr('class', '');
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

    // manually managing series in order to join with different datasets
    container.append('g')
        .datum(data)
        .call(bar);

    container.append('g')
        .datum(data2)
        .call(ohlc);

    container.append('g')
        .datum(data3)
        .call(candlestick);

})(d3, fc);
