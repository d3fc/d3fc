import attributeBuilder from '../buffers/attributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import lineShader from '../shaders/line/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';
import uniformBuilder from '../buffers/uniformBuilder';
import width from '../shaders/line/width';

export default () => {
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xValueAttrib = 'aXValue';
    const yValueAttrib = 'aYValue';
    const xNextValueAttrib = 'aNextXValue';
    const yNextValueAttrib = 'aNextYValue';
    const xPrevValueAttrib = 'aPrevXValue';
    const yPrevValueAttrib = 'aPrevYValue';
    const invValueAttrib = 'aSide';
    const widthUniform = 'uWidth';
    const screenUniform = 'uScreen';

    const draw = (numElements) => {
        // we are resetting the shader each draw here, to avoid issues with decorate
        // we'll eventually need a way to change the symbol type here
        const shaderBuilder = lineShader();
        program.vertexShader(shaderBuilder.vertex())
               .fragmentShader(shaderBuilder.fragment())
               .mode(drawModes.TRIANGLE_STRIP);

        // apply the scale to our current, next and previous coordinates
        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);
        xScale.scaleComponent(program, 'next');
        yScale.scaleComponent(program, 'next');
        xScale.scaleComponent(program, 'prev');
        yScale.scaleComponent(program, 'prev');

        // from here we are dealing with pre-scaled vertex positions
        program.vertexShader()
            .appendBody(`if (all(equal(gl_Position.xy, prev.xy))) {
                prev.xy = gl_Position.xy + normalize(gl_Position.xy - next.xy);
            }`)
            .appendBody(`if (all(equal(gl_Position.xy, next.xy))) {
                next.xy = gl_Position.xy + normalize(gl_Position.xy - prev.xy);
            }`)
            .appendBody(`vec2 A = normalize(normalize(gl_Position.xy - prev.xy) * uScreen);`)
            .appendBody(`vec2 B = normalize(normalize(next.xy - gl_Position.xy) * uScreen);`)
            .appendBody(`vec2 tangent = normalize(A + B);`)
            .appendBody(`vec2 miter = vec2(-tangent.y, tangent.x);`)
            .appendBody(`vec2 normalA = vec2(-A.y, A.x);`)
            .appendBody(`float miterLength = 1.0 / dot(miter, normalA);`)
            .appendBody(`gl_Position.xy = gl_Position.xy + (aSide * (miter * uWidth * miterLength)) / uScreen.xy;`);

        program.buffers().uniform(screenUniform, uniformBuilder([
            program.context().canvas.width,
            program.context().canvas.height
        ]));

        width()(program);

        decorate(program);

        program(numElements * 2);
    };

    draw.xValues = (...args) => {
        const builder = program.buffers().attribute(xValueAttrib);
        const next = program.buffers().attribute(xNextValueAttrib);
        const prev = program.buffers().attribute(xPrevValueAttrib);
        const inv = program.buffers().attribute(invValueAttrib);

        let currArray = new Float32Array(args[0].length * 2);
        currArray = currArray.map((d, i) => args[0][Math.floor(i / 2)]);
        const nextArray = new Float32Array(currArray);
        const prevArray = new Float32Array(currArray);
        nextArray.copyWithin(0, 2);
        prevArray.copyWithin(2, 0);

        let invArray = new Float32Array(args[0].length * 2);
        let invValue = -1;
        invArray = invArray.map((d, i) => invValue = invValue * -1);

        if (builder) {
            builder.data(currArray);
            next.data(nextArray);
            prev.data(prevArray);
            inv.data(invArray);
        } else {
            program.buffers().attribute(xValueAttrib, attributeBuilder(currArray).components(1));
            program.buffers().attribute(xNextValueAttrib, attributeBuilder(nextArray).components(1));
            program.buffers().attribute(xPrevValueAttrib, attributeBuilder(prevArray).components(1));
            program.buffers().attribute(invValueAttrib, attributeBuilder(invArray).components(1));
        }
        return draw;
    };

    draw.yValues = (...args) => {
        const builder = program.buffers().attribute(yValueAttrib);
        const next = program.buffers().attribute(yNextValueAttrib);
        const prev = program.buffers().attribute(yPrevValueAttrib);

        let currArray = new Float32Array(args[0].length * 2);
        currArray = currArray.map((d, i) => args[0][Math.floor(i / 2)]);
        const nextArray = new Float32Array(currArray);
        const prevArray = new Float32Array(currArray);
        nextArray.copyWithin(0, 2);
        prevArray.copyWithin(2, 0);

        if (builder) {
            builder.data(currArray);
            next.data(nextArray);
            prev.data(prevArray);
        } else {
            program.buffers().attribute(yValueAttrib, attributeBuilder(currArray).components(1));
            program.buffers().attribute(yNextValueAttrib, attributeBuilder(nextArray).components(1));
            program.buffers().attribute(yPrevValueAttrib, attributeBuilder(prevArray).components(1));
        }
        return draw;
    };

    draw.width = (...args) => {
        const builder = program.buffers().uniform(widthUniform);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().uniform(widthUniform, uniformBuilder(args[0]));
        }
        return draw;
    }

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

    return draw;
};
