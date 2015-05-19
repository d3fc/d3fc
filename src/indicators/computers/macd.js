(function(d3, fc) {
    'use strict';

    fc.indicators.computers.macd = function() {

        var macdAlgorithm = fc.indicators.algorithms.macd()
            .value(function(d) { return d.close; });

        var merge = function(datum, m) {
                datum.macd = m.macd;
                datum.signal = m.signal;
                datum.divergence = m.divergence;
            };

        var macd = function(data) {
            var computer = fc.indicators.computers.merge()
                .algorithm(macdAlgorithm)
                .merge(merge);

            computer(data);
        };

        macd.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return macd;
        };

        return macd;
    };
}(d3, fc));
