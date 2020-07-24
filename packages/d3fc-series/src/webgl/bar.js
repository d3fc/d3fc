import xyBase from '../xyBase';
import {
    webglSeriesBar,
    webglAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { exclude, rebind, rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const crossValueAttribute = webglAttribute();
    const mainValueAttribute = webglAttribute();
    const baseValueAttribute = webglAttribute();
    const bandwidthAttribute = webglAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesBar()
        .crossValueAttribute(crossValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .baseValueAttribute(baseValueAttribute)
        .bandwidthAttribute(bandwidthAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let scaleMapper = webglScaleMapper;
    let previousData = [];
    let previousXScale = null;
    let previousYScale = null;

    const bar = (data) => {
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
            baseValueAttribute.value((d, i) => yScale.scale(base.baseValue()(d, i))).data(data);
            mainValueAttribute.value((d, i) => yScale.scale(base.mainValue()(d, i))).data(data);
        }

        draw.xScale(xScale.webglScale)
            .yScale(yScale.webglScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    bar.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return bar;
    };

    bar.scaleMapper = (...args) => {
        if (!args.length) {
            return scaleMapper;
        }
        scaleMapper = args[0];
        return bar;
    };

    rebindAll(bar, base, exclude('align'));
    rebind(bar, draw, 'context', 'pixelRatio');

    return bar;
};
