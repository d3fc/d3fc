(function(d3, fc) {
    'use strict';

    fc.indicators.computers.merge = function() {

        var merge = fc.utilities.fn.noop,
            algorithm = fc.indicators.algorithms.slidingWindow();

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
