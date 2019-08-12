import { glPoint } from '@d3fc/d3fc-webgl';
import xyBase from '../xyBase';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import scaleMapper from '@d3fc/d3fc-webgl/src/scale/scaleMapper';

export default () => {
    let context = null;
    const base = xyBase();
    let size = 70;

    let draw = glPoint();

    const point = (data) => {
        const filteredData = data.filter(base.defined());
        const program = draw.program();

        program.numElements(filteredData.length);

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const x = new Float32Array(filteredData.length);
        const y = new Float32Array(filteredData.length);
        const s = new Float32Array(filteredData.length);
        filteredData.forEach((d, i) => {
            const sizeFn = typeof size === 'function' ? size : () => size;
            x[i] = xScale.scale(accessor.x(d, i));
            y[i] = yScale.scale(accessor.y(d, i));
            s[i] = sizeFn(d);
        });

        draw.context(context);
        draw.x(x)
            .y(y)
            .size(s);
        draw.xScale(xScale.glScale);
        draw.yScale(yScale.glScale);
        draw.decorate(() => base.decorate()(program, filteredData, 0));
        draw();
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

    point.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return point;
    };

    point.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = args[0];
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));

    return point;
};
