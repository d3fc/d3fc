(function(d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; };

        var area = fc.series.area()
            .y0Value(function(d, i) {
                return d.upper;
            })
            .y1Value(function(d, i) {
                return d.lower;
            });

        var upperLine = fc.series.line()
            .yValue(function(d, i) {
                return d.upper;
            });

        var averageLine = fc.series.line()
            .yValue(function(d, i) {
                return d.average;
            });

        var lowerLine = fc.series.line()
            .yValue(function(d, i) {
                return d.lower;
            });

        var bollingerBands = function(selection) {

            var multi = fc.series.multi()
                .xScale(xScale)
                .yScale(yScale)
                .series([area, upperLine, lowerLine, averageLine]);

            area.xValue(xValue);
            upperLine.xValue(xValue);
            averageLine.xValue(xValue);
            lowerLine.xValue(xValue);

            selection.each(function(data) {
                d3.select(this)
                    .data([data])
                    .call(multi);
            });
        };

        bollingerBands.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return bollingerBands;
        };
        bollingerBands.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return bollingerBands;
        };
        bollingerBands.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return bollingerBands;
        };
        bollingerBands.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return bollingerBands;
        };

        return bollingerBands;
    };
}(d3, fc));
