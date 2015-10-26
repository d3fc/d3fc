import d3 from 'd3';

// the barWidth property of the various series takes a function which, when given an
// array of x values, returns a suitable width. This function creates a width which is
// equal to the smallest distance between neighbouring datapoints multiplied
// by the given factor
export default function (fraction) {

    return function (pixelValues) {
        // return some default value if there are not enough datapoints to compute the width
        if (pixelValues.length <= 1) {
            return 10;
        }

        pixelValues.sort();

        // compute the distance between neighbouring items
        var neighbourDistances = d3.pairs(pixelValues)
            .map(function (tuple) {
                return Math.abs(tuple[0] - tuple[1]);
            });

        var minDistance = d3.min(neighbourDistances);
        return fraction * minDistance;
    };
}
