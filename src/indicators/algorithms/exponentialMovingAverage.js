(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.exponentialMovingAverage = function() {

        var ema = fc.indicators.algorithms.calculators.slidingWindow()
                .accumulator(d3.mean)
                .value(function(d) { return d.close; });

        var merge = function(datum, ma) { datum.exponentialMovingAverage = ma; };

        var exponentialMovingAverage = function(data) {
            var algorithm = fc.indicators.algorithms.merge()
                .algorithm(ema)
                .merge(merge);

            algorithm(data);
        };

        exponentialMovingAverage.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return exponentialMovingAverage;
        };

        d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

        return exponentialMovingAverage;
    };
}(d3, fc));
