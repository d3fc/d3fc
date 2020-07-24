import drawModes from '../program/drawModes';
import programBuilder from '../program/programBuilder';
import barShader from '../shaders/bar/shader';
import { rebind } from '@d3fc/d3fc-rebind';
import baseScale from '../scale/base';
import attribute from '../buffer/attribute';
import elementIndices from '../buffer/elementIndices';
import types from '../buffer/types';
import rebindCurry from '../rebindCurry';

//     βL            β            βR
//     .-------------.------------.
// (x-w/2, y1)    (x, y1)   (x+w/2, y1)
//     |     \                    |
//     |        \                 |
//     |           \              |
//     |              \           |
//     |                 \        |
//     |                    \     |
//     |                       \  |
//     αL            α            αR
//     .-------------.------------.
// (x-w/2, y0)     (x, y0)   (x+w/2, y0)

// Drawing order
// Triangle βL, αL, αR. (bottom)
// β -> βL.
// α -> αL.
// α -> αR.

// Triangle βL, αR, βR. (top)
// β -> βL.
// α -> αR.
// β -> βR.

export default () => {
    const program = programBuilder()
        .mode(drawModes.TRIANGLES)
        .subInstanceCount(6);
    let xScale = baseScale();
    let yScale = baseScale();
    let decorate = () => {};

    const cornerAttribute = attribute()
        .divisor(0)
        .size(2)
        .type(types.BYTE)
        .data([
            [-1, -1],
            [1, 1],
            [-1, 1],
            [1, -1]
        ]);

    program
        .buffers()
        .elementIndices(elementIndices([0, 1, 2, 0, 1, 3]))
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const shaderBuilder = barShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment());

        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);

        program.vertexShader().appendBody(`
            gl_Position.x += xModifier / uScreen.x * 2.0;
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
    rebindCurry(
        draw,
        'crossValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossValue'
    );
    rebindCurry(
        draw,
        'mainValueAttribute',
        program.buffers(),
        'attribute',
        'aMainValue'
    );
    rebindCurry(
        draw,
        'baseValueAttribute',
        program.buffers(),
        'attribute',
        'aBaseValue'
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
