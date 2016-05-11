import { mean } from 'd3-array';
import { functor } from './fn';
import slidingWindow from './slidingWindow';

// Indicator algorithms are not designed to accommodate leading 'undefined' value.
// This adapter adds that functionality by adding a corresponding number
// of 'undefined' values to the output.
export default function() {

    let algorithm = slidingWindow()
        .accumulator(mean);
    let undefinedValue = () => undefined;
    let defined = value => algorithm.value()(value) == null;
    const undefinedArrayOfLength = length => Array.apply(null, new Array(length)).map(undefinedValue);

    const undefinedInputAdapter = data => {
        let undefinedCount = 0;
        while (defined(data[undefinedCount]) && undefinedCount < data.length) {
            undefinedCount++;
        }
        const nonUndefinedData = data.slice(undefinedCount);
        return undefinedArrayOfLength(undefinedCount).concat(algorithm(nonUndefinedData));
    };

    undefinedInputAdapter.algorithm = (...args) => {
        if (!args.length) {
            return algorithm;
        }
        algorithm = args[0];
        return undefinedInputAdapter;
    };
    undefinedInputAdapter.undefinedValue = (...args) => {
        if (!args.length) {
            return undefinedValue;
        }
        undefinedValue = functor(args[0]);
        return undefinedInputAdapter;
    };
    undefinedInputAdapter.defined = (...args) => {
        if (!args.length) {
            return defined;
        }
        defined = args[0];
        return undefinedInputAdapter;
    };

    return undefinedInputAdapter;
}
