import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import lineShader from '../shaders/line/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import lineWidthShader from '../shaders/lineWidth';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import elementConstantAttributeBuilder from '../buffers/elementConstantAttributeBuilder';
import vertexConstantAttributeBuilder from '../buffers/vertexConstantAttributeBuilder';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';
import types from '../buffers/types';

export default () => {
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const lineWidth = lineWidthShader();

    const xValueAttribute = elementConstantAttributeBuilder().value(
        (data, element) => data[Math.min(element + 1, data.length - 1)]
    );

    const xNextValueAttribute = elementConstantAttributeBuilder().value(
        (data, element) => data[Math.min(element + 2, data.length - 1)]
    );

    const xPreviousValueAttribute = elementConstantAttributeBuilder();

    const xPreviousPreviousValueAttribute = elementConstantAttributeBuilder().value(
        (data, element) => data[Math.max(element - 1, 0)]
    );

    const yValueAttribute = elementConstantAttributeBuilder().value(
        (data, element) => data[Math.min(element + 1, data.length - 1)]
    );

    const yNextValueAttribute = elementConstantAttributeBuilder().value(
        (data, element) => data[Math.min(element + 2, data.length - 1)]
    );

    const yPreviousValueAttribute = elementConstantAttributeBuilder();

    const yPreviousPreviousValueAttribute = elementConstantAttributeBuilder().value(
        (data, element) => data[Math.max(element - 1, 0)]
    );

    const cornerAttribute = vertexConstantAttributeBuilder()
        .size(3)
        .type(types.BYTE)
        .data([
            [-1, 0, 0],
            [1, 1, 0],
            [1, -1, 1],
            [-1, 0, 1],
            [1, 1, 1]
        ]);

    const definedAttribute = elementConstantAttributeBuilder()
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
        xValueAttribute.data(data);
        xNextValueAttribute.data(data);
        xPreviousValueAttribute.data(data);
        xPreviousPreviousValueAttribute.data(data);
        return draw;
    };

    draw.yValues = data => {
        yValueAttribute.data(data);
        yNextValueAttribute.data(data);
        yPreviousValueAttribute.data(data);
        yPreviousPreviousValueAttribute.data(data);
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
