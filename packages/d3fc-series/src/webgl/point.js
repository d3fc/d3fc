import { symbol, symbolCircle } from 'd3-shape';
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
    let typePoints = null;

    const point = (data, helperAPI) => {
        base();
        glAPI = helperAPI || helper(context);

        context.strokeStyle = colors.black;
        context.fillStyle = colors.gray;
        context.lineWidth = 1;
        base.decorate()(context, data, 0);

        const filteredData = data.filter(base.defined());
        if (typePoints) {
            shapePoints(filteredData);
        } else {
            circlePoints(filteredData);
        }
    };

    const getPixel = () => {
        const xRange = base.xScale().range();
        const yRange = base.yScale().range();
        return {
            x: Math.abs(2 / (xRange[1] - xRange[0])),
            y: Math.abs(2 / (yRange[1] - yRange[0]))
        };
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

    const shapePoints = (filteredData) => {
        const projectedData = getProjectedData(filteredData, false);
        const lineWidth = context.strokeStyle !== 'transparent' ? parseInt(context.lineWidth) : 0;
        const pixel = getPixel();

        shapes()
            .pixelX(pixel.x)
            .pixelY(pixel.y)
            .lineWidth(lineWidth)
            .shape(typePoints)
            .callback(drawPoints)(projectedData.data);
    };

    const circlePoints = (filteredData) => {
        const projectedData = getProjectedData(filteredData, true);
        const lineWidth = context.strokeStyle !== 'transparent' ? parseInt(context.lineWidth) : 0;
        const pixel = getPixel();

        circles()
            .pixelX(pixel.x)
            .pixelY(pixel.y)
            .lineWidth(lineWidth)
            .callback(drawPoints)(projectedData.data, projectedData.segmentCount);
    };

    const getProjectedData = (data, circles = false) => {
        const xScale = base.xScale().copy().range([-1, 1]);
        const yScale = base.yScale().copy().range([-1, 1]);
        const sizeFn = typeof size === 'function' ? size : () => size;
        const lineWidth = context.strokeStyle !== 'transparent' ? parseInt(context.lineWidth) : 0;

        const vertical = base.orient() === 'vertical';

        return pointData()
            .circles(circles)
            .pointFn((d, i) => {
                if (vertical) {
                    return {
                        x: xScale(base.crossValue()(d, i), i),
                        y: yScale(base.mainValue()(d, i), i),
                        size: sizeFn(d) + lineWidth
                    };
                } else {
                    return {
                        x: yScale(base.mainValue()(d, i), i),
                        y: xScale(base.crossValue()(d, i), i),
                        size: sizeFn(d) + lineWidth
                    };
                }
            })(data);
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
        if (type === symbolCircle) {
            typePoints = null;
        } else {
            typePoints = shapeToPoints(type);
        }
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    return point;
};

function shapeToPoints(d3Shape) {
    if (d3Shape) {
        const shapeSymbol = symbol().type(d3Shape);
        const shapePath = shapeSymbol.size(3)();
        const points = shapePath
            .substring(1, shapePath.length - 1)
            .split('L')
            .map(p => p.split(',').map(c => parseFloat(c)));

        if (points.length === 1) {
            // Square
            const l = -points[0][0];
            points.push([l, -l]);
            points.push([l, l]);
            points.push([-l, l]);
        }

        points.push(points[0]);
        return Float32Array.from(points.reduce((acc, val) => acc.concat(val), []));
    }
    return [];
}
