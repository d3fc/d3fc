import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import candlestickShader from '../shaders/candlestick/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const program = programBuilder().verticesPerElement(12);
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    const lineWidth = lineWidthShader();
    let decorate = () => {};

    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const highAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const openAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const closeAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const lowAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const bandwidthAttribute = projectedAttributeBuilder().value(
        (data, element, vertex) => data[element]
    );

    /*
     * x-y coordinate to locate the "corners" of the element.
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -2: HIGH, -1: OPEN, 1: CLOSE, 2: LOW
     * Z: -1: LEFT, 1: RIGHT (only valid for HIGH/LOW corners)
     */
    const cornerAttribute = projectedAttributeBuilder()
        .size(3)
        .data([
            [0, 2, 1],
            [0, 2, -1],
            [0, -2, -1],
            [0, 2, 1],
            [0, -2, 1],
            [0, -2, -1],
            [1, -1, 0],
            [-1, -1, 0],
            [-1, 1, 0],
            [1, -1, 0],
            [1, 1, 0],
            [-1, 1, 0]
        ])
        .value((data, element, vertex, component) => data[vertex][component]);

    const draw = numElements => {
        const shaderBuilder = candlestickShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()
            .attribute('aXValue', xValueAttribute)
            .attribute('aHigh', highAttribute)
            .attribute('aOpen', openAttribute)
            .attribute('aClose', closeAttribute)
            .attribute('aLow', lowAttribute)
            .attribute('aBandwidth', bandwidthAttribute)
            .attribute('aCorner', cornerAttribute);

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
