(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return candlestick.xScale.value(candlestick.xValue.value(d)); };
        var yOpen = function(d) { return candlestick.yScale.value(candlestick.yOpenValue.value(d)); };
        var yHigh = function(d) { return candlestick.yScale.value(candlestick.yHighValue.value(d)); };
        var yLow = function(d) { return candlestick.yScale.value(candlestick.yLowValue.value(d)); };
        var yClose = function(d) { return candlestick.yScale.value(candlestick.yCloseValue.value(d)); };

        var candlestick = function(selection) {

            selection.each(function(data) {

                var series = d3.select(this)
                    .selectAll('.candlestick-series')
                    .data([data]);

                series.enter().append('g')
                    .attr('class', 'candlestick-series');

                var g = fc.utilities.simpleDataJoin(series, 'candlestick', data, candlestick.xValue.value);

                var enter = g.enter();
                enter.append('line');
                enter.append('rect');

                g.classed({
                        'up': function(d) {
                            return candlestick.yCloseValue.value(d) > candlestick.yOpenValue.value(d);
                        },
                        'down': function(d) {
                            return candlestick.yCloseValue.value(d) < candlestick.yOpenValue.value(d);
                        }
                    });

                g.select('line')
                    .attr('x1', x)
                    .attr('y1', yHigh)
                    .attr('x2', x)
                    .attr('y2', yLow);

                var barWidth = candlestick.barWidth.value(data.map(x));

                g.select('rect')
                    .attr('x', function(d) {
                        return x(d) - barWidth / 2;
                    })
                    .attr('y', function(d) {
                        return Math.min(yOpen(d), yClose(d));
                    })
                    .attr('width', barWidth)
                    .attr('height', function(d) {
                        return Math.abs(yClose(d) - yOpen(d));
                    });

                candlestick.decorate.value(g);
            });
        };

        candlestick.decorate = fc.utilities.property(fc.utilities.fn.noop);
        candlestick.xScale = fc.utilities.property(d3.time.scale());
        candlestick.yScale = fc.utilities.property(d3.scale.linear());
        candlestick.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        candlestick.yOpenValue = fc.utilities.property(function(d) { return d.open; });
        candlestick.yHighValue = fc.utilities.property(function(d) { return d.high; });
        candlestick.yLowValue = fc.utilities.property(function(d) { return d.low; });
        candlestick.yCloseValue = fc.utilities.property(function(d) { return d.close; });
        candlestick.xValue = fc.utilities.property(function(d) { return d.date; });

        return candlestick;

    };
}(d3, fc));
