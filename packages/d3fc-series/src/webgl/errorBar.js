import errorBarBase from '../errorBarBase';
import { glErrorBar, scaleMapper  } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = errorBarBase();

    const draw = glErrorBar();

    const errorBar = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const xValues = new Float32Array(filteredData.length);
        const high = new Float32Array(filteredData.length);
        const low = new Float32Array(filteredData.length);
        const bandwidth = new Float32Array(filteredData.length);

        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(base.crossValue()(d, i));
            high[i] = yScale.scale(base.highValue()(d, i));
            low[i] = yScale.scale(base.lowValue()(d, i));
            bandwidth[i] = base.bandwidth()(d, i);
        });

        draw.xValues(xValues)
            .highValues(high)
            .lowValues(low)
            .bandwidth(bandwidth)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale);

        draw(filteredData.length);
    };

    rebindAll(errorBar, base,  exclude('align'));
    rebind(errorBar, draw, 'context', 'lineWidth');

    return errorBar;
};
