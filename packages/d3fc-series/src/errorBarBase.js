import { scaleIdentity } from 'd3-scale';
import defined from './defined';
import functor from './functor';
import alignOffset from './alignOffset';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let highValue = (d) => d.high;
    let lowValue = (d) => d.low;
    let crossValue = (d) => d.cross;
    let orient = 'vertical';
    let align = 'center';
    let bandwidth = () => 5;
    let decorate = () => {};

    const base = () => {};

    base.defined = (d, i) => defined(lowValue, highValue, crossValue)(d, i);

    base.values = (d, i) => {
        const width = bandwidth(d, i);
        const offset = alignOffset(align, width);

        if (orient === 'vertical') {
            const y = yScale(highValue(d, i));
            return {
                origin: [xScale(crossValue(d, i)) + offset, y],
                high: 0,
                low: yScale(lowValue(d, i)) - y,
                width
            };
        } else {
            const x = xScale(lowValue(d, i));
            return {
                origin: [x, yScale(crossValue(d, i)) + offset],
                high: xScale(highValue(d, i)) - x,
                low: 0,
                width
            };
        }
    };

    base.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return base;
    };
    base.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return base;
    };
    base.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return base;
    };
    base.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
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
    base.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return base;
    };

    return base;
};
