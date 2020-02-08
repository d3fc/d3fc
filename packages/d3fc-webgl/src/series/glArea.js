import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import drawModes from '../program/drawModes';
import areaShader from '../shaders/area/shader';
import { rebind } from '@d3fc/d3fc-rebind';
import vertexAttribute from '../buffers/vertexAttribute';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';
import types from '../buffers/types';
import adjacentElementAttribute from '../buffers/adjacentElementAttribute';

export default () => {
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xPreviousValueAttribute = adjacentElementAttribute(0, 1);

    const xValueAttribute = xPreviousValueAttribute.offset(1);

    const yPreviousValueAttribute = adjacentElementAttribute(0, 1);

    const yValueAttribute = yPreviousValueAttribute.offset(1);

    const y0PreviousValueAttribute = adjacentElementAttribute(0, 1);

    const y0ValueAttribute = y0PreviousValueAttribute.offset(1);

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

    const definedAttribute = adjacentElementAttribute(0, 1).type(
        types.UNSIGNED_BYTE
    );

    const definedNextAttribute = definedAttribute.offset(1);

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
        .attribute('aDefined', definedAttribute)
        .attribute('aDefinedNext', definedNextAttribute);

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
