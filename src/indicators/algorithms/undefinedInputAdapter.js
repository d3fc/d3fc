(function(d3, fc) {
    'use strict';

    // Indicator algorithms are not designed to accomodate leading 'undefined' value.
    // This adapter adds that functionality by adding a corresponding number
    // of 'undefined' values to the output.
    fc.indicators.algorithms.undefinedInputAdapter = function(algorithm) {

        function undefinedArrayOfLength(length) {
            return Array.apply(undefined, new Array(length));
        }

        var undefinedInputAdapter = function(data) {
            var undefinedCount = 0;
            while (data[undefinedCount] === undefined && undefinedCount < data.length) {
                undefinedCount ++;
            }

            var nonUndefinedData = data.slice(undefinedCount);

            return undefinedArrayOfLength(undefinedCount).concat(algorithm(nonUndefinedData));
        };

        return undefinedInputAdapter;
    };
}(d3, fc));
