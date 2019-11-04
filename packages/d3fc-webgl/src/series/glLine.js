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
    const cornerValueAttrib = 'aCorner';
    const definedAttrib = 'aDefined';
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
            .appendBody(`vec2 point = normalize(A - B);`)
            .appendBody(`if (miterLength > 10.0 && sign(aCorner.x * dot(miter, point)) > 0.0) {
                gl_Position.xy = gl_Position.xy - (sign(dot(normalA, miter)) * aCorner.x * aCorner.y * uWidth * normalA) / uScreen.xy;
            } else {
                gl_Position.xy = gl_Position.xy + (aCorner.x * miter * uWidth * miterLength) / uScreen.xy;
            }`);

        program.buffers().uniform(screenUniform, uniformBuilder([
            program.context().canvas.width,
            program.context().canvas.height
        ]));

        width()(program);

        decorate(program);

        program(numElements * 4);
    };

    draw.xValues = (...args) => {
        const builder = program.buffers().attribute(xValueAttrib);
        const next = program.buffers().attribute(xNextValueAttrib);
        const prev = program.buffers().attribute(xPrevValueAttrib);
        const corner = program.buffers().attribute(cornerValueAttrib);

        let currArray = new Float32Array(args[0].length * 4);
        currArray = currArray.map((d, i) => args[0][Math.floor(i / 4)]);
        const nextArray = new Float32Array(currArray);
        const prevArray = new Float32Array(currArray);
        nextArray.copyWithin(0, 4);
        prevArray.copyWithin(4, 0);

        let cornerArray = new Float32Array(args[0].length * 8);
        // x and y positions of the 4 corners for the vertex join.
        let cornerValues = [-1, -1, 1, -1, -1, 1, 1, 1];
        cornerArray = cornerArray.map((d, i) => cornerValues[i % 8]);

        if (builder) {
            builder.data(currArray);
            next.data(nextArray);
            prev.data(prevArray);
            corner.data(cornerArray);
        } else {
            program.buffers().attribute(xValueAttrib, attributeBuilder(currArray));
            program.buffers().attribute(xNextValueAttrib, attributeBuilder(nextArray));
            program.buffers().attribute(xPrevValueAttrib, attributeBuilder(prevArray));
            program.buffers().attribute(cornerValueAttrib, attributeBuilder(cornerArray).components(2));
        }
        return draw;
    };

    draw.yValues = (...args) => {
        const builder = program.buffers().attribute(yValueAttrib);
        const next = program.buffers().attribute(yNextValueAttrib);
        const prev = program.buffers().attribute(yPrevValueAttrib);

        let currArray = new Float32Array(args[0].length * 4);
        currArray = currArray.map((d, i) => args[0][Math.floor(i / 4)]);
        const nextArray = new Float32Array(currArray);
        const prevArray = new Float32Array(currArray);
        nextArray.copyWithin(0, 4);
        prevArray.copyWithin(4, 0);

        if (builder) {
            builder.data(currArray);
            next.data(nextArray);
            prev.data(prevArray);
        } else {
            program.buffers().attribute(yValueAttrib, attributeBuilder(currArray));
            program.buffers().attribute(yNextValueAttrib, attributeBuilder(nextArray));
            program.buffers().attribute(yPrevValueAttrib, attributeBuilder(prevArray));
        }
        return draw;
    };

    draw.defined = (...args) => {
        const builder = program.buffers().attribute(definedAttrib);

        const definedArray = new Float32Array(args[0].length * 4);
        
        const length = definedArray.length;
        definedArray[0] = args[0][0];
        definedArray[length - 2] = args[0][Math.floor((length - 2) / 4)];
        definedArray[length - 1] = args[0][Math.floor((length - 1) / 4)];

        for (let i = 1; i < definedArray.length - 2; i += 1) {
            const val = args[0][Math.floor(i / 4)];
            const nextVal = args[0][Math.floor((i + 1) / 4)];
            definedArray[i] = val;

            if (val && !nextVal) {
                definedArray[i - 1] = 0;
                definedArray[i] = 0;
            } else if (!val && nextVal) {
                definedArray[i + 1] = 0;
                definedArray[i + 2] = 0;
                i += 2;
            }
        }

        if (builder) {
            builder.data(definedArray);
        } else {
            program.buffers().attribute(definedAttrib, attributeBuilder(definedArray).components(1));
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
