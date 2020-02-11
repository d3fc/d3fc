import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import {
    webglSeriesBar,
    webglElementAttribute,
    webglScaleMapper,
    webglTypes
} from '@d3fc/d3fc-webgl';
import { exclude, rebind, rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const crossValueAttribute = webglElementAttribute();
    const mainValueAttribute = webglElementAttribute();
    const baseValueAttribute = webglElementAttribute();
    const bandwidthAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_SHORT);
    const definedAttribute = webglElementAttribute().type(webglTypes.UNSIGNED_BYTE);

    const draw = webglSeriesBar()
        .crossValueAttribute(crossValueAttribute)
        .mainValueAttribute(mainValueAttribute)
        .baseValueAttribute(baseValueAttribute)
        .bandwidthAttribute(bandwidthAttribute)
        .definedAttribute(definedAttribute);

    let equals = (previousData, data) => false;
    let previousData = [];

    const bar = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }

        const xScale = webglScaleMapper(base.xScale());
        const yScale = webglScaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            crossValueAttribute.value((d, i) => xScale.scale(base.crossValue()(d, i))).data(data);
            mainValueAttribute.value((d, i) => yScale.scale(base.mainValue()(d, i))).data(data);
            baseValueAttribute.value((d, i) => yScale.scale(base.baseValue()(d, i))).data(data);
            bandwidthAttribute.value((d, i) => base.bandwidth()(d, i)).data(data);
            definedAttribute.value((d, i) => base.defined()(d, i)).data(data);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
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

    rebindAll(bar, base, exclude('align'));
    rebind(bar, draw, 'context');

    return bar;
};
