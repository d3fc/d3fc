import {line as lineShape} from 'd3-shape';
import { scaleIdentity } from 'd3-scale';
import {rebind} from '@d3fc/d3fc-rebind';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let orient = 'horizontal';

    const lineData = lineShape();

    const instance = (data) => {
        if (orient !== 'horizontal' && orient !== 'vertical') {
            throw new Error('Invalid orientation');
        }
        const horizontal = orient === 'horizontal';
        const context = lineData.context();
        // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!
        const crossScale = horizontal ? xScale : yScale;
        const valueScale = horizontal ? yScale : xScale;

        data.forEach(d => {
            context.save();
            context.beginPath();
            context.strokeStyle = '#bbb';
            context.fillStyle = 'transparent';

            lineData.context(context)(crossScale.domain().map(extent => {
                const point = [crossScale(extent), valueScale(d)];
                return horizontal ? point : point.reverse();
            }));

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

    rebind(instance, lineData, 'context');

    return instance;
};
