import ohlcBase from '../ohlcBase';
import { scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default (pathGenerator) => {
    const base = ohlcBase();

    const candlestick = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const xValues = new Float32Array(filteredData.length);
        const open = new Float32Array(filteredData.length);
        const high = new Float32Array(filteredData.length);
        const low = new Float32Array(filteredData.length);
        const close = new Float32Array(filteredData.length);
        const bandwidths = new Float32Array(filteredData.length);

        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(base.crossValue()(d, i));
            open[i] = yScale.scale(base.openValue()(d, i));
            high[i] = yScale.scale(base.highValue()(d, i));
            low[i] = yScale.scale(base.lowValue()(d, i));
            close[i] = yScale.scale(base.closeValue()(d, i));
            bandwidths[i] = base.bandwidth()(d, i);
        });

        pathGenerator.xValues(xValues)
            .openValues(open)
            .highValues(high)
            .lowValues(low)
            .closeValues(close)
            .bandwidth(bandwidths)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, filteredData, 0));

        pathGenerator(filteredData.length);
    };

    rebindAll(candlestick, base, exclude('align'));
    rebind(candlestick, pathGenerator, 'context', 'lineWidth');

    return candlestick;
};
