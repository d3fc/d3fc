(function(d3, fc) {
    'use strict';

    fc.indicators.computers.movingAverage = function() {

        var ma = fc.indicators.algorithms.slidingWindow()
                .accumulator(d3.mean)
                .value(function(d) { return d.close; });
        var merge = function(datum, ma) { datum.movingAverage = ma; };

        var movingAverage = function(data) {
            var computer = fc.indicators.computers.merge()
                .algorithm(ma)
                .merge(merge);

            computer(data);
        };

        movingAverage.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return movingAverage;
        };

        d3.rebind(movingAverage, ma, 'windowSize', 'undefinedValue', 'value');

        return movingAverage;
    };
}(d3, fc));
