import attributeBuilder from '../buffers/attributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import circlePointShader from '../shaders/point/circle/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xAttrib = 'aXVertex';
    const yAttrib = 'aYVertex';
    const sizeAttrib = 'aSize';

    const draw = (numPoints) => {
        // we are resetting the shader each draw here, to avoid issues with decorate
        // we'll eventually need a way to change the symbol type here
        const shaderBuilder = circlePointShader();
        program.vertexShader(shaderBuilder.vertex());
        program.fragmentShader(shaderBuilder.fragment());

        if (numPoints !== undefined) {
            program.numElements(numPoints);
        }
        program.mode(drawModes.POINTS);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        decorate(program);

        program();
    };

    draw.xValues = (...args) => {
        const builder = program.buffers().attribute(xAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(xAttrib, attributeBuilder(args[0]).components(1));
        }
        return draw;
    };

    draw.yValues = (...args) => {
        const builder = program.buffers().attribute(yAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(yAttrib, attributeBuilder(args[0]).components(1));
        }
        return draw;
    };

    draw.sizeValues = (...args) => {
        const builder = program.buffers().attribute(sizeAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(sizeAttrib, attributeBuilder(args[0]).components(1));
        }
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

    return draw;
};
