import d3 from 'd3';
import slidingWindow from './slidingWindow';

// Indicator algorithms are not designed to accomodate leading 'undefined' value.
// This adapter adds that functionality by adding a corresponding number
// of 'undefined' values to the output.
export default function () {

    var algorithm = slidingWindow()
        .accumulator(d3.mean);
    var undefinedValue = d3.functor(undefined),
        defined = function (value) { return value === undefined; };

    function undefinedArrayOfLength(length) {
        return Array.apply(null, new Array(length)).map(undefinedValue);
    }

    var undefinedInputAdapter = function (data) {
        var undefinedCount = 0;
        while (defined(data[undefinedCount]) && undefinedCount < data.length) {
            undefinedCount ++;
        }

        var nonUndefinedData = data.slice(undefinedCount);

        return undefinedArrayOfLength(undefinedCount).concat(algorithm(nonUndefinedData));
    };

    undefinedInputAdapter.algorithm = function (x) {
        if (!arguments.length) {
            return algorithm;
        }
        algorithm = x;
        return undefinedInputAdapter;
    };
    undefinedInputAdapter.undefinedValue = function (x) {
        if (!arguments.length) {
            return undefinedValue;
        }
        undefinedValue = d3.functor(x);
        return undefinedInputAdapter;
    };
    undefinedInputAdapter.defined = function (x) {
        if (!arguments.length) {
            return defined;
        }
        defined = x;
        return undefinedInputAdapter;
    };

    return undefinedInputAdapter;
}
