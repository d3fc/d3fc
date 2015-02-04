(function(d3, fc) {
    'use strict';

    fc.math.percentageChange = function() {

        var percentageChange = function(data) {

            if (data.length === 0) {
                return [];
            }

            var baseIndex = percentageChange.baseIndex.value(data);
            var baseValue = percentageChange.inputValue.value(data[baseIndex]);

            return data.slice(baseIndex, data.length)
                .map(function(d) {
                    var result = (percentageChange.inputValue.value(d) - baseValue) / baseValue;
                    return percentageChange.outputValue.value(d, result);
                });
        };

        percentageChange.baseIndex = fc.utilities.functorProperty(0);
        percentageChange.inputValue = fc.utilities.property(fc.utilities.fn.identity);
        percentageChange.outputValue = fc.utilities.property(function(obj, value) { return value; });

        return percentageChange;
    };
}(d3, fc));
