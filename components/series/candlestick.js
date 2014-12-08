(function (d3, fc) {
    'use strict';

    fc.series.candlestick = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var yOpen = function(d) { return d.open; },
            yHigh = function(d) { return d.high; },
            yLow = function(d) { return d.low; },
            yClose = function(d) { return d.close; };

        var rectangleWidth = 5;

        var isUpDay = function(d) {
            return yClose(d) > yOpen(d);
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var line = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var highLowLines = function (bars) {

            var paths = bars.selectAll('.high-low-line').data(function (d) {
                return [d];
            });

            paths.enter().append('path');

            paths.classed('high-low-line', true)
                .attr('d', function (d) {
                    return line([
                        {x: xScale(d.date), y: yScale(yHigh(d))},
                        {x: xScale(d.date), y: yScale(yLow(d))}
                    ]);
                });
        };

        var rectangles = function (bars) {
            var rect;

            rect = bars.selectAll('rect').data(function (d) {
                return [d];
            });

            rect.enter().append('rect');

            rect.attr('x', function (d) {
                return xScale(d.date) - (rectangleWidth / 2.0);
            })
                .attr('y', function (d) {
                    return isUpDay(d) ? yScale(yClose(d)) : yScale(yOpen(d));
                })
                .attr('width', rectangleWidth)
                .attr('height', function (d) {
                    return isUpDay(d) ?
                        yScale(yOpen(d)) - yScale(yClose(d)) :
                        yScale(yClose(d)) - yScale(yOpen(d));
                });
        };

        var candlestick = function (selection) {
            var series, bars;

            selection.each(function (data) {
                series = d3.select(this).selectAll('.candlestick-series').data([data]);

                series.enter().append('g')
                    .classed('candlestick-series', true);

                bars = series.selectAll('.bar')
                    .data(data, function (d) {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });

                highLowLines(bars);
                rectangles(bars);

                bars.exit().remove();


            });
        };

        candlestick.zoom = function (selection) {
            selection.selectAll('.candlestick-series')
                .attr('transform', 'translate(' + d3.event.translate[0] + ',0)scale(' + d3.event.scale + ',1)');
        };

        candlestick.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return candlestick;
        };

        candlestick.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return candlestick;
        };

        candlestick.rectangleWidth = function (value) {
            if (!arguments.length) {
                return rectangleWidth;
            }
            rectangleWidth = value;
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
