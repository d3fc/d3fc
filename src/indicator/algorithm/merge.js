import calculator from './calculator/slidingWindow';
import d3 from 'd3';
import {noop} from '../../util/fn';

// applies an algorithm to an array, merging the result back into
// the source array using the given merge function.
export default function () {

    var merge = noop,
        algorithm = calculator();

    var mergeCompute = function (data) {
        return d3.zip(data, algorithm(data))
            .forEach(function (tuple) {
                merge(tuple[0], tuple[1]);
            });
    };

    mergeCompute.algorithm = function (x) {
        if (!arguments.length) {
            return algorithm;
        }
        algorithm = x;
        return mergeCompute;
    };

    mergeCompute.merge = function (x) {
        if (!arguments.length) {
            return merge;
        }
        merge = x;
        return mergeCompute;
    };

    return mergeCompute;
}
