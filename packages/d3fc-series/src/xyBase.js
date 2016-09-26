import {scaleIdentity} from 'd3-scale';
import functor from './functor';
import defined from './defined';
import fractionalBarWidth from './fractionalBarWidth';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let baseValue = () => 0;
    let crossValue = d => d.x;
    let mainValue = d => d.y;
    let decorate = () => {};
    let barWidth = fractionalBarWidth(0.75);
    let orient = 'vertical';

    const base = () => {};

    base.defined = (d, i) => defined(baseValue, crossValue, mainValue)(d, i);

    base.values = (d, i) => {
        if (orient === 'vertical') {
            const y = yScale(mainValue(d, i));
            const y0 = yScale(baseValue(d, i));
            const x = xScale(crossValue(d, i));
            return {
                d,
                x,
                y,
                y0,
                height: y - y0,
                origin: [x, y],
                baseOrigin: [x, y0],
                transposedX: x,
                transposedY: y
            };
        } else {
            const y = xScale(mainValue(d, i));
            const y0 = xScale(baseValue(d, i));
            const x = yScale(crossValue(d, i));
            return {
                d,
                x,
                y,
                y0,
                height: y - y0,
                origin: [y, x],
                baseOrigin: [y0, x],
                transposedX: y,
                transposedY: x
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
    base.baseValue = (...args) => {
        if (!args.length) {
            return baseValue;
        }
        baseValue = functor(args[0]);
        return base;
    };
    base.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = functor(args[0]);
        return base;
    };
    base.mainValue = (...args) => {
        if (!args.length) {
            return mainValue;
        }
        mainValue = functor(args[0]);
        return base;
    };
    base.barWidth = (...args) => {
        if (!args.length) {
            return barWidth;
        }
        barWidth = functor(args[0]);
        return base;
    };
    base.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return base;
    };

    return base;
};
