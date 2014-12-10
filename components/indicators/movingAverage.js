(function (d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return 0; },
            averagePoints = 5,
            css = '';

        var movingAverage = function (selection) {
            var line = d3.svg.line();
            line.defined(function (d, i) { return i >= averagePoints; });
            line.x(function (d) { return xScale(d.date); });

            selection.each(function (data) {

                if (averagePoints === 0) {
                    line.y(function (d) { return yScale(yValue(d)); });
                } else {
                    line.y(function (d, i) {
                        var first = i + 1 - averagePoints;
                        var sum = 0;
                        for (var index = first; index <= i; ++index) {
                            sum += yValue(data[index]);
                        }
                        var mean = sum / averagePoints;

                        return yScale(mean);
                    });
                }

                var path = d3.select(this).selectAll('.moving-average')
                    .data([data]);

                path.enter().append('path');

                path.attr('d', line)
                    .classed('moving-average', true)
                    .classed(css, true);

                path.exit().remove();
            });
        };

        movingAverage.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return movingAverage;
        };

        movingAverage.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return movingAverage;
        };

        movingAverage.yValue = function (value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return movingAverage;
        };

        movingAverage.averagePoints = function (value) {
            if (!arguments.length) {
                return averagePoints;
            }
            if (value >= 0) {
                averagePoints = value;
            }
            return movingAverage;
        };

        movingAverage.css = function (value) {
            if (!arguments.length) {
                return css;
            }
            css = value;
            return movingAverage;
        };

        return movingAverage;
    };
}(d3, fc));
