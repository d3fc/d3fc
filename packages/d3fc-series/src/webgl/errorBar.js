import errorBarBase from '../errorBarBase';
import isIdentityScale from '../isIdentityScale';
import {
    webglSeriesErrorBar,
    webglElementAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = errorBarBase();

    const crossValueAttribute = webglElementAttribute();
    const highValueAttribute = webglElementAttribute();
    const lowValueAttribute = webglElementAttribute();
    const bandwidthAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesErrorBar()
        .crossValueAttribute(crossValueAttribute)
        .highValueAttribute(highValueAttribute)
        .lowValueAttribute(lowValueAttribute)
        .bandwidthAttribute(bandwidthAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let previousData = [];

    const errorBar = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }

        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
            highValueAttribute.value((d, i) => yScale.scale(base.highValue()(d, i))).data(data);
            lowValueAttribute.value((d, i) => yScale.scale(base.lowValue()(d, i))).data(data);
            bandwidthAttribute.value((d, i) => base.bandwidth()(d, i)).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    errorBar.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return errorBar;
    };

    rebindAll(errorBar, base,  exclude('align'));
    rebind(errorBar, draw, 'context', 'lineWidth');

    return errorBar;
};
