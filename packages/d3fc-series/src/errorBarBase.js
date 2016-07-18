import { scaleIdentity } from 'd3-scale';
import defined from './defined';
import functor from './functor';
import fractionalBarWidth from './fractionalBarWidth';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let highValue = (d) => d.high;
    let lowValue = (d) => d.low;
    let crossValue = (d) => d.cross;
    let orient = 'vertical';
    let barWidth = fractionalBarWidth(0.5);
    let decorate = () => {};

    const base = () => {};

    base.defined = (d, i) => defined(lowValue, highValue, crossValue)(d, i);

    base.computeBarWidth = (filteredData) => {
        const scale = orient === 'vertical' ? xScale : yScale;
        return barWidth(filteredData.map((d, i) => scale(crossValue(d, i))));
    };

    base.values = (d, i) => {
        if (orient === 'vertical') {
            const y = yScale(highValue(d, i));
            return {
                origin: [xScale(crossValue(d, i)), y],
                high: 0,
                low: yScale(lowValue(d, i)) - y
            };
        } else {
            const x = xScale(lowValue(d, i));
            return {
                origin: [x, yScale(crossValue(d, i))],
                high: xScale(highValue(d, i)) - x,
                low: 0
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
    base.barWidth = (...args) => {
        if (!args.length) {
            return barWidth;
        }
        barWidth = functor(args[0]);
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
