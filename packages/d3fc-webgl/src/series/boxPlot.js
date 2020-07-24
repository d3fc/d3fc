import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import boxPlotShader from '../shaders/boxPlot/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import attribute from '../buffer/attribute';
import elementIndices from '../buffer/elementIndices';
import types from '../buffer/types';
import rebindCurry from '../rebindCurry';

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
    const program = programBuilder()
        .mode(drawModes.TRIANGLES)
        .subInstanceCount(54);
    let xScale = baseScale();
    let yScale = baseScale();
    let decorate = () => {};
    const lineWidth = lineWidthShader();

    /*
     * x-y coordinate to locate the "corners" of the element (ie errorbar). The `z` coordinate locates the corner relative to the line (this takes line width into account).
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -2: HIGH, -1: UPPER QUARTILE, 0: MEDIAN, 1: LOWER QUARTILE, 2: LOW
     * Z: Follows X or Y convention, depending on the orientation of the line that the vertex is part of.
     * W: Indicator to determine line orientation (needed because some corners are part of two lines). - 0: VERTICAL, 1: HORIZONTAL
     */
    const cornerAttribute = attribute()
        .divisor(0)
        .size(4)
        .type(types.BYTE)
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

    program
        .buffers()
        .elementIndices(
            elementIndices([
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
            ])
        )
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const shaderBuilder = boxPlotShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);

        lineWidth(program);

        program.vertexShader().appendBody(`
            gl_Position.x += xModifier / uScreen.x * 2.0;
            gl_Position.y += yModifier / uScreen.y * 2.0;
        `);

        decorate(program);

        program(numElements);
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

    rebind(draw, program, 'context', 'pixelRatio');
    rebind(draw, lineWidth, 'lineWidth');
    rebindCurry(
        draw,
        'crossValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossValue'
    );
    rebindCurry(
        draw,
        'highValueAttribute',
        program.buffers(),
        'attribute',
        'aHighValue'
    );
    rebindCurry(
        draw,
        'upperQuartileValueAttribute',
        program.buffers(),
        'attribute',
        'aUpperQuartileValue'
    );
    rebindCurry(
        draw,
        'medianValueAttribute',
        program.buffers(),
        'attribute',
        'aMedianValue'
    );
    rebindCurry(
        draw,
        'lowerQuartileValueAttribute',
        program.buffers(),
        'attribute',
        'aLowerQuartileValue'
    );
    rebindCurry(
        draw,
        'lowValueAttribute',
        program.buffers(),
        'attribute',
        'aLowValue'
    );
    rebindCurry(
        draw,
        'bandwidthAttribute',
        program.buffers(),
        'attribute',
        'aBandwidth'
    );
    rebindCurry(
        draw,
        'capAttribute',
        program.buffers(),
        'attribute',
        'aCapWidth'
    );
    rebindCurry(
        draw,
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );

    return draw;
};
