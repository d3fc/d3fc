import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import drawModes from '../program/drawModes';
import areaShader from '../shaders/area/shader';
import { rebind } from '@d3fc/d3fc-rebind';
import vertexAttribute from '../buffer/vertexAttribute';
import elementIndices from '../buffer/elementIndices';
import types from '../buffer/types';
import rebindCurry from '../rebindCurry';

export default () => {
    const program = programBuilder().mode(drawModes.TRIANGLES);
    let xScale = baseScale();
    let yScale = baseScale();
    let decorate = () => {};

    const cornerAttribute = vertexAttribute()
        .size(3)
        .type(types.UNSIGNED_BYTE)
        .data([
            [0, 0, 0],
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 1],
            [1, 0, 0],
            [1, 1, 0]
        ]);

    program
        .buffers()
        .elementIndices(elementIndices([0, 1, 2, 3, 4, 5]))
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const shaderBuilder = areaShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);

        decorate(program);

        program(numElements - 1);
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

    rebind(draw, program, 'context');
    rebindCurry(
        draw,
        'crossValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossValue'
    );
    rebindCurry(
        draw,
        'crossNextValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossNextValue'
    );
    rebindCurry(
        draw,
        'mainValueAttribute',
        program.buffers(),
        'attribute',
        'aMainValue'
    );
    rebindCurry(
        draw,
        'mainNextValueAttribute',
        program.buffers(),
        'attribute',
        'aMainNextValue'
    );
    rebindCurry(
        draw,
        'baseValueAttribute',
        program.buffers(),
        'attribute',
        'aBaseValue'
    );
    rebindCurry(
        draw,
        'baseNextValueAttribute',
        program.buffers(),
        'attribute',
        'aBaseNextValue'
    );
    rebindCurry(
        draw,
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );
    rebindCurry(
        draw,
        'definedNextAttribute',
        program.buffers(),
        'attribute',
        'aDefinedNext'
    );

    return draw;
};
