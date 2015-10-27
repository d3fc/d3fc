(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1)).startPrice(95)(40);
    var data2 = fc.data.random.financial().startDate(new Date(2014, 1, 1)).startPrice(100)(40);
    var data3 = fc.data.random.financial().startDate(new Date(2014, 1, 1)).startPrice(105)(40);
    var data4 = fc.data.random.financial().startDate(new Date(2014, 1, 1)).startPrice(105)(40);

    var width = 600, height = 250;

    var container = d3.select('#decorate')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent()(data, 'date'))
        .range([0, width]);

    var heightFraction = height / 4;

    // Create scale for y axis
    var candleScale = d3.scale.linear()
        .domain(fc.util.extent()(data3, ['high', 'low']))
        .range([heightFraction, 0]);

    var ohlcScale = d3.scale.linear()
        .domain(fc.util.extent()(data2, ['high', 'low']))
        .range([heightFraction * 2, heightFraction]);

    // offset the close price to give some negative values
    var extent = fc.util.extent()(data, ['close']);
    var offset = extent[0] + (extent[1] - extent[0]) / 2;
    data.forEach(function(datum) {
        datum.close = datum.close - offset;
    });

    var barScale = d3.scale.linear()
        .domain(fc.util.extent()(data, ['close']))
        .range([heightFraction * 3, heightFraction * 2]);

    var pointScale = d3.scale.linear()
        .domain(fc.util.extent()(data4, ['high', 'low']))
        .range([heightFraction * 4, heightFraction * 3]);

    var color = d3.scale.category10();

    var bar = fc.series.bar()
        .decorate(function(sel) {
            sel.select('path')
                .style('fill', function(d, i) { return color(i); });

            sel.append('circle')
                .attr('r', 2.0)
                .attr('fill', 'black');
        })
        .yValue(function(d) { return d.close; })
        .xScale(dateScale)
        .yScale(barScale);

    var candlestick = fc.series.candlestick()
        .decorate(function(sel) {
            sel.attr('fill', function(d, i) { return color(i); })
                .attr('stroke', function(d, i) { return color(i); })
                .attr('class', '');

            sel.append('circle')
                .attr('r', 2.0)
                .attr('fill', 'black');
        })
        .xScale(dateScale)
        .yScale(candleScale);

    var point = fc.series.point()
        .decorate(function(sel) {
            sel.select('path')
                .style('fill', function(d, i) { return color(i); });

            sel.append('circle')
                .attr('r', 2.0)
                .style('fill', 'black');
        })
        .xScale(dateScale)
        .yScale(pointScale);

    var ohlc = fc.series.ohlc()
        .decorate(function(sel) {
            sel.attr('stroke', function(d, i) { return color(i); })
                .attr('class', '');

            sel.append('circle')
                .attr('r', 2.0)
                .attr('fill', 'black');
        })
        .xScale(dateScale)
        .yScale(ohlcScale);

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

    container.append('g')
        .datum(data4)
        .call(point);

})(d3, fc);
