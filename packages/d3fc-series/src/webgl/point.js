import d3Shape from 'd3-shape';
import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import {
    webglSeriesPoint,
    webglElementAttribute,
    webglScaleMapper,
    webglSymbolMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import functor from '../functor';

export default () => {
    const base = xyBase();
    let size = functor(64);
    let type = d3Shape.symbolCircle;

    const crossValueAttribute = webglElementAttribute();
    const mainValueAttribute = webglElementAttribute();
    const sizeAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesPoint()
        .crossValueAttribute(crossValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .sizeAttribute(sizeAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let previousData = [];

    const point = (data) => {
        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            if (base.orient() === 'vertical') {
                crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
                mainValueAttribute.value((d, i) => yScale.scale(base.mainValue()(d, i))).data(data);
            } else {
                crossValueAttribute.value((d, i) => xScale.scale(base.mainValue()(d, i))).data(data);
                mainValueAttribute.value((d, i) => yScale.scale(base.crossValue()(d, i))).data(data);
            }
            sizeAttribute.value((d, i) => size(d, i)).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .type(webglSymbolMapper(type))
            .decorate((program) => base.decorate()(program, data, 0));

        draw(data.length);
    };

    point.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = functor(args[0]);
        return point;
    };

    point.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        return point;
    };

    point.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(point, draw, 'context');

    return point;
};
