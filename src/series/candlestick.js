(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        var decorate = fc.utilities.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d, i) { return d.date; },
            yOpenValue = function(d, i) { return d.open; },
            yHighValue = function(d, i) { return d.high; },
            yLowValue = function(d, i) { return d.low; },
            yCloseValue = function(d, i) { return d.close; },
            barWidth = fc.utilities.fractionalBarWidth(0.75);

        var candlestick = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'candlestick', data, xValue);

                g.enter()
                    .append('path');

                var width = barWidth(data.map(function(d, i) { return xScale(xValue(d, i)); }));

                // we need to fake the array index because the array passed to
                // pathGenerator only ever contains one item
                var j = 0;
                var pathGenerator = fc.svg.candlestick()
                    .x(function(d, i) { return xScale(xValue(d, j)); })
                    .open(function(d, i) { return yScale(yOpenValue(d, j)); })
                    .high(function(d, i) { return yScale(yHighValue(d, j)); })
                    .low(function(d, i) { return yScale(yLowValue(d, j)); })
                    .close(function(d, i) { return yScale(yCloseValue(d, j)); })
                    .width(width);

                g.each(function(d, i) {
                    var yCloseRaw = yCloseValue(d, i),
                        yOpenRaw = yOpenValue(d, i);

                    // see comment above about faking the index
                    j = i;

                    d3.select(this)
                        .classed({
                            'up': yCloseRaw > yOpenRaw,
                            'down': yCloseRaw < yOpenRaw
                        })
                        .select('path')
                        .attr('d', pathGenerator([d]));
                });

                decorate(g);
            });
        };

        candlestick.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return candlestick;
        };
        candlestick.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return candlestick;
        };
        candlestick.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return candlestick;
        };
        candlestick.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return candlestick;
        };
        candlestick.yOpenValue = function(x) {
            if (!arguments.length) {
                return yOpenValue;
            }
            yOpenValue = x;
            return candlestick;
        };
        candlestick.yHighValue = function(x) {
            if (!arguments.length) {
                return yHighValue;
            }
            yHighValue = x;
            return candlestick;
        };
        candlestick.yLowValue = function(x) {
            if (!arguments.length) {
                return yLowValue;
            }
            yLowValue = x;
            return candlestick;
        };
        candlestick.yValue = candlestick.yCloseValue = function(x) {
            if (!arguments.length) {
                return yCloseValue;
            }
            yCloseValue = x;
            return candlestick;
        };
        candlestick.barWidth = function(x) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = d3.functor(x);
            return candlestick;
        };

        return candlestick;

    };
}(d3, fc));
