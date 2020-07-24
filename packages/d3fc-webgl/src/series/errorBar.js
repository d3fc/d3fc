import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import errorBarShader from '../shaders/errorBar/shader';
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
    let decorate = () => {};
    const lineWidth = lineWidthShader();

    /*
     * x-y coordinate to locate the "corners" of the element (ie errorbar). The `z` coordinate locates the corner relative to the line (this takes line width into account).
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -1: HIGH, 1: LOW
     * Z: Follows X or Y convention, depending on the orientation of the line that the vertex is part of.
     */
    const cornerAttribute = attribute()
        .divisor(0)
        .size(3)
        .type(types.BYTE)
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
            ])
        )
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const shaderBuilder = errorBarShader();
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
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );

    return draw;
};
