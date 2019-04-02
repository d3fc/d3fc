import { scaleIdentity } from 'd3-scale';
import constant from '../constant';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let orient = 'horizontal';
    let fromValue = d => d.from;
    let toValue = d => d.to;
    let decorate = () => {};
    let context = null;

    var instance = (data) => {

        if (orient !== 'horizontal' && orient !== 'vertical') {
            throw new Error('Invalid orientation');
        }

        if (context === null) {
            throw new Error('Context is not defined');
        }

        const horizontal = orient === 'horizontal';
        // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!
        const crossScale = horizontal ? xScale : yScale;
        const valueScale = horizontal ? yScale : xScale;
        const crossScaleRange = crossScale.range();

        data.forEach((d, i) => {
            context.save();
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.fillStyle = '#bbb';

            decorate(context, d, i);
            const x = horizontal ? crossScaleRange[0] : valueScale(fromValue(d));
            const y = horizontal ? valueScale(fromValue(d)) : crossScaleRange[0];
            const width = horizontal ? crossScaleRange[1] - crossScaleRange[0] : valueScale(toValue(d)) - valueScale(fromValue(d));
            const height = horizontal ? valueScale(toValue(d)) - valueScale(fromValue(d)) : crossScaleRange[1] - crossScaleRange[0];
            context.fillRect(x, y, width, height);

            context.fill();
            context.stroke();
            context.closePath();
            context.restore();
        });
    };

    instance.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return instance;
    };
    instance.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return instance;
    };
    instance.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return instance;
    };
    instance.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return instance;
    };
    instance.fromValue = (...args) => {
        if (!args.length) {
            return fromValue;
        }
        fromValue = constant(args[0]);
        return instance;
    };
    instance.toValue = (...args) => {
        if (!args.length) {
            return toValue;
        }
        toValue = constant(args[0]);
        return instance;
    };
    instance.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return instance;
    };

    return instance;
};
