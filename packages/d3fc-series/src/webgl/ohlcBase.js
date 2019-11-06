import ohlcBase from '../ohlcBase';
import { scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default (pathGenerator) => {
    const base = ohlcBase();
    let lineWidth = 1;

    const candlestick = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const xValues = new Float32Array(filteredData.length);
        const open = new Float32Array(filteredData.length);
        const high = new Float32Array(filteredData.length);
        const low = new Float32Array(filteredData.length);
        const close = new Float32Array(filteredData.length);
        const bandwidths = new Float32Array(filteredData.length);

        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(accessor.xValues(d, i));
            open[i] = yScale.scale(accessor.open(d, i));
            high[i] = yScale.scale(accessor.high(d, i));
            low[i] = yScale.scale(accessor.low(d, i));
            close[i] = yScale.scale(accessor.close(d, i));
            bandwidths[i] = accessor.bandwidth(d, i);
        });

        pathGenerator.xValues(xValues)
            .open(open)
            .high(high)
            .low(low)
            .close(close)
            .bandwidth(bandwidths)
            .width(lineWidth)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, filteredData, 0));

        pathGenerator(filteredData.length);
    };

    function getAccessors() {
        return {
            xValues: base.crossValue(),
            open: base.openValue(),
            high: base.highValue(),
            low: base.lowValue(),
            close: base.closeValue(),
            bandwidth: base.bandwidth()
        };
    }

    candlestick.lineWidth = (...args) => {
        if (!args.length) {
            return lineWidth;
        }
        lineWidth = args[0];
        return candlestick;
    };

    rebindAll(candlestick, base, exclude('align'));
    rebind(candlestick, pathGenerator, 'context');

    return candlestick;
};
