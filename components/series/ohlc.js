(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        // Configurable attributes
        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            tickWidth = fc.utilities.timeIntervalWidth(d3.time.day, 0.35);

        var yOpen = fc.utilities.valueAccessor('open'),
            yHigh = fc.utilities.valueAccessor('high'),
            yLow = fc.utilities.valueAccessor('low'),
            yClose = fc.utilities.valueAccessor('close');

        // Accessor functions
        var open = function(d) {
                return yScale(yOpen(d));
            },
            high = function(d) {
                return yScale(yHigh(d));
            },
            low = function(d) {
                return yScale(yLow(d));
            },
            close = function(d) {
                return yScale(yClose(d));
            },
            date = function(d) {
                return xScale(d.date);
            };

        // Up/down day logic
        var isUpDay = function(d) {
            return yClose(d) > yOpen(d);
        };
        var isDownDay = function(d) {
            return yClose(d) < yOpen(d);
        };
        var isStaticDay = function(d) {
            return yClose(d) === yOpen(d);
        };

        var makeBarPath = function(d) {
            var width = tickWidth(xScale),
                moveToLow = 'M' + date(d) + ',' + low(d),
                verticalToHigh = 'V' + high(d),
                openTick = 'M' + date(d) + ',' + open(d) + 'h' + (-width),
                closeTick = 'M' + date(d) + ',' + close(d) + 'h' + width;
            return moveToLow + verticalToHigh + openTick + closeTick;
        };

        var ohlc = function(selection) {
            selection.each(function(data) {
                // data-join in order to create the series container element
                var series = d3.select(this)
                    .selectAll('.ohlc-series')
                    .data([data]);

                series.enter()
                    .append('g')
                    .classed('ohlc-series', true);

                // create the bar paths
                var bars = series.selectAll('.bar')
                    // data-join, keying on the date (see #130)
                    .data(data, function(d) {
                        return d.date;
                    });

                bars.enter()
                    .append('path')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay,
                    'static-day': isStaticDay
                });

                bars.attr('d', makeBarPath);

                bars.exit().remove();
            });
        };

        ohlc.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return ohlc;
        };

        ohlc.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return ohlc;
        };

        ohlc.tickWidth = function(value) {
            if (!arguments.length) {
                return tickWidth;
            }
            tickWidth = d3.functor(value);
            return ohlc;
        };

        ohlc.yOpen = function(value) {
            if (!arguments.length) {
                return yOpen;
            }
            yOpen = value;
            return ohlc;
        };

        ohlc.yHigh = function(value) {
            if (!arguments.length) {
                return yHigh;
            }
            yHigh = value;
            return ohlc;
        };

        ohlc.yLow = function(value) {
            if (!arguments.length) {
                return yLow;
            }
            yLow = value;
            return ohlc;
        };

        ohlc.yClose = function(value) {
            if (!arguments.length) {
                return yClose;
            }
            yClose = value;
            return ohlc;
        };

        return ohlc;
    };
}(d3, fc));