import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import ohlcShader from '../shaders/ohlc/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import attribute from '../buffer/attribute';
import elementIndices from '../buffer/elementIndices';
import types from '../buffer/types';
import rebindCurry from '../rebindCurry';

export default () => {
    const program = programBuilder()
        .mode(drawModes.TRIANGLES)
        .subInstanceCount(18);
    let xScale = baseScale();
    let yScale = baseScale();
    const lineWidth = lineWidthShader();
    let decorate = () => {};

    /*
     * x-y coordinate to locate the "corners" of the element.
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -2: HIGH, -1: OPEN, 1: CLOSE, 2: LOW
     * Z - Follows convention for X/Y (appropriate direction will be selected by the shader): -1: LEFT/TOP, 1: RIGHT/BOTTOM
     */
    const cornerAttribute = attribute()
        .divisor(0)
        .size(3)
        .type(types.BYTE)
        .data([
            // Main stem
            [0, -2, -1],
            [0, -2, 1],
            [0, 2, 1],
            [0, 2, -1],
            // Open bar
            [-1, -1, -1],
            [-1, -1, 1],
            [0, -1, 1],
            [0, -1, -1],
            // Close bar
            [1, 1, 1],
            [0, 1, 1],
            [0, 1, -1],
            [1, 1, -1]
        ]);

    program
        .buffers()
        .elementIndices(
            elementIndices([
                // Main stem
                0,
                1,
                2,
                0,
                3,
                2,
                // Open bar
                4,
                5,
                6,
                4,
                7,
                6,
                // Close bar
                8,
                9,
                10,
                10,
                11,
                8
            ])
        )
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const shaderBuilder = ohlcShader();
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
        'openValueAttribute',
        program.buffers(),
        'attribute',
        'aOpenValue'
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
        'lowValueAttribute',
        program.buffers(),
        'attribute',
        'aLowValue'
    );
    rebindCurry(
        draw,
        'closeValueAttribute',
        program.buffers(),
        'attribute',
        'aCloseValue'
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
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );

    return draw;
};
