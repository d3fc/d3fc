import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import { glBar, scaleMapper } from '@d3fc/d3fc-webgl';
import { exclude, rebind, rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const draw = glBar();

    let equals = (previousData, data) => false;
    let previousData = [];

    const bar = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            const xValues = new Float32Array(data.length);
            const y0Values = new Float32Array(data.length);
            const yValues = new Float32Array(data.length);
            const widths = new Float32Array(data.length);
            const defined = new Float32Array(data.length);

            data.forEach((d, i) => {
                xValues[i] = xScale.scale(base.crossValue()(d, i));
                widths[i] = xScale.scale(base.bandwidth()(d, i));
                y0Values[i] = yScale.scale(base.baseValue()(d, i));
                yValues[i] = yScale.scale(base.mainValue()(d, i));
                defined[i] = base.defined()(d, i);
            });

            draw.xValues(xValues)
                .y0Values(y0Values)
                .yValues(yValues)
                .widths(widths)
                .defined(defined);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    bar.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return bar;
    };

    rebindAll(bar, base, exclude('align'));
    rebind(bar, draw, 'context');

    return bar;
};
