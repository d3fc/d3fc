import { shapeBar } from '@d3fc/d3fc-shape';
import { scaleIdentity } from 'd3-scale';
import { rebind } from '@d3fc/d3fc-rebind';
import constant from '../constant';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let orient = 'horizontal';
    let fromValue = d => d.from;
    let toValue = d => d.to;
    let decorate = () => {};

    const pathGenerator = shapeBar()
      .horizontalAlign('right')
      .verticalAlign('top');

    var instance = (data) => {

        if (orient !== 'horizontal' && orient !== 'vertical') {
            throw new Error('Invalid orientation');
        }

        const context = pathGenerator.context();
        const horizontal = orient === 'horizontal';
        // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!
        const crossScale = horizontal ? xScale : yScale;
        const valueScale = horizontal ? yScale : xScale;
        const crossScaleRange = crossScale.range();
        const crossScaleSize = crossScaleRange[1] - crossScaleRange[0];
        const valueAxisStart = horizontal ? 'x' : 'y';
        const crossAxisStart = horizontal ? 'y' : 'x';
        const valueAxisDimension = horizontal ? 'height' : 'width';
        const crossAxisDimension = horizontal ? 'width' : 'height';

        data.forEach((d, i) => {
            context.save();
            context.beginPath();
            context.strokeStyle = 'transparent';

            pathGenerator[crossAxisStart](valueScale(fromValue(d)));
            pathGenerator[valueAxisStart](crossScaleRange[0]);
            pathGenerator[crossAxisDimension](crossScaleSize);
            pathGenerator[valueAxisDimension](valueScale(toValue(d)) - valueScale(fromValue(d)));

            decorate(context, d, i);
            pathGenerator.context(context)([d], i);

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

    rebind(instance, pathGenerator, 'context');

    return instance;
};
