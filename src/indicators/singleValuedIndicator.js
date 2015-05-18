(function(d3, fc) {
    'use strict';

    fc.indicators.singleValuedIndicator = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; },
            outputValueKey = 'outputValue',
            algorithm = fc.indicators.algorithms.slidingWindow();

        var outputLine = fc.series.line();

        var singleValuedIndicator = function(selection) {

            algorithm.value(yValue);

            outputLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(function(d, i) { return d[outputValueKey]; });

            selection.each(function(data) {

                d3.zip(data, algorithm(data))
                    .forEach(function(tuple) {
                        tuple[0][outputValueKey] = tuple[1];
                    });

                d3.select(this)
                    .call(outputLine);
            });
        };


        singleValuedIndicator.outputValueKey = function(x) {
            if (!arguments.length) {
                return outputValueKey;
            }
            outputValueKey = x;
            return singleValuedIndicator;
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
                return algorithm;
            }
            algorithm = x;
            return singleValuedIndicator;
        };

        return singleValuedIndicator;
    };
}(d3, fc));
