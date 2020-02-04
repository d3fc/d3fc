import ohlcBase from '../ohlcBase';
import isIdentityScale from '../isIdentityScale';
import { scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default (pathGenerator) => {
    const base = ohlcBase();

    let equals = (previousData, data) => false;
    let previousData = [];

    const candlestick = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (isIdentityScale(xScale.scale) && isIdentityScale(yScale.scale) && !equals(previousData, data)) {
            previousData = data;

            const xValues = new Float32Array(data.length);
            const open = new Float32Array(data.length);
            const high = new Float32Array(data.length);
            const low = new Float32Array(data.length);
            const close = new Float32Array(data.length);
            const bandwidths = new Float32Array(data.length);
            const defined = new Float32Array(data.length);

            data.forEach((d, i) => {
                xValues[i] = xScale.scale(base.crossValue()(d, i));
                open[i] = yScale.scale(base.openValue()(d, i));
                high[i] = yScale.scale(base.highValue()(d, i));
                low[i] = yScale.scale(base.lowValue()(d, i));
                close[i] = yScale.scale(base.closeValue()(d, i));
                bandwidths[i] = base.bandwidth()(d, i);
                defined[i] = base.defined()(d, i);
            });

            pathGenerator.xValues(xValues)
                .openValues(open)
                .highValues(high)
                .lowValues(low)
                .closeValues(close)
                .bandwidth(bandwidths)
                .defined(defined);
        }

        pathGenerator.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        pathGenerator(data.length);
    };

    candlestick.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return candlestick;
    };

    rebindAll(candlestick, base, exclude('align'));
    rebind(candlestick, pathGenerator, 'context', 'lineWidth');

    return candlestick;
};
