import drawModes from '../program/drawModes';
import programBuilder from '../program/programBuilder';
import barShader from '../shaders/bar/shader';
import { rebind } from '@d3fc/d3fc-rebind';
import glScaleBase from '../scale/glScaleBase';
import elementAttribute from '../buffers/elementAttribute';
import vertexAttribute from '../buffers/vertexAttribute';
import elementIndices from '../buffers/elementIndices';
import types from '../buffers/types';

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
    const program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xValueAttribute = elementAttribute();

    const yValueAttribute = elementAttribute();

    const y0ValueAttribute = elementAttribute();

    const widthValueAttribute = elementAttribute().type(types.UNSIGNED_SHORT);

    const cornerAttribute = vertexAttribute()
        .size(2)
        .type(types.BYTE)
        .data([
            [-1, -1],
            [1, 1],
            [-1, 1],
            [1, -1]
        ]);

    const definedAttribute = elementAttribute().type(types.UNSIGNED_BYTE);

    program
        .buffers()
        .elementIndices(elementIndices([0, 1, 2, 0, 1, 3]))
        .attribute('aCorner', cornerAttribute)
        .attribute('aCrossValue', xValueAttribute)
        .attribute('aMainValue', yValueAttribute)
        .attribute('aBaseValue', y0ValueAttribute)
        .attribute('aBandwidth', widthValueAttribute)
        .attribute('aDefined', definedAttribute);

    const draw = numElements => {
        const shader = barShader();
        program
            .vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        program.vertexShader().appendBody(`
            gl_Position.x += xModifier / uScreen.x * 2.0;
        `);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.y0Values = data => {
        y0ValueAttribute.data(data);
        return draw;
    };

    draw.yValues = data => {
        yValueAttribute.data(data);
        return draw;
    };

    draw.widths = data => {
        widthValueAttribute.data(data);
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

    return draw;
};
