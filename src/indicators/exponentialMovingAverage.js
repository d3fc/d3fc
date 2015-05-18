(function(d3, fc) {
    'use strict';

    fc.indicators.exponentialMovingAverage = function() {

        var algorithm = fc.indicators.algorithms.exponentialMovingAverage();

        var indicator = fc.indicators.singleValuedIndicator()
            .algorithm(algorithm);

        var exponentialMovingAverage = function(selection) {
            selection.call(indicator);
        };

        d3.rebind(exponentialMovingAverage, algorithm, 'windowSize');
        d3.rebind(exponentialMovingAverage, indicator, 'xValue', 'yValue', 'xScale', 'yScale');

        return exponentialMovingAverage;
    };
}(d3, fc));