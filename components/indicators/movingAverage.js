define ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

    sl.indicators.movingAverage = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = 0,
            yLabel = '',
            averagePoints = 0,
            css = '';

        var movingAverage = function (selection) {

            var line = d3.svg.line();
            line.x(function (d) { return xScale(d.date); });

            selection.each(function (data) {

                if (!isNaN(parseFloat(yValue))) {

                    line.y(yScale(yValue));
                }
                else {

                    if (averagePoints === 0) {
                        
                        line.y(function (d) { return yScale(d[yValue]); });
                    }
                    else {

                        line.y(function (d, i) {

                                var count = Math.min(averagePoints, i + 1),
                                    first = i + 1 - count;

                                var sum = 0;
                                for (var index = first; index <= i; ++index) {
                                    sum += data[index][yValue];
                                }
                                var mean = sum / count;

                                return yScale(mean);
                            });
                    }
                }

                var path = d3.select(this).selectAll('.indicator')
                    .data([data]);

                path.enter().append('path');

                path.attr('d', line)
                    .classed('indicator', true)
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

        movingAverage.yLabel = function (value) {
            if (!arguments.length) {
                return yLabel;
            }
            yLabel = value;
            return movingAverage;
        };

        movingAverage.averagePoints = function (value) {
            if (!arguments.length) {
                return averagePoints;
            }
            averagePoints = value;
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
});