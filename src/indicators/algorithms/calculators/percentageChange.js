(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.calculators.percentageChange = function() {

        var baseIndex = d3.functor(0),
            value = fc.utilities.fn.identity;

        var percentageChange = function(data) {

            if (data.length === 0) {
                return [];
            }

            var baseValue = value(data[baseIndex(data)]);

            return data.map(function(d, i) {
                    return (value(d, i) - baseValue) / baseValue;
                });
        };

        percentageChange.baseIndex = function(x) {
            if (!arguments.length) {
                return baseIndex;
            }
            baseIndex = d3.functor(x);
            return percentageChange;
        };
        percentageChange.value = function(x) {
            if (!arguments.length) {
                return value;
            }
            value = x;
            return percentageChange;
        };

        return percentageChange;
    };
}(d3, fc));
