import boxPlotBase from '../boxPlotBase';
import { glBoxPlot, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import functor from '../functor';

export default () => {
    const base = boxPlotBase();
    let cap = functor(0.5);

    const draw = glBoxPlot();

    const boxPlot = (data) => {
        const filteredData = data.filter(base.defined());

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());
        
        const xValues = new Float32Array(filteredData.length);
        const medianValues = new Float32Array(filteredData.length);
        const upperQuartileValues = new Float32Array(filteredData.length);
        const lowerQuartileValues = new Float32Array(filteredData.length);
        const highValues = new Float32Array(filteredData.length);
        const lowValues = new Float32Array(filteredData.length);
        const bandwidth = new Float32Array(filteredData.length);
        const capWidth = new Float32Array(filteredData.length);

        filteredData.forEach((d, i) => {
            xValues[i] = xScale.scale(base.crossValue()(d, i));
            medianValues[i] = yScale.scale(base.medianValue()(d, i));
            upperQuartileValues[i] = yScale.scale(base.upperQuartileValue()(d, i));
            lowerQuartileValues[i] = xScale.scale(base.lowerQuartileValue()(d, i));
            highValues[i] = yScale.scale(base.highValue()(d, i));
            lowValues[i] = yScale.scale(base.lowValue()(d, i));
            bandwidth[i] = base.bandwidth()(d, i);
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

    boxPlot.cap = (...args) => {
        if (!args.length) {
            return cap;
        }
        cap = functor(args[0]);
        return boxPlot;
    };
    
    rebindAll(boxPlot, base, exclude('align'));
    rebind(boxPlot, draw, 'context', 'lineWidth');

    return boxPlot;
};
