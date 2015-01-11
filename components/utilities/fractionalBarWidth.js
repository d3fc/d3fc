(function(d3, fc) {
    'use strict';

    // the barWidth property of the various series takes a function which, when given an
    // array of x values, returns a suitable width. This function creates a width which is
    // equals to the smallest distance between neighbouring datapoints multiplied
    // by the given factor
    fc.utilities.fractionalBarWidth = function(fraction) {

        return function(pixelValues) {
            pixelValues.sort();

            // creates a new array as a result of applying the 'fn' function to
            // the consecutive pairs of items in the source array
            function pair(arr, fn) {
                var res = [];
                for (var i = 1; i < arr.length; i++) {
                    res.push(fn(arr[i], arr[i - 1]));
                }
                return res;
            }

            // compute the distance between neighbouring items
            var neighbourDistances = pair(pixelValues, function(first, second) {
                return Math.abs(first - second);
            });

            var minDistance = d3.min(neighbourDistances);
            return fraction * minDistance;
        };
    };
}(d3, fc));