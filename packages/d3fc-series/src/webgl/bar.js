import xyBase from '../xyBase';
import { glBar, scaleMapper } from '@d3fc/d3fc-webgl';
import { exclude, rebind, rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const draw = glBar();

    const bar = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const xValues = new Float32Array(filteredData.length);
        const y0Values = new Float32Array(filteredData.length);
        const yValues = new Float32Array(filteredData.length);
        const widths = new Float32Array(filteredData.length);
        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(base.crossValue()(d, i));
            y0Values[i] = yScale.scale(base.baseValue()(d, i));
            yValues[i] = yScale.scale(base.mainValue()(d, i));
            widths[i] = yScale.scale(base.bandwidth()(d, i));
        });

        draw.xValues(xValues)
            .y0Values(y0Values)
            .yValues(yValues)
            .widths(widths)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => {
                base.decorate()(program, filteredData, 0);
            });
        draw(filteredData.length);
    };

    rebindAll(bar, base, exclude('align'));
    rebind(bar, draw, 'context');

    return bar;
};
