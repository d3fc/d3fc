import baseScale from '../scale/base';
import programBuilder from '../program/programBuilder';
import shaderBuilder, {
    vertexShaderBase,
    fragmentShaderBase
} from '../shaders/shaderBuilder';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import lineWidthShader from '../shaders/lineWidth';
import attribute from '../buffer/attribute';
import elementIndices from '../buffer/elementIndices';
import types from '../buffer/types';
import rebindCurry from '../rebindCurry';

export default () => {
    const program = programBuilder()
        .mode(drawModes.TRIANGLES)
        .subInstanceCount(6);
    let xScale = baseScale();
    let yScale = baseScale();
    let decorate = () => {};
    const lineWidth = lineWidthShader();

    /*
        Line segment from a to b has vertices A, B, C, D -

          A |-------| B
            | \     |
            |a  \  b|
            |     \ |
          D |-------| C

        |AD| = uStrokeWidth
        |AB| = |ab| + uStrokeWidth

        Fragment shader implemented using line segment SDF 
        simplified for starting at the origin (a) -
        https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
    */
    const cornerAttribute = attribute()
        .divisor(0)
        .size(4)
        .type(types.BYTE)
        .data([
            [-1, +1, 1, 0],
            [+1, +1, 0, 1],
            [+1, -1, 0, 1],
            [-1, -1, 1, 0]
        ]);

    program
        .buffers()
        .elementIndices(elementIndices([0, 1, 2, 2, 3, 0]))
        .attribute('aCorner', cornerAttribute);

    const draw = numElements => {
        const vertexShader = shaderBuilder(vertexShaderBase);
        const fragmentShader = shaderBuilder(fragmentShaderBase);

        program.vertexShader(vertexShader).fragmentShader(fragmentShader);

        vertexShader.appendHeader(`
            attribute vec4 aCorner;
            attribute float aCrossValue;
            attribute float aCrossNextValue;
            attribute float aMainValue;
            attribute float aMainNextValue;
            attribute float aDefined;
            attribute float aDefinedNext;

            uniform float uStrokeWidth;
            uniform vec2 uScreen;

            varying float vLength;
            varying vec2 vPosition;
        `);

        vertexShader.appendBody(`
            vec4 value = vec4(aCrossValue, aMainValue, 0.0, 1.0);
            vec4 nextValue = vec4(aCrossNextValue, aMainNextValue, 0.0, 1.0);
        `);

        xScale(program, 'value', 0);
        xScale(program, 'nextValue', 0);
        yScale(program, 'value', 1);
        yScale(program, 'nextValue', 1);

        vertexShader.appendBody(`
            vec2 position = aCorner[2] * value.xy + aCorner[3] * nextValue.xy;

            vec2 direction = normalize((nextValue.xy - value.xy) * uScreen);
            vec2 normal = vec2(direction.y, -direction.x);
            vec2 padding = ((uStrokeWidth / 2.0) / (uScreen / 2.0));
            
            padding *= aDefined * aDefinedNext;
            position += (aCorner[0] * direction + aCorner[1] * normal) * padding;

            gl_Position = vec4(position.x, position.y, 0.0, 1.0);

            vLength = length((nextValue.xy - value.xy) * (uScreen / 2.0));
            vPosition = aCorner.xy * (uStrokeWidth / 2.0);
            vPosition.x += aCorner[3] * vLength;
        `);

        // all fragment shader inputs are pixel denominated

        fragmentShader.appendHeader(`
            uniform float uStrokeWidth;
            varying float vLength;
            varying vec2 vPosition;

            float canFill = 0.0;
            float canStroke = 1.0;
        `);

        fragmentShader.appendBody(`
            vec2 position = vPosition;
            position.x -= clamp(position.x, 0.0, vLength);
            float sdf = length(position) - uStrokeWidth / 2.0;
            if (sdf > 0.5) {
                discard;
            }
        `);

        lineWidth(program);

        decorate(program);

        program(numElements - 1);
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
        'crossNextValueAttribute',
        program.buffers(),
        'attribute',
        'aCrossNextValue'
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
        'mainNextValueAttribute',
        program.buffers(),
        'attribute',
        'aMainNextValue'
    );
    rebindCurry(
        draw,
        'definedAttribute',
        program.buffers(),
        'attribute',
        'aDefined'
    );
    rebindCurry(
        draw,
        'definedNextAttribute',
        program.buffers(),
        'attribute',
        'aDefinedNext'
    );

    return draw;
};
