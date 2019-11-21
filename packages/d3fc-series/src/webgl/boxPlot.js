import boxPlotBase from '../boxPlotBase';
import { glBoxPlot, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import functor from '../functor';

export default () => {
    const base = boxPlotBase();
    let cap = functor(0.5);

    let draw = glBoxPlot();

    const boxPlot = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();
        
        const xValues = new Float32Array(filteredData.length);
        const medianValues = new Float32Array(filteredData.length);
        const upperQuartileValues = new Float32Array(filteredData.length);
        const lowerQuartileValues = new Float32Array(filteredData.length);
        const highValues = new Float32Array(filteredData.length);
        const lowValues = new Float32Array(filteredData.length);
        const bandwidth = new Float32Array(filteredData.length);
        const capWidth = new Float32Array(filteredData.length);

        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(accessor.xValues(d, i));
            medianValues[i] = yScale.scale(accessor.medianValues(d, i));
            upperQuartileValues[i] = yScale.scale(accessor.upperQuartileValues(d, i));
            lowerQuartileValues[i] = xScale.scale(accessor.lowerQuartileValues(d, i));
            highValues[i] = yScale.scale(accessor.highValues(d, i));
            lowValues[i] = yScale.scale(accessor.lowValues(d, i));
            bandwidth[i] = accessor.bandwidth(d, i);
            capWidth[i] = bandwidth[i] * cap(d, i);
        });

        draw.xValues(xValues)
            .medianValues(medianValues)
            .upperQuartileValues(upperQuartileValues)
            .lowerQuartileValues(lowerQuartileValues)
            .highValues(highValues)
            .lowValues(lowValues)
            .bandwidth(bandwidth)
            .capWidth(capWidth)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale);

        draw(filteredData.length);
    };

    function getAccessors() {
        return {
            xValues: base.crossValue(),
            medianValues: base.medianValue(),
            upperQuartileValues: base.upperQuartileValue(),
            lowerQuartileValues: base.lowerQuartileValue(),
            highValues: base.highValue(),
            lowValues: base.lowValue(),
            bandwidth: base.bandwidth()
        };
    }

    draw.cap = (...args) => {
        if (!args.length) {
            return cap;
        }
        cap = args[0];
        return draw;
    };
    
    rebindAll(boxPlot, base, exclude('align'));
    rebind(boxPlot, draw, 'context');

    return boxPlot;
};
