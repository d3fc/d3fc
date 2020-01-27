import d3Shape from 'd3-shape';
import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import { glPoint, scaleMapper, symbolMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();
    let size = 64;
    let type = d3Shape.symbolCircle;

    const draw = glPoint();

    let equals = (previousData, data) => false;
    let previousData = [];
    let filteredData = [];

    const point = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (isIdentityScale(xScale.scale) && isIdentityScale(yScale.scale) && !equals(previousData, data)) {
            previousData = data;
            filteredData = data.filter(base.defined());

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
                .sizes(sizes);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .type(symbolMapper(type))
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

    point.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        return point;
    };

    point.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(point, draw, 'context');

    return point;
};
