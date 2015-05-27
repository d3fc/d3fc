(function(d3, fc) {
    'use strict';

    fc.indicators.computers.exponentialMovingAverage = function() {

        var ema = fc.indicators.algorithms.slidingWindow()
                .accumulator(d3.mean)
                .value(function(d) { return d.close; });

        var merge = function(datum, ma) { datum.exponentialMovingAverage = ma; };

        var exponentialMovingAverage = function(data) {
            var computer = fc.indicators.computers.merge()
                .algorithm(ema)
                .merge(merge);

            computer(data);
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
