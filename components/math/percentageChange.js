(function(d3, fc) {
    'use strict';

    fc.math.percentageChange = function() {

        var percentageChange = function(data) {

            if (data.length === 0) {
                return [];
            }

            var initialIndex = percentageChange.initialIndex.value(data);
            var initialValue = percentageChange.inputValue.value(data[initialIndex]);

            return data.slice(initialIndex, data.length)
                .map(function(d) {
                    var result = (percentageChange.inputValue.value(d) - initialValue) / initialValue;
                    return percentageChange.outputValue.value(d, result);
                });
        };

        percentageChange.initialIndex = fc.utilities.functorProperty(0);
        percentageChange.inputValue = fc.utilities.property(fc.utilities.fn.identity);
        percentageChange.outputValue = fc.utilities.property(function(obj, value) { return value; });

        return percentageChange;
    };
}(d3, fc));
