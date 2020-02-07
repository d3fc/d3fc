import elementConstantAttributeBuilder from '../buffers/elementConstantAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import drawModes from '../program/drawModes';
import areaShader from '../shaders/area/shader';
import { rebind } from '@d3fc/d3fc-rebind';
import vertexConstantAttributeBuilder from '../buffers/vertexConstantAttributeBuilder';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';
import types from '../buffers/types';
import slidingWindowElementConstantAttributeBuilder from '../buffers/slidingWindowElementConstantAttributeBuilder';

export default () => {
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xPreviousValueAttribute = slidingWindowElementConstantAttributeBuilder(
        0,
        1
    );

    const xValueAttribute = xPreviousValueAttribute.offset(1);

    const yPreviousValueAttribute = slidingWindowElementConstantAttributeBuilder(
        0,
        1
    );

    const yValueAttribute = yPreviousValueAttribute.offset(1);

    const y0PreviousValueAttribute = slidingWindowElementConstantAttributeBuilder(
        0,
        1
    );

    const y0ValueAttribute = y0PreviousValueAttribute.offset(1);

    const cornerAttribute = vertexConstantAttributeBuilder()
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

    const definedAttribute = elementConstantAttributeBuilder()
        .type(types.UNSIGNED_BYTE)
        .value((data, element) => {
            const value = data[element];
            const nextValue =
                element === data.length - 1 ? 0 : data[element + 1];
            return value ? nextValue : value;
        });

    const elementIndices = elementIndicesBuilder().data([0, 1, 2, 3, 4, 5]);

    const program = programBuilder().mode(drawModes.TRIANGLES);

    program
        .buffers()
        .elementIndices(elementIndices)
        .attribute('aCrossValue', xValueAttribute)
        .attribute('aCrossPrevValue', xPreviousValueAttribute)
        .attribute('aMainValue', yValueAttribute)
        .attribute('aMainPrevValue', yPreviousValueAttribute)
        .attribute('aBaseValue', y0ValueAttribute)
        .attribute('aBasePrevValue', y0PreviousValueAttribute)
        .attribute('aCorner', cornerAttribute)
        .attribute('aDefined', definedAttribute);

    const draw = numElements => {
        const shaderBuilder = areaShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

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

    draw.y0Values = data => {
        y0PreviousValueAttribute.data(data);
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

    return draw;
};
