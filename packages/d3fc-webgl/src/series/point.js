import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import circlePointShader from '../shaders/point/circle/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import rebindCurry from '../rebindCurry';

export default () => {
    const program = programBuilder().mode(drawModes.POINTS);

    let xScale = baseScale();
    let yScale = baseScale();
    let type = circlePointShader();
    let decorate = () => {};

    const draw = numElements => {
        program.vertexShader(type.vertex()).fragmentShader(type.fragment());

        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);

        decorate(program);

        program(numElements);
    };

    draw.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        return draw;
    };

    draw.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return draw;
    };

    draw.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return draw;
    };

    draw.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return draw;
    };

    rebind(draw, program, 'context', 'pixelRatio');
    rebindCurry(
        draw,
        'crossValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossValue'
    );
    rebindCurry(
        draw,
        'mainValueAttribute',
        program.buffers(),
        'attribute',
        'aMainValue'
    );
    rebindCurry(draw, 'sizeAttribute', program.buffers(), 'attribute', 'aSize');
    rebindCurry(
        draw,
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );

    return draw;
};
