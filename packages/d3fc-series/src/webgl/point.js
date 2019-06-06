import { symbolCircle } from 'd3-shape';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

import helper from './helper/api';
import glColor from './helper/glColor';

import { circles, shapes, pointData } from './points/index';

export default () => {
    let context = null;
    const base = xyBase();
    let glAPI = null;

    let size = 70;
    let type = symbolCircle;

    const point = (data, helperAPI) => {
        base();
        glAPI = helperAPI || helper(context);

        const scales = glAPI.applyScales(base.xScale(), base.yScale());

        context.strokeStyle = colors.black;
        context.fillStyle = colors.gray;
        context.lineWidth = 1;
        base.decorate()(context, data, 0);

        const projectedData = (data.constructor === Float32Array)
                ? data : getProjectedData(data, scales);

        const lineWidth = context.strokeStyle !== 'transparent' ? parseInt(context.lineWidth) : 0;

        renderer()
            .pixelX(scales.pixel.x)
            .pixelY(scales.pixel.y)
            .lineWidth(lineWidth)
            .callback(drawPoints)(projectedData);
    };

    const renderer = () => {
        return (type === symbolCircle) ? circles() : shapes().type(type);
    };

    const drawPoints = (points, edges) => {
        const fillColor = glColor(context.fillStyle);
        const strokeColor = context.strokeStyle !== 'transparent' ? glColor(context.strokeStyle) : null;

        if (strokeColor || edges) {
            glAPI.edges(points, edges, fillColor, strokeColor);
        } else {
            glAPI.triangles(points, fillColor);
        }
    };

    const getProjectedData = (data, scales) => {
        const filteredData = data.filter(base.defined());

        const crossFn = base.crossValue();
        const mainFn = base.mainValue();
        const sizeFn = typeof size === 'function' ? size : () => size;

        const lineWidth = context.strokeStyle !== 'transparent' ? parseInt(context.lineWidth) : 0;
        const vertical = base.orient() === 'vertical';

        return pointData()
            .pointFn((d, i) => {
                if (vertical) {
                    return {
                        x: scales.xScale(crossFn(d, i), i),
                        y: scales.yScale(mainFn(d, i), i),
                        size: sizeFn(d) + lineWidth
                    };
                } else {
                    return {
                        x: scales.yScale(mainFn(d, i), i),
                        y: scales.xScale(crossFn(d, i), i),
                        size: sizeFn(d) + lineWidth
                    };
                }
            })(filteredData);
    };

    point.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return point;
    };

    point.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = args[0];
        return point;
    };

    point.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    return point;
};
