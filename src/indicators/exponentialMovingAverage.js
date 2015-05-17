(function(d3, fc) {
    'use strict';

    fc.indicators.exponentialMovingAverage = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; };

        var algorithm = fc.indicators.algorithms.exponentialMovingAverage();

        var averageLine = fc.series.line();

        var exponentialMovingAverage = function(selection) {

            algorithm.value(yValue);

            averageLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(function(d, i) { return d.exponentialMovingAverage; });

            selection.each(function(data) {

                data = d3.zip(data, algorithm(data))
                    .map(function(tuple) {
                        tuple[0].exponentialMovingAverage = tuple[1];
                        return tuple[0];
                    });

                d3.select(this)
                    .datum(data)
                    .call(averageLine);
            });
        };


        exponentialMovingAverage.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return exponentialMovingAverage;
        };
        exponentialMovingAverage.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return exponentialMovingAverage;
        };
        exponentialMovingAverage.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return exponentialMovingAverage;
        };
        exponentialMovingAverage.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return exponentialMovingAverage;
        };

        d3.rebind(exponentialMovingAverage, algorithm, 'days');

        return exponentialMovingAverage;
    };
}(d3, fc));
