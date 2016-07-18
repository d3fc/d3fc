import { pairs, min } from 'd3-array';

// the barWidth property of the various series takes a function which, when given an
// array of x values, returns a suitable width. This function creates a width which is
// equal to the smallest distance between neighbouring datapoints multiplied
// by the given factor
export default (fraction) =>
    (pixelValues) => {
        // return some default value if there are not enough datapoints to compute the width
        if (pixelValues.length <= 1) {
            return 10;
        }

        pixelValues.sort();

        // compute the distance between neighbouring items
        const neighbourDistances = pairs(pixelValues)
            .map((tuple) => Math.abs(tuple[0] - tuple[1]));

        const minDistance = min(neighbourDistances);
        return fraction * minDistance;
    };
