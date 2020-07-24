import xyBase from '../xyBase';
import {
    webglSeriesLine,
    webglAdjacentAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const crossValueAttribute = webglAdjacentAttribute(-1, 2);
    const crossPreviousValueAttribute = crossValueAttribute.offset(-1);
    const crossNextValueAttribute = crossValueAttribute.offset(1);
    const crossNextNextValueAttribute = crossValueAttribute.offset(2);
    const mainValueAttribute = webglAdjacentAttribute(-1, 2);
    const mainPreviousValueAttribute = mainValueAttribute.offset(-1);
    const mainNextValueAttribute = mainValueAttribute.offset(1);
    const mainNextNextValueAttribute = mainValueAttribute.offset(2);
    const definedAttribute = webglAdjacentAttribute(0, 1).type(webglTypes.UNSIGNED_BYTE);
    const definedNextAttribute = definedAttribute.offset(1);

    const draw = webglSeriesLine()
        .crossPreviousValueAttribute(crossPreviousValueAttribute)
        .crossValueAttribute(crossValueAttribute)
        .crossNextValueAttribute(crossNextValueAttribute)
        .crossNextNextValueAttribute(crossNextNextValueAttribute)
        .mainPreviousValueAttribute(mainPreviousValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .mainNextValueAttribute(mainNextValueAttribute)
        .mainNextNextValueAttribute(mainNextNextValueAttribute)
        .definedAttribute(definedAttribute)
        .definedNextAttribute(definedNextAttribute);

    let equals = (previousData, data) => false;
    let scaleMapper = webglScaleMapper;
    let previousData = [];
    let previousXScale = null;
    let previousYScale = null;

    const line = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());
        const dataChanged = !equals(previousData, data);

        if (dataChanged) {
            previousData = data;
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }
        if (dataChanged || xScale.scale !== previousXScale) {
            previousXScale = xScale.scale;
            if (base.orient() === 'vertical') {
                crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
            } else {
                crossValueAttribute.value((d, i) => xScale.scale(base.mainValue()(d, i))).data(data);
            }
        }
        if (dataChanged || yScale.scale !== previousYScale) {
            previousYScale = yScale.scale;
            if (base.orient() === 'vertical') {
                mainValueAttribute.value((d, i) => yScale.scale(base.mainValue()(d, i))).data(data);
            } else {
                mainValueAttribute.value((d, i) => yScale.scale(base.crossValue()(d, i))).data(data);
            }
        }

        draw.xScale(xScale.webglScale)
            .yScale(yScale.webglScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    line.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return line;
    };

    line.scaleMapper = (...args) => {
        if (!args.length) {
            return scaleMapper;
        }
        scaleMapper = args[0];
        return line;
    };

    rebindAll(line, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(line, draw, 'context', 'lineWidth', 'pixelRatio');

    return line;
};
