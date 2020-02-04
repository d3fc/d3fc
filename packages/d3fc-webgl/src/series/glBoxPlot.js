import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import boxPlotShader from '../shaders/boxPlot/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import elementConstantAttributeBuilder from '../buffers/elementConstantAttributeBuilder';
import vertexConstantAttributeBuilder from '../buffers/vertexConstantAttributeBuilder';
import elementIndicesBuilder from '../buffers/elementIndicesBuilder';

//           αL1     α     αR1
//            .------.------.
//                   |
//                   |
//                   |
//    βL2            β           βR2
//     .-------------.------------.
//     |                          |
//     |                          |
//     |                          |
//     γL2            γ           γR2
//     .-------------.------------.
//     |                          |
//     |                          |
//     |                          |
//    δL2            δ           δR2
//     .-------------.------------.
//                   |
//                   |
//                   |
//           εL1     ε     εR1
//            .------.------.

// Line drawing order
// αL1 -> αR1
// α -> β
// βL2 -> βR2
// γL2 -> γR2
// δL2 -> δR2
// βL2 -> δL2
// βR2 -> δR2
// δ -> ε
// εL1 -> εR1

export default () => {
    const verticesPerElement = 36;
    const program = programBuilder().verticesPerElement(verticesPerElement);
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};
    const lineWidth = lineWidthShader();

    const xValueAttribute = elementConstantAttributeBuilder();

    const highAttribute = elementConstantAttributeBuilder();

    const upperQuartileAttribute = elementConstantAttributeBuilder();

    const medianAttribute = elementConstantAttributeBuilder();

    const lowerQuartileAttribute = elementConstantAttributeBuilder();

    const lowAttribute = elementConstantAttributeBuilder();

    const bandwidthAttribute = elementConstantAttributeBuilder();

    const capWidthAttribute = elementConstantAttributeBuilder();

    /*
     * x-y coordinate to locate the "corners" of the element (ie errorbar). The `z` coordinate locates the corner relative to the line (this takes line width into account).
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -2: HIGH, -1: UPPER QUARTILE, 0: MEDIAN, 1: LOWER QUARTILE, 2: LOW
     * Z: Follows X or Y convention, depending on the orientation of the line that the vertex is part of.
     * W: Indicator to determine line orientation (needed because some corners are part of two lines). - 0: VERTICAL, 1: HORIZONTAL
     */
    const cornerAttribute = vertexConstantAttributeBuilder()
        .size(4)
        .data([
            // Top cap line
            [-1, -2, -1, 1],
            [1, -2, -1, 1],
            [1, -2, 1, 1],
            [-1, -2, 1, 1],
            // Top whisker line
            [0, -2, -1, 0],
            [0, -2, 1, 0],
            [0, -1, 1, 0],
            [0, -1, -1, 0],
            // Upper quartile line
            [-1, -1, -1, 1],
            [1, -1, -1, 1],
            [1, -1, 1, 1],
            [-1, -1, 1, 1],
            // Median line
            [-1, 0, -1, 1],
            [1, 0, -1, 1],
            [1, 0, 1, 1],
            [-1, 0, 1, 1],
            // Lower quartile line
            [-1, 1, -1, 1],
            [1, 1, -1, 1],
            [1, 1, 1, 1],
            [-1, 1, 1, 1],
            // Left box vertical line
            [-1, -1, -1, 0],
            [-1, -1, 1, 0],
            [-1, 1, 1, 0],
            [-1, 1, -1, 0],
            // Right box vertical line
            [1, -1, -1, 0],
            [1, -1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, -1, 0],
            // Bottom whisker line
            [0, 2, -1, 0],
            [0, 2, 1, 0],
            [0, 1, 1, 0],
            [0, 1, -1, 0],
            // Bottom cap line
            [-1, 2, -1, 1],
            [1, 2, -1, 1],
            [1, 2, 1, 1],
            [-1, 2, 1, 1]
        ]);

    const definedAttribute = elementConstantAttributeBuilder();

    const elementIndices = elementIndicesBuilder().data([
        // Top cap line
        0,
        1,
        2,
        0,
        2,
        3,
        // Top whisker line
        4,
        5,
        6,
        4,
        6,
        7,
        // Upper quartile line
        8,
        9,
        10,
        8,
        10,
        11,
        // Median line
        12,
        13,
        14,
        12,
        14,
        15,
        // Lower quartile line
        16,
        17,
        18,
        16,
        18,
        19,
        // Left box vertical line
        20,
        21,
        22,
        20,
        22,
        23,
        // Right box vertical line
        24,
        25,
        26,
        24,
        26,
        27,
        // Bottom whisker line
        28,
        29,
        30,
        28,
        30,
        31,
        // Bottom cap line
        32,
        33,
        34,
        32,
        34,
        35
    ]);

    const draw = numElements => {
        const shader = boxPlotShader();
        program
            .vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()
            .elementIndices(elementIndices)
            .attribute('aCrossValue', xValueAttribute)
            .attribute('aHighValue', highAttribute)
            .attribute('aUpperQuartileValue', upperQuartileAttribute)
            .attribute('aMedianValue', medianAttribute)
            .attribute('aLowerQuartileValue', lowerQuartileAttribute)
            .attribute('aLowValue', lowAttribute)
            .attribute('aBandwidth', bandwidthAttribute)
            .attribute('aCap', capWidthAttribute)
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
        highAttribute.data(data);
        return draw;
    };

    draw.upperQuartileValues = data => {
        upperQuartileAttribute.data(data);
        return draw;
    };

    draw.medianValues = data => {
        medianAttribute.data(data);
        return draw;
    };

    draw.lowerQuartileValues = data => {
        lowerQuartileAttribute.data(data);
        return draw;
    };

    draw.lowValues = data => {
        lowAttribute.data(data);
        return draw;
    };

    draw.bandwidth = data => {
        bandwidthAttribute.data(data);
        return draw;
    };

    draw.capWidth = data => {
        capWidthAttribute.data(data);
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
