(function(d3, fc) {
    'use strict';

    fc.indicators.computers.movingAverage = function() {

        var ma = fc.indicators.algorithms.slidingWindow()
                .accumulator(d3.mean),
            yValue = function(d) { return d.close; },
            merge = function(datum, ma) { datum.movingAverage = ma; };

        var movingAverage = function(data) {
            ma.value(yValue);

            var computer = fc.indicators.computers.merge()
                .algorithm(ma)
                .merge(merge);

            computer(data);
        };

        movingAverage.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return movingAverage;
        };

        movingAverage.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return movingAverage;
        };

        d3.rebind(movingAverage, ma, 'windowSize');

        return movingAverage;
    };
}(d3, fc));
