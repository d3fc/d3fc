import errorBarBase from '../errorBarBase';
import isIdentityScale from '../isIdentityScale';
import { glErrorBar, scaleMapper  } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = errorBarBase();

    const draw = glErrorBar();

    let equals = (previousData, data) => false;
    let previousData = [];

    const errorBar = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (isIdentityScale(xScale.scale) && isIdentityScale(yScale.scale) && !equals(previousData, data)) {
            previousData = data;

            const xValues = new Float32Array(data.length);
            const high = new Float32Array(data.length);
            const low = new Float32Array(data.length);
            const bandwidth = new Float32Array(data.length);
            const defined = new Float32Array(data.length);

            data.forEach((d, i) => {
                xValues[i] = xScale.scale(base.crossValue()(d, i));
                high[i] = yScale.scale(base.highValue()(d, i));
                low[i] = yScale.scale(base.lowValue()(d, i));
                bandwidth[i] = base.bandwidth()(d, i);
                defined[i] = base.defined()(d, i);
            });

            draw.xValues(xValues)
                .highValues(high)
                .lowValues(low)
                .bandwidth(bandwidth)
                .defined(defined);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    errorBar.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return errorBar;
    };

    rebindAll(errorBar, base,  exclude('align'));
    rebind(errorBar, draw, 'context', 'lineWidth');

    return errorBar;
};
