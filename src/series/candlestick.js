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

        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };

        var candlestick = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'candlestick', data, xValue);

                g.enter()
                    .append('path');

                var width = barWidth(data.map(xValueScaled));

                g.each(function(d, i) {
                    var yCloseRaw = yCloseValue(d, i),
                        yOpenRaw = yOpenValue(d, i),
                        x = xValueScaled(d, i),
                        yOpen = yScale(yOpenRaw),
                        yHigh = yScale(yHighValue(d, i)),
                        yLow = yScale(yLowValue(d, i)),
                        yClose = yScale(yCloseRaw);

                    var g = d3.select(this)
                        .classed({
                            'up': function(d, i) {
                                return yCloseRaw > yOpenRaw;
                            },
                            'down': function(d, i) {
                                return yCloseRaw < yOpenRaw;
                            }
                        });
                    g.select('path')
                        .attr('d', function(d, i) {
                            // Move to the opening price
                            var body = 'M' + (x - width / 2) + ',' + yOpen +
                            // Draw the width
                            'h' + width +
                            // Draw to the closing price (vertically)
                            'V' + yClose +
                            // Draw the width
                            'h' + -width +
                            // Move back to the opening price
                            'V' + yOpen +
                            // Close the path
                            'z';

                            // Move to the max price of close or open; draw the high wick
                            // N.B. Math.min() is used as we're dealing with pixel values,
                            // the lower the pixel value, the higher the price!
                            var highWick = 'M' + x + ',' + Math.min(yClose, yOpen) +
                            'V' + yHigh;

                            // Move to the min price of close or open; draw the low wick
                            // N.B. Math.max() is used as we're dealing with pixel values,
                            // the higher the pixel value, the lower the price!
                            var lowWick = 'M' + x + ',' + Math.max(yClose, yOpen) +
                            'V' + yLow;

                            return body + highWick + lowWick;
                        });
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
