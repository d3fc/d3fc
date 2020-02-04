import boxPlotBase from '../boxPlotBase';
import isIdentityScale from '../isIdentityScale';
import { glBoxPlot, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import functor from '../functor';

export default () => {
    const base = boxPlotBase();
    let cap = functor(0.5);

    const draw = glBoxPlot();

    let equals = (previousData, data) => false;
    let previousData = [];

    const boxPlot = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (isIdentityScale(xScale.scale) && isIdentityScale(yScale.scale) && !equals(previousData, data)) {
            previousData = data;
        
            const xValues = new Float32Array(data.length);
            const medianValues = new Float32Array(data.length);
            const upperQuartileValues = new Float32Array(data.length);
            const lowerQuartileValues = new Float32Array(data.length);
            const highValues = new Float32Array(data.length);
            const lowValues = new Float32Array(data.length);
            const bandwidth = new Float32Array(data.length);
            const capWidth = new Float32Array(data.length);
            const defined = new Float32Array(data.length);

            data.forEach((d, i) => {
                xValues[i] = xScale.scale(base.crossValue()(d, i));
                medianValues[i] = yScale.scale(base.medianValue()(d, i));
                upperQuartileValues[i] = yScale.scale(base.upperQuartileValue()(d, i));
                lowerQuartileValues[i] = xScale.scale(base.lowerQuartileValue()(d, i));
                highValues[i] = yScale.scale(base.highValue()(d, i));
                lowValues[i] = yScale.scale(base.lowValue()(d, i));
                bandwidth[i] = base.bandwidth()(d, i);
                capWidth[i] = bandwidth[i] * cap(d, i);
                defined[i] = base.defined()(d, i);
            });

            draw.xValues(xValues)
                .medianValues(medianValues)
                .upperQuartileValues(upperQuartileValues)
                .lowerQuartileValues(lowerQuartileValues)
                .highValues(highValues)
                .lowValues(lowValues)
                .bandwidth(bandwidth)
                .capWidth(capWidth)
                .defined(defined);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    boxPlot.cap = (...args) => {
        if (!args.length) {
            return cap;
        }
        cap = functor(args[0]);
        return boxPlot;
    };

    boxPlot.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return boxPlot;
    };
    
    rebindAll(boxPlot, base, exclude('align'));
    rebind(boxPlot, draw, 'context', 'lineWidth');

    return boxPlot;
};
