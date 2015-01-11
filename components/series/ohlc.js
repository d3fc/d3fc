(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        // Configurable attributes
        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

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
                    // data-join, keying on the xValue
                    .data(data, ohlc.xValue.value);

                bars.enter()
                    .append('path')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay,
                    'static-day': isStaticDay
                });

                var xPixelValues = data.map(function(d) {
                    return xScale(ohlc.xValue.value(d));
                });
                var width = ohlc.barWidth.value(xPixelValues);
                var halfWidth = width / 2;

                bars.attr('d', function(d) {
                    var moveToLow = 'M' + date(d) + ',' + low(d),
                        verticalToHigh = 'V' + high(d),
                        openTick = 'M' + date(d) + ',' + open(d) + 'h' + (-halfWidth),
                        closeTick = 'M' + date(d) + ',' + close(d) + 'h' + halfWidth;
                    return moveToLow + verticalToHigh + openTick + closeTick;
                });

                bars.exit().remove();

                ohlc.decorate.value(bars);
            });
        };

        ohlc.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        ohlc.decorate = fc.utilities.property(fc.utilities.fn.noop);

        ohlc.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));

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