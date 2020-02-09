import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import {
    webglSeriesArea,
    webglAdjacentElementAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const crossPreviousValueAttribute = webglAdjacentElementAttribute(0, 1);
    const crossValueAttribute = crossPreviousValueAttribute.offset(1);
    const mainPreviousValueAttribute = webglAdjacentElementAttribute(0, 1);
    const mainValueAttribute = mainPreviousValueAttribute.offset(1);
    const basePreviousValueAttribute = webglAdjacentElementAttribute(0, 1);
    const baseValueAttribute = basePreviousValueAttribute.offset(1);
    const definedAttribute = webglAdjacentElementAttribute(0, 1)
        .type(webglTypes.UNSIGNED_BYTE);
    const definedNextAttribute = definedAttribute.offset(1);

    const draw = webglSeriesArea()
        .crossValueAttribute(crossValueAttribute)
        .crossPreviousValueAttribute(crossPreviousValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .mainPreviousValueAttribute(mainPreviousValueAttribute)
        .baseValueAttribute(baseValueAttribute)
        .basePreviousValueAttribute(basePreviousValueAttribute)
        .definedAttribute(definedAttribute)
        .definedNextAttribute(definedNextAttribute);

    let equals = (previousData, data) => false;
    let previousData = [];

    const area = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }

        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            crossPreviousValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
            mainPreviousValueAttribute.value((d, i) => yScale.scale(base.mainValue()(d, i))).data(data);
            basePreviousValueAttribute.value((d, i) => yScale.scale(base.baseValue()(d, i))).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        draw
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
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

    rebindAll(area, base, exclude('bandwidth', 'align'));
    rebind(area, draw, 'context');

    return area;
};
