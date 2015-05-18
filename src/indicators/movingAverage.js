(function(d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function() {

        var algorithm = fc.indicators.algorithms.slidingWindow()
            .accumulator(d3.mean);

        var indicator = fc.indicators.singleValuedIndicator()
            .algorithm(algorithm);

        var movingAverage = function(selection) {
            selection.call(indicator);
        };

        d3.rebind(movingAverage, algorithm, 'windowSize');
        d3.rebind(movingAverage, indicator, 'xValue', 'yValue', 'xScale', 'yScale');

        return movingAverage;
    };
}(d3, fc));
