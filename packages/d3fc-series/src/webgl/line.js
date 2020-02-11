import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import {
    webglSeriesLine,
    webglAdjacentElementAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const crossPreviousValueAttribute = webglAdjacentElementAttribute(-1, 2);
    const crossValueAttribute = crossPreviousValueAttribute.offset(1);
    const crossNextValueAttribute = crossPreviousValueAttribute.offset(2);
    const crossPreviousPreviousValueAttribute = crossPreviousValueAttribute.offset(-1);
    const mainPreviousValueAttribute = webglAdjacentElementAttribute(-1, 2);
    const mainValueAttribute = mainPreviousValueAttribute.offset(1);
    const mainNextValueAttribute = mainPreviousValueAttribute.offset(2);
    const mainPreviousPreviousValueAttribute = mainPreviousValueAttribute.offset(-1);
    const definedAttribute = webglAdjacentElementAttribute(0, 1).type(webglTypes.UNSIGNED_BYTE);
    const definedNextAttribute = definedAttribute.offset(1);

    const draw = webglSeriesLine()
        .crossPreviousValueAttribute(crossPreviousValueAttribute)
        .crossValueAttribute(crossValueAttribute)
        .crossNextValueAttribute(crossNextValueAttribute)
        .crossPreviousPreviousValueAttribute(crossPreviousPreviousValueAttribute)
        .mainPreviousValueAttribute(mainPreviousValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .mainNextValueAttribute(mainNextValueAttribute)
        .mainPreviousPreviousValueAttribute(mainPreviousPreviousValueAttribute)
        .definedAttribute(definedAttribute)
        .definedNextAttribute(definedNextAttribute);

    let equals = (previousData, data) => false;
    let previousData = [];

    const line = (data) => {
        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            if (base.orient() === 'vertical') {
                crossPreviousValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
                mainPreviousValueAttribute.value((d, i) => yScale.scale(base.mainValue()(d, i))).data(data);
            } else {
                crossPreviousValueAttribute.value((d, i) => xScale.scale(base.mainValue()(d, i))).data(data);
                mainPreviousValueAttribute.value((d, i) => yScale.scale(base.crossValue()(d, i))).data(data);
            }
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
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

    rebindAll(line, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(line, draw, 'context', 'lineWidth');

    return line;
};
