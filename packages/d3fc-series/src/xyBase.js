import { scaleIdentity } from 'd3-scale';
import functor from './functor';
import defined from './defined';
import alignOffset from './alignOffset';
import createBase from './base';

export default () => {

    let baseValue = () => 0;
    let crossValue = d => d.x;
    let mainValue = d => d.y;
    let align = 'center';
    let bandwidth = () => 5;
    let orient = 'vertical';

    const base = createBase({
        decorate: () => { },
        defined: (d, i) => defined(baseValue, crossValue, mainValue)(d, i),
        xScale: scaleIdentity(),
        yScale: scaleIdentity()
    });

    base.values = (d, i) => {
        const width = bandwidth(d, i);
        const offset = alignOffset(align, width);
        const xScale = base.xScale();
        const yScale = base.yScale();

        if (orient === 'vertical') {
            const y = yScale(mainValue(d, i), i);
            const y0 = yScale(baseValue(d, i), i);
            const x = xScale(crossValue(d, i), i) + offset;
            return {
                d,
                x,
                y,
                y0,
                width,
                height: y - y0,
                origin: [x, y],
                baseOrigin: [x, y0],
                transposedX: x,
                transposedY: y
            };
        } else {
            const y = xScale(mainValue(d, i), i);
            const y0 = xScale(baseValue(d, i), i);
            const x = yScale(crossValue(d, i), i) + offset;
            return {
                d,
                x,
                y,
                y0,
                width,
                height: y - y0,
                origin: [y, x],
                baseOrigin: [y0, x],
                transposedX: y,
                transposedY: x
            };
        }
    };

    base.xValues = () => orient === 'vertical' ? [crossValue] : [
        baseValue,
        mainValue
    ];
    base.yValues = () => orient !== 'vertical' ? [crossValue] : [
        baseValue,
        mainValue
    ];
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
    base.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return base;
    };

    return base;
};
