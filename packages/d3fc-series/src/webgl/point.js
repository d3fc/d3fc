import { symbolCircle } from 'd3-shape';
import xyBase from '../xyBase';
import {
    webglSeriesPoint,
    webglAttribute,
    webglScaleMapper,
    webglSymbolMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';
import functor from '../functor';

export default () => {
    const base = xyBase();
    let size = functor(64);
    let type = symbolCircle;

    const crossValueAttribute = webglAttribute();
    const mainValueAttribute = webglAttribute();
    const sizeAttribute = webglAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesPoint()
        .crossValueAttribute(crossValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .sizeAttribute(sizeAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let scaleMapper = webglScaleMapper;
    let previousData = [];
    let previousXScale = null;
    let previousYScale = null;

    const point = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());
        const dataChanged = !equals(previousData, data);

        if (dataChanged) {
            previousData = data;
            sizeAttribute.value((d, i) => size(d, i)).data(data);
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

    point.scaleMapper = (...args) => {
        if (!args.length) {
            return scaleMapper;
        }
        scaleMapper = args[0];
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(point, draw, 'context', 'pixelRatio');

    return point;
};
