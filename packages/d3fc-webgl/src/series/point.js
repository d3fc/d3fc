import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import circlePointShader from '../shaders/point/circle/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import rebindCurry from '../rebindCurry';
import vertexAttribute from '../buffer/vertexAttribute';
import elementIndices from '../buffer/elementIndices';

export default () => {
    const program = programBuilder().mode(drawModes.POINTS);

    // hack to allow a consistent instanced render path
    const ignoredAttribute = vertexAttribute().data([0]);

    program
        .buffers()
        .attribute('aIgnored', ignoredAttribute)
        .elementIndices(elementIndices([0]));

    let xScale = baseScale();
    let yScale = baseScale();
    let type = circlePointShader();
    let decorate = () => {};

    const draw = numElements => {
        program
            .vertexShader(
                type
                    .vertex()
                    .appendHeader('attribute float aIgnored;')
                    .appendBody('gl_Position += aIgnored;')
            )
            .fragmentShader(type.fragment());

        xScale(program, 'gl_Position', 0);
        yScale(program, 'gl_Position', 1);

        decorate(program);

        program(numElements);
    };

    draw.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
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
    rebindCurry(draw, 'sizeAttribute', program.buffers(), 'attribute', 'aSize');
    rebindCurry(
        draw,
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );

    return draw;
};
