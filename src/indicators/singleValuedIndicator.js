(function(d3, fc) {
    'use strict';

    fc.indicators.singleValuedIndicator = function(algorithm) {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; };

        var outputLine = fc.series.line();

        var singleValuedIndicator = function(selection) {

            algorithm.value(yValue);

            outputLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(function(d, i) { return d.singleValuedIndicator; });

            selection.each(function(data) {

                data = d3.zip(data, algorithm(data))
                    .map(function(tuple) {
                        tuple[0].singleValuedIndicator = tuple[1];
                        return tuple[0];
                    });

                d3.select(this)
                    .datum(data)
                    .call(outputLine);
            });
        };


        singleValuedIndicator.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return singleValuedIndicator;
        };
        singleValuedIndicator.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return singleValuedIndicator;
        };
        singleValuedIndicator.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return singleValuedIndicator;
        };
        singleValuedIndicator.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return singleValuedIndicator;
        };
        singleValuedIndicator.algorithm = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return singleValuedIndicator;
        };

        return singleValuedIndicator;
    };
}(d3, fc));
