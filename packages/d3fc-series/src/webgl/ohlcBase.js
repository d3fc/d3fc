import ohlcBase from '../ohlcBase';
import {
    webglElementAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default (pathGenerator) => {
    const base = ohlcBase();

    const crossValueAttribute = webglElementAttribute();
    const openValueAttribute = webglElementAttribute();
    const highValueAttribute = webglElementAttribute();
    const lowValueAttribute = webglElementAttribute();
    const closeValueAttribute = webglElementAttribute();
    const bandwidthAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_BYTE);

    pathGenerator
        .crossValueAttribute(crossValueAttribute)
        .openValueAttribute(openValueAttribute)
        .highValueAttribute(highValueAttribute)
        .lowValueAttribute(lowValueAttribute)
        .closeValueAttribute(closeValueAttribute)
        .bandwidthAttribute(bandwidthAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let scaleMapper = webglScaleMapper;
    let previousData = [];
    let previousXScale = null;
    let previousYScale = null;

    const candlestick = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());
        const dataChanged = !equals(previousData, data);

        if (dataChanged) {
            previousData = data;
            bandwidthAttribute.value((d, i) => base.bandwidth()(d, i)).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }
        if (dataChanged || xScale.scale !== previousXScale) {
            previousXScale = xScale.scale;
            crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
        }
        if (dataChanged || yScale.scale !== previousYScale) {
            previousYScale = yScale.scale;
            openValueAttribute.value((d, i) => yScale.scale(base.openValue()(d, i))).data(data);
            highValueAttribute.value((d, i) => yScale.scale(base.highValue()(d, i))).data(data);
            lowValueAttribute.value((d, i) => yScale.scale(base.lowValue()(d, i))).data(data);
            closeValueAttribute.value((d, i) => yScale.scale(base.closeValue()(d, i))).data(data);
        }

        pathGenerator.xScale(xScale.webglScale)
            .yScale(yScale.webglScale)
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

    candlestick.scaleMapper = (...args) => {
        if (!args.length) {
            return scaleMapper;
        }
        scaleMapper = args[0];
        return candlestick;
    };

    rebindAll(candlestick, base, exclude('align'));
    rebind(candlestick, pathGenerator, 'context', 'lineWidth');

    return candlestick;
};
