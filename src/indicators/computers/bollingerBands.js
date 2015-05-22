(function(d3, fc) {
    'use strict';

    fc.indicators.computers.bollingerBands = function() {

        var ma = fc.indicators.algorithms.bollingerBands(),
            yValue = function(d) { return d.close; },
            merge = function(datum, boll) {
                datum.upper = boll.upper;
                datum.lower = boll.lower;
                datum.average = boll.average;
            };

        var bollingerBands = function(data) {
            ma.value(yValue);

            var computer = fc.indicators.computers.merge()
                .algorithm(ma)
                .merge(merge);

            computer(data);
        };

        return bollingerBands;
    };
}(d3, fc));
