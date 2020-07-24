import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import lineShader from '../shaders/line/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import lineWidthShader from '../shaders/lineWidth';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import attribute from '../buffer/attribute';
import elementIndices from '../buffer/elementIndices';
import types from '../buffer/types';
import rebindCurry from '../rebindCurry';

export default () => {
    const program = programBuilder()
        .mode(drawModes.TRIANGLES)
        .subInstanceCount(12);
    let xScale = baseScale();
    let yScale = baseScale();
    let decorate = () => {};
    const lineWidth = lineWidthShader();

    const cornerAttribute = attribute()
        .divisor(0)
        .size(3)
        .type(types.BYTE)
        .data([
            [-1, 0, 0],
            [1, 1, 0],
            [1, -1, 1],
            [-1, 0, 1],
            [1, 1, 1]
        ]);

    program
        .buffers()
        .elementIndices(elementIndices([0, 1, 2, 1, 2, 3, 0, 2, 3, 2, 3, 4]))
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const shaderBuilder = lineShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale(program, 'prev', 0);
        yScale(program, 'prev', 1);
        xScale(program, 'curr', 0);
        yScale(program, 'curr', 1);
        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);
        xScale(program, 'nextNext', 0);
        yScale(program, 'nextNext', 1);

        program
            .vertexShader()
            .appendBody(vertexShaderSnippets.postScaleLine.body);

        lineWidth(program);

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

    rebind(draw, program, 'context', 'pixelRatio');
    rebind(draw, lineWidth, 'lineWidth');
    rebindCurry(
        draw,
        'crossPreviousValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossPrevValue'
    );
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
        'crossNextNextValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossNextNextValue'
    );
    rebindCurry(
        draw,
        'mainPreviousValueAttribute',
        program.buffers(),
        'attribute',
        'aMainPrevValue'
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
        'mainNextNextValueAttribute',
        program.buffers(),
        'attribute',
        'aMainNextNextValue'
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
