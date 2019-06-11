import { symbol, symbolCircle } from 'd3-shape';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

import helper from './helper/api';
import glColor from './helper/glColor';

export default () => {
    let context = null;
    const base = xyBase();
    let glAPI = null;

    let size = 70;
    let type = symbolCircle;
    let imagePromise = null;

    const point = (data, helperAPI) => {
        base();
        glAPI = helperAPI || helper(context);

        const scales = glAPI.applyScales(base.xScale(), base.yScale());

        context.strokeStyle = type ? colors.black : undefined;
        context.fillStyle = type ? colors.gray : undefined;
        context.lineWidth = 1;
        base.decorate()(context, data, 0);

        const projectedData = (data.constructor === Float32Array)
                ? data : getProjectedData(data, scales);

        const fillColor = glColor(context.fillStyle);
        const lineWidth = context.strokeStyle !== 'transparent' ? parseInt(context.lineWidth) : 0;
        const strokeColor = lineWidth > 0 ? glColor(context.strokeStyle) : null;
        if (type === symbolCircle) {
            glAPI.circles(projectedData, fillColor, lineWidth, strokeColor);
        } else {
            imagePromise.then(image => {
                glAPI.pointTextures(projectedData, image, fillColor, lineWidth, strokeColor);
            });
        }
    };

    const getProjectedData = (data, scales) => {
        const filteredData = data.filter(base.defined());

        const crossFn = base.crossValue();
        const mainFn = base.mainValue();
        const sizeFn = typeof size === 'function' ? size : () => size;
        const vertical = base.orient() === 'vertical';

        const result = new Float32Array(data.length * 3);
        let index = 0;

        if (vertical) {
            filteredData.forEach((d, i) => {
                result[index++] = scales.xScale(crossFn(d, i), i);
                result[index++] = scales.yScale(mainFn(d, i), i);
                result[index++] = sizeFn(d);
            });
        } else {
            filteredData.forEach((d, i) => {
                result[index++] = scales.xScale(mainFn(d, i), i);
                result[index++] = scales.yScale(crossFn(d, i), i);
                result[index++] = sizeFn(d);
            });
        }

        return result;
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

        if (type !== symbolCircle) {
            imagePromise = getSymbolImage(type);
        } else {
            imagePromise = null;
        }
        return point;
    };

    point.image = img => {
        type = null;
        imagePromise = new Promise(resolve => {
            if (img.complete) {
                resolve(img);
            } else {
                img.onload = () => {
                    resolve(img);
                };
            }
        });
        return point;
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    return point;
};

const textureSize = 256;
const getSymbolImage = (type) => {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = textureSize;
        canvas.height = textureSize;

        const context = canvas.getContext('2d');
        context.fillStyle = '#000';
        const halfSize = textureSize / 2;
        context.translate(halfSize, halfSize);
        context.beginPath();
        symbol().type(type).size(halfSize * halfSize).context(context)();
        context.closePath();
        context.fill();

        var image = new window.Image();
        image.src = canvas.toDataURL();
        image.onload = () => {
            resolve(image);
        };
    });
};
