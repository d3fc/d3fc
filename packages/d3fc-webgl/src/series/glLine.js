import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import lineShader from '../shaders/line/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import lineWidthShader from '../shaders/lineWidth';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';

export default () => {
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const lineWidth = lineWidthShader();
    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const xNextValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[Math.min(element + 1, data.length - 1)]
    );
    const xPreviousValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[Math.max(element - 1, 0)]
    );
    const yValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const yNextValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[Math.min(element + 1, data.length - 1)]
    );
    const yPreviousValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[Math.max(element - 1, 0)]
    );
    const cornerAttribute = projectedAttributeBuilder()
        .size(2)
        .data([
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1]
        ])
        .value((data, element, vertex, component) => data[vertex][component]);
    const definedAttribute = projectedAttributeBuilder().value(
        (data, element, vertex, component) => {
            const value = data[element];
            if (vertex <= 1) {
                const previousValue = element === 0 ? value : data[element - 1];
                return value ? previousValue : value;
            } else {
                const nextValue =
                    element === data.length - 1 ? value : data[element + 1];
                return value ? nextValue : value;
            }
        }
    );

    const program = programBuilder()
        .mode(drawModes.TRIANGLE_STRIP)
        .verticesPerElement(4);

    program
        .buffers()
        .attribute('aXValue', xValueAttribute)
        .attribute('aNextXValue', xNextValueAttribute)
        .attribute('aPrevXValue', xPreviousValueAttribute)
        .attribute('aYValue', yValueAttribute)
        .attribute('aNextYValue', yNextValueAttribute)
        .attribute('aPrevYValue', yPreviousValueAttribute)
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

        program
            .vertexShader()
            .appendBody(vertexShaderSnippets.postScaleLine.body);

        lineWidth(program);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        xNextValueAttribute.data(data);
        xPreviousValueAttribute.data(data);
        return draw;
    };

    draw.yValues = data => {
        yValueAttribute.data(data);
        yNextValueAttribute.data(data);
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
