(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.exponentialMovingAverage = function() {

        var ema = fc.indicators.algorithms.calculators.slidingWindow()
                .accumulator(d3.mean)
                .value(function(d) { return d.close; });

        var mergeFunction = function(datum, ma) { datum.exponentialMovingAverage = ma; };

        var mergedAlgorithm = fc.indicators.algorithms.merge()
                .algorithm(ema)
                .merge(mergeFunction);

        var exponentialMovingAverage = function(data) {
            return mergedAlgorithm(data);
        };

        d3.rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
        d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

        return exponentialMovingAverage;
    };
}(d3, fc));
