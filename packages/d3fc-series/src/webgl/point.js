import { glDraw, circlePointShader, circleFill, circleStroke, circleAntiAlias } from '@d3fc/d3fc-webgl';
import xyBase from '../xyBase';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import scaleMapper from '@d3fc/d3fc-webgl/src/scale/scaleMapper';

export default () => {
    let context = null;
    const base = xyBase();
    let size = 64;

    let draw = glDraw();

    const point = (data) => {
        const filteredData = data.filter(base.defined());
        const program = draw.program();

        const shaderBuilder = circlePointShader();
        program.vertexShader(shaderBuilder.vertex());
        program.fragmentShader(shaderBuilder.fragment());

        program.numElements(filteredData.length);

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        xScale.glScale.coordinate(0);
        yScale.glScale.coordinate(1);

        const accessor = getAccessors();
        const numComponents = 3;
        const points = new Float32Array(filteredData.length * numComponents);
        let pi = 0;
        filteredData.forEach((d, i) => {
            const sizeFn = typeof size === 'function' ? size : () => size;
            points[pi++] = xScale.scale(accessor.x(d, i));
            points[pi++] = yScale.scale(accessor.y(d, i));
            points[pi++] = sizeFn(d, i);
        });

        program.mode(context.POINTS);

        draw.context(context);
        draw.data(points);
        draw.xScale(xScale.glScale);
        draw.yScale(yScale.glScale);

        program.fill = circleFill();
        program.stroke = circleStroke();
        program.antialias = circleAntiAlias();

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
