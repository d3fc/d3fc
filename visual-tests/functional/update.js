(function(d3, fc) {
    'use strict';

    var generator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));
    var stream = generator.stream();
    var data = stream.take(20);

    var key = function(d) { return d.date; };

    var width = 600, height = 250;

    var container = d3.select('#update')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var dateExtent = fc.util.extentDate()
        .accessors([function(d) { return d.date; }]);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(dateExtent(data))
        .range([0, width])
        .nice();

    var priceExtent = fc.util.extentLinear()
      .accessors([
          function(d) { return d.high; },
          function(d) { return d.low; }
      ]);

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(priceExtent(data))
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
        data.push(stream.next());
        data.shift();
        data.forEach(function(d) {
            d.low = d.low - 0.1;
        });
        dateScale.domain(dateExtent(data));
        priceScale.domain(priceExtent(data));
        container.datum(data)
            .transition()
            .duration(500)
            .call(multi);
    }, 500);
})(d3, fc);
