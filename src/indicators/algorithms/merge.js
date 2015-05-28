(function(d3, fc) {
    'use strict';

    // applies an algorithm to an array, merging the result back into
    // the source array using the given merge function.
    fc.indicators.algorithms.merge = function() {

        var merge = fc.utilities.fn.noop,
            algorithm = fc.indicators.algorithms.calculators.slidingWindow();

        var mergeCompute = function(data) {
            d3.zip(data, algorithm(data))
                .forEach(function(tuple) {
                    merge(tuple[0], tuple[1]);
                });
        };

        mergeCompute.algorithm = function(x) {
            if (!arguments.length) {
                return algorithm;
            }
            algorithm = x;
            return mergeCompute;
        };

        mergeCompute.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return mergeCompute;
        };

        return mergeCompute;
    };
}(d3, fc));
