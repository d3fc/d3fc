import ohlcBase from '../ohlcBase';
import isIdentityScale from '../isIdentityScale';
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
    let previousData = [];

    const candlestick = (data) => {
        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
            openValueAttribute.value((d, i) => yScale.scale(base.openValue()(d, i))).data(data);
            highValueAttribute.value((d, i) => yScale.scale(base.highValue()(d, i))).data(data);
            lowValueAttribute.value((d, i) => yScale.scale(base.lowValue()(d, i))).data(data);
            closeValueAttribute.value((d, i) => yScale.scale(base.closeValue()(d, i))).data(data);
            bandwidthAttribute.value((d, i) => base.bandwidth()(d, i)).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        pathGenerator.xScale(xScale.glScale)
            .yScale(yScale.glScale)
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

    rebindAll(candlestick, base, exclude('align'));
    rebind(candlestick, pathGenerator, 'context', 'lineWidth');

    return candlestick;
};
