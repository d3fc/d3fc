import { select, selection } from 'd3-selection';
import { rebindAll } from 'd3fc-rebind';
import { pairs, min } from 'd3-array';

export default (adaptee) => {

    let widthFraction = 0.75;

    // computes the bandwidth as a fraction of the smallest distance between the datapoints
    const computeBandwidth = (screenValues) => {
        // return some default value if there are not enough datapoints to compute the width
        if (screenValues.length <= 1) {
            return 10;
        }

        screenValues.sort();

        // compute the distance between neighbouring items
        const neighbourDistances = pairs(screenValues)
            .map((tuple) => Math.abs(tuple[0] - tuple[1]));

        const minDistance = min(neighbourDistances);
        return widthFraction * minDistance;
    };

    const autoBandwidth = (arg) => {

        const computeWidth = (data) => {
            // if the series has an orient property, use this to determine the cross-scale, otherwise
            // assume it is the x-scale
            const crossScale = (adaptee.orient && adaptee.orient() === 'horizontal')
                ? adaptee.yScale() : adaptee.xScale();

            // if the cross-scale has a bandwidth function, i.e. it is a scaleBand, use
            // this to determine the width
            if (crossScale.bandwidth) {
                adaptee.bandwidth(crossScale.bandwidth());
            } else {
                // grouped series expect a nested array, which is flattened out
                const flattenedData = Array.isArray(data) ? [].concat(...data) : data;

                // obtain an array of points along the crossValue axis, mapped to screen coordinates.
                const crossValuePoints = flattenedData.filter(adaptee.defined)
                    .map(adaptee.crossValue())
                    .map(crossScale);

                const width = computeBandwidth(crossValuePoints);

                adaptee.bandwidth(width);
            }
        };

        if (arg instanceof selection) {
            arg.each((data, index, group) => {
                computeWidth(data);
                adaptee(select(group[index]));
            });
        } else {
            computeWidth(arg);
            adaptee(arg);
        }
    };

    rebindAll(autoBandwidth, adaptee);

    autoBandwidth.widthFraction = (...args) => {
        if (!args.length) {
            return widthFraction;
        }
        widthFraction = args[0];
        return autoBandwidth;
    };

    return autoBandwidth;
};
