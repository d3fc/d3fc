(function(d3, fc) {
    'use strict';

    fc.indicators.exponentialMovingAverage = function() {

        var algorithm = fc.indicators.algorithms.exponentialMovingAverage();

        var indicator = fc.indicators.singleValuedIndicator(algorithm);

        var exponentialMovingAverage = function(selection) {
            indicator(selection);
        };

        d3.rebind(exponentialMovingAverage, algorithm, 'windowSize');
        d3.rebind(exponentialMovingAverage, indicator, 'xValue', 'yValue', 'xScale', 'yScale');

        return exponentialMovingAverage;
    };
}(d3, fc));