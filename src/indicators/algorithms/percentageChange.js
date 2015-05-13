(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.percentageChange = function() {

        var baseIndex = d3.functor(0),
            inputValue = fc.utilities.fn.identity,
            outputValue = function(obj, value) { return value; };

        var percentageChange = function(data) {

            if (data.length === 0) {
                return [];
            }

            var baseValue = inputValue(data[baseIndex(data)]);

            return data.map(function(d) {
                    var result = (inputValue(d) - baseValue) / baseValue;
                    return outputValue(d, result);
                });
        };

        percentageChange.baseIndex = function(x) {
            if (!arguments.length) {
                return baseIndex;
            }
            baseIndex = d3.functor(x);
            return percentageChange;
        };
        percentageChange.inputValue = function(x) {
            if (!arguments.length) {
                return inputValue;
            }
            inputValue = x;
            return percentageChange;
        };
        percentageChange.outputValue = function(x) {
            if (!arguments.length) {
                return outputValue;
            }
            outputValue = x;
            return percentageChange;
        };

        return percentageChange;
    };
}(d3, fc));
