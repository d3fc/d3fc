(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        var decorate = fc.utilities.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d) { return d.date; },
            yOpenValue = function(d) { return d.open; },
            yHighValue = function(d) { return d.high; },
            yLowValue = function(d) { return d.low; },
            yCloseValue = function(d) { return d.close; },
            barWidth = fc.utilities.fractionalBarWidth(0.75);


        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return xScale(xValue(d)); };
        var yOpen = function(d) { return yScale(yOpenValue(d)); };
        var yHigh = function(d) { return yScale(yHighValue(d)); };
        var yLow = function(d) { return yScale(yLowValue(d)); };
        var yClose = function(d) { return yScale(yCloseValue(d)); };

        var candlestick = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'candlestick', data, xValue);

                g.enter()
                    .append('path');

                g.classed({
                        'up': function(d) {
                            return yCloseValue(d) > yOpenValue(d);
                        },
                        'down': function(d) {
                            return yCloseValue(d) < yOpenValue(d);
                        }
                    });

                var width = barWidth(data.map(x));

                g.select('path')
                    .attr('d', function(d) {
                        // Move to the opening price
                        var body = 'M' + (x(d) - width / 2) + ',' + yOpen(d) +
                        // Draw the width
                        'h' + width +
                        // Draw to the closing price (vertically)
                        'V' + yClose(d) +
                        // Draw the width
                        'h' + -width +
                        // Move back to the opening price
                        'V' + yOpen(d) +
                        // Close the path
                        'z';

                        // Move to the max price of close or open; draw the high wick
                        // N.B. Math.min() is used as we're dealing with pixel values,
                        // the lower the pixel value, the higher the price!
                        var highWick = 'M' + x(d) + ',' + Math.min(yClose(d), yOpen(d)) +
                        'V' + yHigh(d);

                        // Move to the min price of close or open; draw the low wick
                        // N.B. Math.max() is used as we're dealing with pixel values,
                        // the higher the pixel value, the lower the price!
                        var lowWick = 'M' + x(d) + ',' + Math.max(yClose(d), yOpen(d)) +
                        'V' + yLow(d);

                        return body + highWick + lowWick;
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
