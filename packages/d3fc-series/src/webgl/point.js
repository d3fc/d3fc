import xyBase from '../xyBase';
import { glPoint, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();
    let size = 64;

    let draw = glPoint();

    const point = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const xValues = new Float32Array(filteredData.length);
        const yValues = new Float32Array(filteredData.length);
        const sizes = new Float32Array(filteredData.length);
        filteredData.forEach((d, i) => {
            const sizeFn = typeof size === 'function' ? size : () => size;
            xValues[i] = xScale.scale(accessor.x(d, i));
            yValues[i] = yScale.scale(accessor.y(d, i));
            sizes[i] = sizeFn(d);
        });

        draw.xValues(xValues)
            .yValues(yValues)
            .sizes(sizes)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, filteredData, 0));

        draw(filteredData.length);
    };

    function getAccessors() {
        if (base.orient() === 'vertical') {
            return {
                x: base.crossValue(),
                y: base.mainValue()
            };
        } else {
            return {
                x: base.mainValue(),
                y: base.crossValue()
            };
        }
    }

    point.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = args[0];
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(point, draw, 'context');

    return point;
};
