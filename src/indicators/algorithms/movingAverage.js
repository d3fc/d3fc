(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.movingAverage = function() {

        var ma = fc.indicators.algorithms.calculators.slidingWindow()
                .accumulator(d3.mean)
                .value(function(d) { return d.close; });

        var mergeFunction = function(datum, ma) { datum.movingAverage = ma; };

        var mergedAlgorithm = fc.indicators.algorithms.merge()
                .algorithm(ma)
                .merge(mergeFunction);

        var movingAverage = function(data) {
            return mergedAlgorithm(data);
        };

        d3.rebind(movingAverage, mergedAlgorithm, 'merge');
        d3.rebind(movingAverage, ma, 'windowSize', 'undefinedValue', 'value');

        return movingAverage;
    };
}(d3, fc));
