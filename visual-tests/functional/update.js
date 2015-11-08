(function(d3, fc) {
    'use strict';

    var generator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1))
        .filter(null);
    var data = generator(20);

    var key = function(d) { return d.date; };

    var width = 600, height = 250;

    var container = d3.select('#update')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields('date')(data))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data))
        .range([height, 0])
        .nice();

    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale)
        .key(key);

    var bar = fc.series.bar()
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale)
        .key(key);

    var line = fc.series.line()
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale);

    var candle = fc.series.candlestick()
        .xScale(dateScale)
        .yScale(priceScale)
        .key(key);

    var gridlines = fc.annotation.gridline()
        .xKey(function(d) { return d; })
        .yKey(function(d) { return d; });

    // add the components to the chart
    var multi = fc.series.multi()
      .series([gridlines, bar, line, candle, ohlc])
      .xScale(dateScale)
      .yScale(priceScale);

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
        dateScale.domain(fc.util.extent().fields('date')(data));
        priceScale.domain(fc.util.extent().fields(['high', 'low'])(data));
        container.datum(data)
            .transition()
            .duration(500)
            .call(multi);
    }, 500);
})(d3, fc);
