import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import candlestickShader from '../shaders/candlestick/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import elementConstantAttributeBuilder from '../buffers/elementConstantAttributeBuilder';
import vertexConstantAttributeBuilder from '../buffers/vertexConstantAttributeBuilder';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';
import types from '../buffers/types';

export default () => {
    const program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    const lineWidth = lineWidthShader();
    let decorate = () => {};

    const xValueAttribute = elementConstantAttributeBuilder();

    const highAttribute = elementConstantAttributeBuilder();

    const openAttribute = elementConstantAttributeBuilder();

    const closeAttribute = elementConstantAttributeBuilder();

    const lowAttribute = elementConstantAttributeBuilder();

    const bandwidthAttribute = elementConstantAttributeBuilder().type(
        types.UNSIGNED_SHORT
    );

    /*
     * x-y coordinate to locate the "corners" of the element.
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -2: HIGH, -1: OPEN, 1: CLOSE, 2: LOW
     * Z: -1: LEFT, 1: RIGHT (only valid for HIGH/LOW corners)
     */
    const cornerAttribute = vertexConstantAttributeBuilder()
        .size(3)
        .type(types.BYTE)
        .data([
            // Vertical line
            [0, 2, 1],
            [0, 2, -1],
            [0, -2, -1],
            [0, -2, 1],
            // Central box
            [1, -1, 0],
            [-1, -1, 0],
            [-1, 1, 0],
            [1, 1, 0]
        ]);

    const definedAttribute = elementConstantAttributeBuilder().type(
        types.UNSIGNED_BYTE
    );

    const elementIndices = elementIndicesBuilder().data([
        // Vertical line
        0,
        1,
        2,
        0,
        3,
        2,
        // Central box
        4,
        5,
        6,
        4,
        7,
        6
    ]);

    const draw = numElements => {
        const shaderBuilder = candlestickShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()
            .elementIndices(elementIndices)
            .attribute('aCrossValue', xValueAttribute)
            .attribute('aHighValue', highAttribute)
            .attribute('aOpenValue', openAttribute)
            .attribute('aCloseValue', closeAttribute)
            .attribute('aLowValue', lowAttribute)
            .attribute('aBandwidth', bandwidthAttribute)
            .attribute('aCorner', cornerAttribute)
            .attribute('aDefined', definedAttribute);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        lineWidth(program);

        program.vertexShader().appendBody(`
          gl_Position.x += xModifier / uScreen.x;
          gl_Position.y += yModifier / uScreen.y;
        `);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.openValues = data => {
        openAttribute.data(data);
        return draw;
    };

    draw.highValues = data => {
        highAttribute.data(data);
        return draw;
    };

    draw.lowValues = data => {
        lowAttribute.data(data);
        return draw;
    };

    draw.closeValues = data => {
        closeAttribute.data(data);
        return draw;
    };

    draw.bandwidth = data => {
        bandwidthAttribute.data(data);
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
