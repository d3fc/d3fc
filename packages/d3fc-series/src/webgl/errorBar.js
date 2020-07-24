import errorBarBase from '../errorBarBase';
import {
    webglSeriesErrorBar,
    webglAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = errorBarBase();

    const crossValueAttribute = webglAttribute();
    const highValueAttribute = webglAttribute();
    const lowValueAttribute = webglAttribute();
    const bandwidthAttribute = webglAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesErrorBar()
        .crossValueAttribute(crossValueAttribute)
        .highValueAttribute(highValueAttribute)
        .lowValueAttribute(lowValueAttribute)
        .bandwidthAttribute(bandwidthAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let scaleMapper = webglScaleMapper;
    let previousData = [];
    let previousXScale = null;
    let previousYScale = null;

    const errorBar = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }


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
            highValueAttribute.value((d, i) => yScale.scale(base.highValue()(d, i))).data(data);
            lowValueAttribute.value((d, i) => yScale.scale(base.lowValue()(d, i))).data(data);
        }

        draw.xScale(xScale.webglScale)
            .yScale(yScale.webglScale)
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

    errorBar.scaleMapper = (...args) => {
        if (!args.length) {
            return scaleMapper;
        }
        scaleMapper = args[0];
        return errorBar;
    };

    rebindAll(errorBar, base,  exclude('align'));
    rebind(errorBar, draw, 'context', 'lineWidth', 'pixelRatio');

    return errorBar;
};
