import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import lineShader from '../shaders/line/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import lineWidthShader from '../shaders/lineWidth';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import vertexAttribute from '../buffers/vertexAttribute';
import elementIndices from '../buffers/elementIndices';
import types from '../buffers/types';
import adjacentElementAttribute from '../buffers/adjacentElementAttribute';

export default () => {
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const lineWidth = lineWidthShader();

    const xPreviousValueAttribute = adjacentElementAttribute(-1, 2);

    const xValueAttribute = xPreviousValueAttribute.offset(1);

    const xNextValueAttribute = xPreviousValueAttribute.offset(2);

    const xPreviousPreviousValueAttribute = xPreviousValueAttribute.offset(-1);

    const yPreviousValueAttribute = adjacentElementAttribute(-1, 2);

    const yValueAttribute = yPreviousValueAttribute.offset(1);

    const yNextValueAttribute = yPreviousValueAttribute.offset(2);

    const yPreviousPreviousValueAttribute = yPreviousValueAttribute.offset(-1);

    const cornerAttribute = vertexAttribute()
        .size(3)
        .type(types.BYTE)
        .data([
            [-1, 0, 0],
            [1, 1, 0],
            [1, -1, 1],
            [-1, 0, 1],
            [1, 1, 1]
        ]);

    const definedAttribute = adjacentElementAttribute(0, 1).type(
        types.UNSIGNED_BYTE
    );

    const definedNextAttribute = definedAttribute.offset(1);

    const program = programBuilder().mode(drawModes.TRIANGLES);

    program
        .buffers()
        .elementIndices(elementIndices([0, 1, 2, 1, 2, 3, 0, 2, 3, 2, 3, 4]))
        .attribute('aCrossValue', xValueAttribute)
        .attribute('aCrossNextValue', xNextValueAttribute)
        .attribute('aCrossPrevValue', xPreviousValueAttribute)
        .attribute('aCrossPrevPrevValue', xPreviousPreviousValueAttribute)
        .attribute('aMainValue', yValueAttribute)
        .attribute('aMainNextValue', yNextValueAttribute)
        .attribute('aMainPrevValue', yPreviousValueAttribute)
        .attribute('aMainPrevPrevValue', yPreviousPreviousValueAttribute)
        .attribute('aCorner', cornerAttribute)
        .attribute('aDefined', definedAttribute)
        .attribute('aDefinedNext', definedNextAttribute);

    const draw = numElements => {
        const shaderBuilder = lineShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);
        xScale(program, 'next', 0);
        yScale(program, 'next', 1);
        xScale(program, 'prev', 0);
        yScale(program, 'prev', 1);
        xScale(program, 'prevPrev', 0);
        yScale(program, 'prevPrev', 1);

        program
            .vertexShader()
            .appendBody(vertexShaderSnippets.postScaleLine.body);

        lineWidth(program);

        decorate(program);

        program(numElements - 1);
    };

    draw.xValues = data => {
        xPreviousValueAttribute.data(data);
        return draw;
    };

    draw.yValues = data => {
        yPreviousValueAttribute.data(data);
        return draw;
    };

    draw.defined = data => {
        definedAttribute.data(data);
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

    rebind(draw, program, 'context');
    rebind(draw, lineWidth, 'lineWidth');

    return draw;
};
