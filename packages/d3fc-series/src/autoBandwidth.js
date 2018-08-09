import { select, selection } from 'd3-selection';
import { rebindAll } from '@d3fc/d3fc-rebind';
import { pairs, min, ascending } from 'd3-array';

const sortUnique = arr =>
    arr.sort(ascending)
        .filter((value, index, self) => self.indexOf(value, index + 1) === -1);

export default (adaptee) => {

    let widthFraction = 0.75;

    // computes the bandwidth as a fraction of the smallest distance between the datapoints
    const computeBandwidth = (screenValues) => {
        // return some default value if there are not enough datapoints to compute the width
        if (screenValues.length <= 1) {
            return 10;
        }

        screenValues = sortUnique(screenValues);

        // compute the distance between neighbouring items
        const neighbourDistances = pairs(screenValues)
            .map((tuple) => Math.abs(tuple[0] - tuple[1]));

        const minDistance = min(neighbourDistances);
        return widthFraction * minDistance;
    };

    const determineBandwith = (crossScale, data, accessor) => {
        // if the cross-scale has a bandwidth function, i.e. it is a scaleBand, use
        // this to determine the width
        if (crossScale.bandwidth) {
            return crossScale.bandwidth();
        } else {
            // grouped series expect a nested array, which is flattened out
            const flattenedData = Array.isArray(data) ? [].concat(...data) : data;

            // obtain an array of points along the crossValue axis, mapped to screen coordinates.
            const crossValuePoints = flattenedData.filter(adaptee.defined())
                .map(accessor())
                .map(crossScale);

            const width = computeBandwidth(crossValuePoints);

            return width;
        }
    };

    const autoBandwidth = (arg) => {

        const computeWidth = (data) => {

            if (adaptee.xBandwidth && adaptee.yBandwidth) {
                adaptee.xBandwidth(determineBandwith(adaptee.xScale(), data, adaptee.xValue));
                adaptee.yBandwidth(determineBandwith(adaptee.yScale(), data, adaptee.yValue));
            } else {
                // if the series has an orient property, use this to determine the cross-scale, otherwise
                // assume it is the x-scale
                const crossScale = (adaptee.orient && adaptee.orient() === 'horizontal')
                    ? adaptee.yScale() : adaptee.xScale();

                adaptee.bandwidth(determineBandwith(crossScale, data, adaptee.crossValue));
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
