import attributeBuilder from '../buffers/attributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import circlePointShader from '../shaders/point/circle/baseShader';

export default () => {
    let context = null;
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xAttrib = 'aXVertex';
    const yAttrib = 'aYVertex';
    const sizeAttrib = 'aSize';

    // we'll eventually want to switch this out depending on the symbol type for the series
    const shaderBuilder = circlePointShader();
    program.vertexShader(shaderBuilder.vertex());
    program.fragmentShader(shaderBuilder.fragment());

    const draw = () => {
        context.viewport(0, 0, context.canvas.width, context.canvas.height);

        program.mode(context.POINTS);

        xScale.coordinate(0);
        program.apply(xScale);
        yScale.coordinate(1);
        program.apply(yScale);

        decorate();

        program(context);
    };

    // we need this here so that point.js can clean the shaders before each decorate call
    draw.initCircle = () => {
        const shaderBuilder = circlePointShader();
        program.vertexShader(shaderBuilder.vertex());
        program.fragmentShader(shaderBuilder.fragment());

        return draw;
    };

    draw.x = (...args) => {
        const builder = program.buffers().attribute(xAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(xAttrib, attributeBuilder(args[0]).components(1));
        }
        return draw;
    };

    draw.y = (...args) => {
        const builder = program.buffers().attribute(yAttrib);
        if (builder) {
            builder.data(args[0]);
        } else {
            program.buffers().attribute(yAttrib, attributeBuilder(args[0]).components(1));
        }
        return draw;
    };

    draw.size = (...args) => {
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

    draw.program = (...args) => {
        if (!args.length) {
            return program;
        }
        program = args[0];
        return draw;
    };

    draw.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
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

    return draw;
};
