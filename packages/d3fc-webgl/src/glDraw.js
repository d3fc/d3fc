import glScaleBase from './scale/glScaleBase';
import programBuilder from './program/programBuilder';

export default () => {
    let context = null;
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const draw = () => {
        context.viewport(0, 0, context.canvas.width, context.canvas.height);
        program.apply(xScale);
        program.apply(yScale);
        decorate();
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
