import errorBarBase from '../errorBarBase';
import { glErrorBar, scaleMapper  } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = errorBarBase();

    let draw = glErrorBar();

    const errorBar = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const xValues = new Float32Array(filteredData.length);
        const high = new Float32Array(filteredData.length);
        const low = new Float32Array(filteredData.length);
        const bandwidth = new Float32Array(filteredData.length);

        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(accessor.xValues(d, i));
            high[i] = yScale.scale(accessor.high(d, i));
            low[i] = yScale.scale(accessor.low(d, i));
            bandwidth[i] = accessor.bandwidth(d, i);
        });

        draw.xValues(xValues)
            .high(high)
            .low(low)
            .bandwidth(bandwidth)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale);

        draw(filteredData.length);
    };

    function getAccessors() {
        return {
            xValues: base.crossValue(),
            high: base.highValue(),
            low: base.lowValue(),
            bandwidth: base.bandwidth()
        };
    }

    rebindAll(errorBar, base,  exclude('align'))
    rebind(errorBar, draw, 'context');

    return errorBar;
};
