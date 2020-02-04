import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import errorBarShader from '../shaders/errorBar/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import elementConstantAttributeBuilder from '../buffers/elementConstantAttributeBuilder';
import vertexConstantAttributeBuilder from '../buffers/vertexConstantAttributeBuilder';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';

export default () => {
    const program = programBuilder().verticesPerElement(12);
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};
    const lineWidth = lineWidthShader();

    const xValueAttribute = elementConstantAttributeBuilder();

    const highValueAttribute = elementConstantAttributeBuilder();

    const lowValueAttribute = elementConstantAttributeBuilder();

    const bandwidthAttribute = elementConstantAttributeBuilder();

    /*
     * x-y coordinate to locate the "corners" of the element (ie errorbar). The `z` coordinate locates the corner relative to the line (this takes line width into account).
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -1: HIGH, 1: LOW
     * Z: Follows X or Y convention, depending on the orientation of the line that the vertex is part of.
     */
    const cornerAttribute = vertexConstantAttributeBuilder()
        .size(3)
        .data([
            // Main stem
            [0, 1, 1],
            [0, 1, -1],
            [0, -1, -1],
            [0, -1, 1],
            // Top cap
            [1, -1, 1],
            [1, -1, -1],
            [-1, -1, -1],
            [-1, -1, 1],
            // Bottom cap
            [-1, 1, -1],
            [-1, 1, 1],
            [1, 1, 1],
            [1, 1, -1]
        ]);

    const definedAttribute = elementConstantAttributeBuilder();

    const elementIndices = elementIndicesBuilder().data([
        // Main stem
        0,
        1,
        2,
        0,
        3,
        2,
        // Top cap
        4,
        5,
        6,
        4,
        7,
        6,
        // Bottom cap
        8,
        9,
        10,
        8,
        11,
        10
    ]);

    const draw = numElements => {
        const shader = errorBarShader();
        program
            .vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()
            .elementIndices(elementIndices)
            .attribute('aCrossValue', xValueAttribute)
            .attribute('aHighValue', highValueAttribute)
            .attribute('aLowValue', lowValueAttribute)
            .attribute('aBandwidth', bandwidthAttribute)
            .attribute('aCorner', cornerAttribute)
            .attribute('aDefined', definedAttribute);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        lineWidth(program);

        program.vertexShader().appendBody(`
                gl_Position.x += xModifier / uScreen.x * 2.0;
                gl_Position.y += yModifier / uScreen.y * 2.0;
            `);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.highValues = data => {
        highValueAttribute.data(data);
        return draw;
    };

    draw.lowValues = data => {
        lowValueAttribute.data(data);
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

    draw.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return draw;
    };

    rebind(draw, program, 'context');
    rebind(draw, lineWidth, 'lineWidth');

    return draw;
};
