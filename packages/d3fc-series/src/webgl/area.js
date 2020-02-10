import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import { glArea, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const draw = glArea();

    let equals = (previousData, data) => false;
    let previousData = [];

    const area = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            const xValues = new Float32Array(data.length);
            const yValues = new Float32Array(data.length);
            const y0Values = new Float32Array(data.length);
            const defined = new Float32Array(data.length);

            data.forEach((d, i) => {
                xValues[i] = xScale.scale(base.crossValue()(d, i));
                yValues[i] = yScale.scale(base.mainValue()(d, i));
                y0Values[i] = yScale.scale(base.baseValue()(d, i));
                defined[i] = base.defined()(d, i);
            });

            draw.xValues(xValues)
                .yValues(yValues)
                .y0Values(y0Values)
                .defined(defined);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    area.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return area;
    };

    rebindAll(area, base, exclude('bandwidth', 'align'));
    rebind(area, draw, 'context');

    return area;
};
