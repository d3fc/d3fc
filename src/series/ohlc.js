(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

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

        var ohlc = function(selection) {
            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'ohlc', data, xValue);

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
                var halfWidth = width / 2;

                g.select('path')
                    .attr('d', function(d) {
                        var moveToLow = 'M' + x(d) + ',' + yLow(d),
                            verticalToHigh = 'V' + yHigh(d),
                            openTick = 'M' + x(d) + ',' + yOpen(d) + 'h' + (-halfWidth),
                            closeTick = 'M' + x(d) + ',' + yClose(d) + 'h' + halfWidth;
                        return moveToLow + verticalToHigh + openTick + closeTick;
                    });

                decorate(g);
            });
        };

        ohlc.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return ohlc;
        };
        ohlc.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return ohlc;
        };
        ohlc.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return ohlc;
        };
        ohlc.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return ohlc;
        };
        ohlc.yOpenValue = function(x) {
            if (!arguments.length) {
                return yOpenValue;
            }
            yOpenValue = x;
            return ohlc;
        };
        ohlc.yHighValue = function(x) {
            if (!arguments.length) {
                return yHighValue;
            }
            yHighValue = x;
            return ohlc;
        };
        ohlc.yLowValue = function(x) {
            if (!arguments.length) {
                return yLowValue;
            }
            yLowValue = x;
            return ohlc;
        };
        ohlc.yValue = ohlc.yCloseValue = function(x) {
            if (!arguments.length) {
                return yCloseValue;
            }
            yCloseValue = x;
            return ohlc;
        };
        ohlc.barWidth = function(x) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = d3.functor(x);
            return ohlc;
        };

        return ohlc;
    };
}(d3, fc));
