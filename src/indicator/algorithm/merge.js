(function(d3, fc) {
    'use strict';

    // applies an algorithm to an array, merging the result back into
    // the source array using the given merge function.
    fc.indicator.algorithm.merge = function() {

        var merge = fc.util.fn.noop,
            algorithm = fc.indicator.algorithm.calculator.slidingWindow();

        var mergeCompute = function(data) {
            return d3.zip(data, algorithm(data))
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
