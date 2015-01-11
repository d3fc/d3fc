(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        var yScale = d3.scale.linear();

        var yOpen = fc.utilities.valueAccessor('open'),
            yHigh = fc.utilities.valueAccessor('high'),
            yLow = fc.utilities.valueAccessor('low'),
            yClose = fc.utilities.valueAccessor('close');

        var isUpDay = function(d) {
            return yClose(d) > yOpen(d);
        };
        var isDownDay = function(d) {
            return !isUpDay(d);
        };

        var line = d3.svg.line()
            .x(function(d) {
                return d.x;
            })
            .y(function(d) {
                return d.y;
            });

        var highLowLines = function(bars) {

            var paths = bars.selectAll('.high-low-line').data(function(d) {
                return [d];
            });

            paths.enter().append('path');

            paths.classed('high-low-line', true)
                .attr('d', function(d) {
                    return line([
                        {x: candlestick.xScale.value(candlestick.xValue.value(d)), y: yScale(yHigh(d))},
                        {x: candlestick.xScale.value(candlestick.xValue.value(d)), y: yScale(yLow(d))}
                    ]);
                });
        };

        var rectangles = function(bars, width) {
            var rect;

            rect = bars.selectAll('rect').data(function(d) {
                return [d];
            });

            rect.enter().append('rect');

            rect.attr('x', function(d) {
                    return candlestick.xScale.value(candlestick.xValue.value(d)) - (width / 2.0);
                })
                .attr('y', function(d) {
                    return isUpDay(d) ? yScale(yClose(d)) : yScale(yOpen(d));
                })
                .attr('width', width)
                .attr('height', function(d) {
                    return isUpDay(d) ?
                        yScale(yOpen(d)) - yScale(yClose(d)) :
                        yScale(yClose(d)) - yScale(yOpen(d));
                });
        };

        var candlestick = function(selection) {
            var series, bars;

            selection.each(function(data) {
                series = d3.select(this).selectAll('.candlestick-series').data([data]);

                series.enter().append('g')
                    .classed('candlestick-series', true);

                bars = series.selectAll('.bar')
                    .data(data, candlestick.xValue.value);

                bars.enter()
                    .append('g')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });

                var xPixelValues = data.map(function(d) {
                    return candlestick.xScale.value(candlestick.xValue.value(d));
                });
                var width = candlestick.barWidth.value(xPixelValues);

                highLowLines(bars);
                rectangles(bars, width);

                bars.exit().remove();

                candlestick.decorate.value(bars);
            });
        };

        candlestick.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));

        candlestick.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.5));

        candlestick.decorate = fc.utilities.property(fc.utilities.fn.noop);

        candlestick.xScale = fc.utilities.property(d3.time.scale());

        candlestick.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return candlestick;
        };

        candlestick.yOpen = function(value) {
            if (!arguments.length) {
                return yOpen;
            }
            yOpen = value;
            return candlestick;
        };

        candlestick.yHigh = function(value) {
            if (!arguments.length) {
                return yHigh;
            }
            yHigh = value;
            return candlestick;
        };

        candlestick.yLow = function(value) {
            if (!arguments.length) {
                return yLow;
            }
            yLow = value;
            return candlestick;
        };

        candlestick.yClose = function(value) {
            if (!arguments.length) {
                return yClose;
            }
            yClose = value;
            return candlestick;
        };

        return candlestick;

    };
}(d3, fc));
