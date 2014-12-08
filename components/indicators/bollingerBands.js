(function (d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var yValue = function(d) { return d.close; },
            movingAverage = 20,
            standardDeviations = 2;

        var cssBandArea = 'bollingerBandArea',
            cssBandUpper = 'bollingerBandUpper',
            cssBandLower = 'bollingerBandLower',
            cssAverage = 'bollingerAverage';

        var bollingerBands = function (selection) {

            var areaBands = d3.svg.area(),
                lineUpper = d3.svg.line(),
                lineLower = d3.svg.line(),
                lineAverage = d3.svg.line();

            areaBands.x(function (d) { return xScale(d.date); });
            lineUpper.x(function (d) { return xScale(d.date); });
            lineLower.x(function (d) { return xScale(d.date); });
            lineAverage.x(function (d) { return xScale(d.date); });

            var calculateMovingAverage = function (data, i) {

                if (movingAverage === 0) {
                    return yValue(data[i]);
                }

                var count = Math.min(movingAverage, i + 1),
                first = i + 1 - count;

                var sum = 0;
                for (var index = first; index <= i; ++index) {
                    var x = yValue(data[index]);
                    sum += x;
                }

                return sum / count;
            };

            var calculateMovingStandardDeviation = function (data, i, avg) {

                if (movingAverage === 0) {
                    return 0;
                }

                var count = Math.min(movingAverage, i + 1),
                    first = i + 1 - count;

                var sum = 0;
                for (var index = first; index <= i; ++index) {
                    var x = yValue(data[index]);
                    var dx = x - avg;
                    sum += (dx * dx);
                }

                var variance = sum / count;
                return Math.sqrt(variance);
            };

            selection.each(function (data) {

                var bollingerData = {};
                for (var index = 0; index < data.length; ++index) {

                    var date = data[index].date;

                    var avg = calculateMovingAverage(data, index);
                    var sd = calculateMovingStandardDeviation(data, index, avg);

                    bollingerData[date] = {avg: avg, sd: sd};
                }

                areaBands.y0(function (d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg + (sd * standardDeviations));
                });

                areaBands.y1(function (d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg - (sd * standardDeviations));
                });

                lineUpper.y(function (d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg + (sd * standardDeviations));
                });

                lineLower.y(function (d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg - (sd * standardDeviations));
                });

                lineAverage.y(function (d) {

                    var avg = bollingerData[d.date].avg;

                    return yScale(avg);
                });

                var prunedData = [];
                for (var n = movingAverage; n < data.length; ++n) {
                    prunedData.push(data[n]);
                }

                var pathArea = d3.select(this).selectAll('.area')
                    .data([prunedData]);
                var pathUpper = d3.select(this).selectAll('.upper')
                    .data([prunedData]);
                var pathLower = d3.select(this).selectAll('.lower')
                    .data([prunedData]);
                var pathAverage = d3.select(this).selectAll('.average')
                    .data([prunedData]);

                pathArea.enter().append('path');
                pathUpper.enter().append('path');
                pathLower.enter().append('path');
                pathAverage.enter().append('path');

                pathArea.attr('d', areaBands)
                    .classed('area', true)
                    .classed(cssBandArea, true);
                pathUpper.attr('d', lineUpper)
                    .classed('upper', true)
                    .classed(cssBandUpper, true);
                pathLower.attr('d', lineLower)
                    .classed('lower', true)
                    .classed(cssBandLower, true);
                pathAverage.attr('d', lineAverage)
                    .classed('average', true)
                    .classed(cssAverage, true);

                pathArea.exit().remove();
                pathUpper.exit().remove();
                pathLower.exit().remove();
                pathAverage.exit().remove();
            });
        };

        bollingerBands.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return bollingerBands;
        };

        bollingerBands.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return bollingerBands;
        };

        bollingerBands.yValue = function (value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return bollingerBands;
        };

        bollingerBands.movingAverage = function (value) {
            if (!arguments.length) {
                return movingAverage;
            }
            if (value >= 0) {
                movingAverage = value;
            }
            return bollingerBands;
        };

        bollingerBands.standardDeviations = function (value) {
            if (!arguments.length) {
                return standardDeviations;
            }
            if (value >= 0) {
                standardDeviations = value;
            }
            return bollingerBands;
        };

        bollingerBands.cssBandUpper = function (value) {
            if (!arguments.length) {
                return cssBandUpper;
            }
            cssBandUpper = value;
            return bollingerBands;
        };

        bollingerBands.cssBandLower = function (value) {
            if (!arguments.length) {
                return cssBandLower;
            }
            cssBandLower = value;
            return bollingerBands;
        };

        bollingerBands.cssBandArea = function (value) {
            if (!arguments.length) {
                return cssBandArea;
            }
            cssBandArea = value;
            return bollingerBands;
        };

        bollingerBands.cssAverage = function (value) {
            if (!arguments.length) {
                return cssAverage;
            }
            cssAverage = value;
            return bollingerBands;
        };

        return bollingerBands;
    };
}(d3, fc));
