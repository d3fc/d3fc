(function(d3, fc) {
    'use strict';

    fc.indicator.algorithm.exponentialMovingAverage = function() {

        var ema = fc.indicator.algorithm.calculator.slidingWindow()
                .accumulator(d3.mean)
                .value(function(d) { return d.close; });

        var mergedAlgorithm = fc.indicator.algorithm.merge()
                .algorithm(ema)
                .merge(function(datum, ma) { datum.exponentialMovingAverage = ma; });

        var exponentialMovingAverage = function(data) {
            return mergedAlgorithm(data);
        };

        d3.rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
        d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

        return exponentialMovingAverage;
    };
}(d3, fc));
