import { scaleIdentity } from 'd3-scale';
import defined from './defined';
import functor from './functor';
import alignOffset from './alignOffset';
import createBase from './base';

export default () => {

    let upperQuartileValue = (d) => d.upperQuartile;
    let lowerQuartileValue = (d) => d.lowerQuartile;
    let highValue = (d) => d.high;
    let lowValue = (d) => d.low;
    let crossValue = (d) => d.value;
    let medianValue = (d) => d.median;
    let orient = 'vertical';
    let align = 'center';
    let bandwidth = () => 5;

    const base = createBase({
        decorate: () => { },
        defined: (d, i) => defined(
            lowValue,
            highValue,
            lowerQuartileValue,
            upperQuartileValue,
            crossValue,
            medianValue
        )(d, i),
        xScale: scaleIdentity(),
        yScale: scaleIdentity()
    });

    base.values = (d, i) => {
        const width = bandwidth(d, i);
        const offset = alignOffset(align, width);
        const xScale = base.xScale();
        const yScale = base.yScale();

        if (orient === 'vertical') {
            const y = yScale(highValue(d, i));
            return {
                origin: [xScale(crossValue(d, i)) + offset, y],
                high: 0,
                upperQuartile: yScale(upperQuartileValue(d, i)) - y,
                median: yScale(medianValue(d, i)) - y,
                lowerQuartile: yScale(lowerQuartileValue(d, i)) - y,
                low: yScale(lowValue(d, i)) - y,
                width
            };
        } else {
            const x = xScale(lowValue(d, i));
            return {
                origin: [x, yScale(crossValue(d, i)) + offset],
                high: xScale(highValue(d, i)) - x,
                upperQuartile: xScale(upperQuartileValue(d, i)) - x,
                median: xScale(medianValue(d, i)) - x,
                lowerQuartile: xScale(lowerQuartileValue(d, i)) - x,
                low: 0,
                width
            };
        }
    };

    base.xValues = () => orient === 'vertical' ? [crossValue] : [
        upperQuartileValue,
        lowerQuartileValue,
        highValue,
        lowValue,
        medianValue
    ];
    base.yValues = () => orient !== 'vertical' ? [crossValue] : [
        upperQuartileValue,
        lowerQuartileValue,
        highValue,
        lowValue,
        medianValue
    ];
    base.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return base;
    };
    base.lowerQuartileValue = (...args) => {
        if (!args.length) {
            return lowerQuartileValue;
        }
        lowerQuartileValue = functor(args[0]);
        return base;
    };
    base.upperQuartileValue = (...args) => {
        if (!args.length) {
            return upperQuartileValue;
        }
        upperQuartileValue = functor(args[0]);
        return base;
    };
    base.lowValue = (...args) => {
        if (!args.length) {
            return lowValue;
        }
        lowValue = functor(args[0]);
        return base;
    };
    base.highValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        highValue = functor(args[0]);
        return base;
    };
    base.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = functor(args[0]);
        return base;
    };
    base.medianValue = (...args) => {
        if (!args.length) {
            return medianValue;
        }
        medianValue = functor(args[0]);
        return base;
    };
    base.bandwidth = (...args) => {
        if (!args.length) {
            return bandwidth;
        }
        bandwidth = functor(args[0]);
        return base;
    };
    base.align = (...args) => {
        if (!args.length) {
            return align;
        }
        align = args[0];
        return base;
    };

    return base;
};
