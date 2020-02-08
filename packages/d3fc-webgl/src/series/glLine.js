import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import lineShader from '../shaders/line/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import lineWidthShader from '../shaders/lineWidth';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import elementAttribute from '../buffers/elementAttribute';
import vertexAttribute from '../buffers/vertexAttribute';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';
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

    const definedAttribute = elementAttribute()
        .type(types.UNSIGNED_BYTE)
        .value((data, element) => {
            const value = data[element];
            const nextValue =
                element === data.length - 1 ? 0 : data[element + 1];
            return value ? nextValue : value;
        });

    const elementIndices = elementIndicesBuilder().data([
        0,
        1,
        2,
        1,
        2,
        3,
        0,
        2,
        3,
        2,
        3,
        4
    ]);

    const program = programBuilder().mode(drawModes.TRIANGLES);

    program
        .buffers()
        .elementIndices(elementIndices)
        .attribute('aCrossValue', xValueAttribute)
        .attribute('aCrossNextValue', xNextValueAttribute)
        .attribute('aCrossPrevValue', xPreviousValueAttribute)
        .attribute('aCrossPrevPrevValue', xPreviousPreviousValueAttribute)
        .attribute('aMainValue', yValueAttribute)
        .attribute('aMainNextValue', yNextValueAttribute)
        .attribute('aMainPrevValue', yPreviousValueAttribute)
        .attribute('aMainPrevPrevValue', yPreviousPreviousValueAttribute)
        .attribute('aCorner', cornerAttribute)
        .attribute('aDefined', definedAttribute);

    const draw = numElements => {
        const shaderBuilder = lineShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);
        xScale.scaleComponent(program, 'next');
        yScale.scaleComponent(program, 'next');
        xScale.scaleComponent(program, 'prev');
        yScale.scaleComponent(program, 'prev');
        xScale.scaleComponent(program, 'prevPrev');
        yScale.scaleComponent(program, 'prevPrev');

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
