import xyBase from '../xyBase';
import { glArea, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    let draw = glArea();

    const area = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const xValues = new Float32Array(data.length);
        const yValues = new Float32Array(data.length);
        const defined = new Float32Array(data.length);

        data.forEach((d, i) => {
            xValues[i] = xScale.scale(accessor.x(d, i));
            yValues[i] = yScale.scale(accessor.y(d, i));
            defined[i] = accessor.defined(d, i);
        });

        draw.xValues(xValues)
            .yValues(yValues)
            .y0Value(yScale.scale(accessor.y0(0, 0)))
            .defined(defined)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale);

        draw(data.length);
    };

    const getAccessors = () => ({
        x: base.crossValue(),
        y: base.mainValue(),
        y0: base.baseValue(),
        defined: base.defined()
    });

    rebindAll(area, base, exclude('bandwidth', 'align'));
    rebind(area, draw, 'context');

    return area;
};
