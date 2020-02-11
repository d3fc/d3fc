import boxPlotBase from '../boxPlotBase';
import isIdentityScale from '../isIdentityScale';
import {
    webglSeriesBoxPlot,
    webglElementAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import functor from '../functor';

export default () => {
    const base = boxPlotBase();

    const crossValueAttribute = webglElementAttribute();
    const highValueAttribute = webglElementAttribute();
    const upperQuartileValueAttribute = webglElementAttribute();
    const medianValueAttribute = webglElementAttribute();
    const lowerQuartileValueAttribute = webglElementAttribute();
    const lowValueAttribute = webglElementAttribute();
    const bandwidthAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_SHORT);
    const capWidthAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesBoxPlot()
        .crossValueAttribute(crossValueAttribute)
        .highValueAttribute(highValueAttribute)
        .upperQuartileValueAttribute(upperQuartileValueAttribute)
        .medianValueAttribute(medianValueAttribute)
        .lowerQuartileValueAttribute(lowerQuartileValueAttribute)
        .lowValueAttribute(lowValueAttribute)
        .bandwidthAttribute(bandwidthAttribute)
        .capWidthAttribute(capWidthAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let previousData = [];
    let capWidth = functor(20);

    const boxPlot = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }

        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;
        
            crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
            highValueAttribute.value((d, i) => yScale.scale(base.highValue()(d, i))).data(data);
            upperQuartileValueAttribute.value((d, i) => yScale.scale(base.upperQuartileValue()(d, i))).data(data);
            medianValueAttribute.value((d, i) => yScale.scale(base.medianValue()(d, i))).data(data);
            lowerQuartileValueAttribute.value((d, i) => yScale.scale(base.lowerQuartileValue()(d, i))).data(data);
            lowValueAttribute.value((d, i) => yScale.scale(base.lowValue()(d, i))).data(data);
            bandwidthAttribute.value((d, i) => base.bandwidth()(d, i)).data(data);
            capWidthAttribute.value((d, i) => capWidth(d, i)).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    boxPlot.capWidth = (...args) => {
        if (!args.length) {
            return capWidth;
        }
        capWidth = functor(args[0]);
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
