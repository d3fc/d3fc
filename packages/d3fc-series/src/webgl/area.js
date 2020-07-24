import xyBase from '../xyBase';
import {
    webglSeriesArea,
    webglAdjacentAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const crossValueAttribute = webglAdjacentAttribute(0, 1);
    const crossNextValueAttribute = crossValueAttribute.offset(1);
    const mainValueAttribute = webglAdjacentAttribute(0, 1);
    const mainNextValueAttribute = mainValueAttribute.offset(1);
    const baseValueAttribute = webglAdjacentAttribute(0, 1);
    const baseNextValueAttribute = baseValueAttribute.offset(1);
    const definedAttribute = webglAdjacentAttribute(0, 1)
        .type(webglTypes.UNSIGNED_BYTE);
    const definedNextAttribute = definedAttribute.offset(1);

    const draw = webglSeriesArea()
        .crossValueAttribute(crossValueAttribute)
        .crossNextValueAttribute(crossNextValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .mainNextValueAttribute(mainNextValueAttribute)
        .baseValueAttribute(baseValueAttribute)
        .baseNextValueAttribute(baseNextValueAttribute)
        .definedAttribute(definedAttribute)
        .definedNextAttribute(definedNextAttribute);

    let equals = (previousData, data) => false;
    let scaleMapper = webglScaleMapper;
    let previousData = [];
    let previousXScale = null;
    let previousYScale = null;

    const area = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());
        const dataChanged = !equals(previousData, data);

        if (dataChanged) {
            previousData = data;
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

        draw
            .xScale(xScale.webglScale)
            .yScale(yScale.webglScale)
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    area.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return area;
    };

    area.scaleMapper = (...args) => {
        if (!args.length) {
            return scaleMapper;
        }
        scaleMapper = args[0];
        return area;
    };

    rebindAll(area, base, exclude('bandwidth', 'align'));
    rebind(area, draw, 'context', 'pixelRatio');

    return area;
};
