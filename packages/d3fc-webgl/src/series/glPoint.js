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
    let type = () => circlePointShader();
    let decorate = () => {};

    const xValueAttrib = 'aXValue';
    const yValueAttrib = 'aYValue';
    const sizeAttrib = 'aSize';

    const draw = (numElements) => {
        // we are resetting the shader each draw here, to avoid issues with decorate
        // we'll eventually need a way to change the symbol type here
        const shaderBuilder = type();
        program.vertexShader(shaderBuilder.vertex())
               .fragmentShader(shaderBuilder.fragment())
               .mode(drawModes.POINTS);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        decorate(program);

        program(numElements);
    };

    draw.xValues = (...args) => {
        const builder = program.buffers().attribute(xValueAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(xValueAttrib, attributeBuilder(args[0]).components(1));
        }
        return draw;
    };

    draw.yValues = (...args) => {
        const builder = program.buffers().attribute(yValueAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(yValueAttrib, attributeBuilder(args[0]).components(1));
        }
        return draw;
    };

    draw.sizes = (...args) => {
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

    draw.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = functor(args[0]);
        return draw;
    };

    rebind(draw, program, 'context');

    return draw;
};

const functor = v => typeof v === 'function' ? v : () => v;